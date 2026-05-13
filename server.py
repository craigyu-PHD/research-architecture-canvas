#!/usr/bin/env python3
"""Local web server and research-structure analysis API.

The app intentionally runs on the Python standard library only.  The analysis
engine is deterministic by default, with an optional OpenAI-compatible adapter
left behind for future API-key based LLM integration.
"""

from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = ROOT

TYPE_KEYWORDS = {
    "input": [
        "資料",
        "來源",
        "樣本",
        "文本",
        "文獻",
        "訪談",
        "問卷",
        "政策",
        "檔案",
        "input",
        "source",
        "data",
    ],
    "theory": ["理論", "架構", "概念", "假設", "變項", "模型", "命題", "framework", "theory"],
    "analysis": [
        "分析",
        "編碼",
        "比較",
        "迴歸",
        "統計",
        "質性",
        "量化",
        "網絡",
        "分類",
        "萃取",
        "歸納",
        "analysis",
        "coding",
    ],
    "validation": ["檢核", "驗證", "信度", "效度", "穩健", "三角", "交叉", "robust", "valid"],
    "output": ["結論", "發現", "建議", "輸出", "成果", "貢獻", "報告", "output", "finding", "result"],
}

SECTION_ALIASES = {
    "title": ["研究主題", "圖表標題", "題目", "title"],
    "subtitle": ["副標題", "研究目的", "目的", "摘要", "subtitle"],
    "input": ["資料來源", "input", "資料", "樣本", "研究材料"],
    "flow": ["主要研究流程", "研究流程", "main research flow", "流程", "步驟"],
    "core": ["核心分析模組", "核心分析", "分析模組", "core analytical module"],
    "output": ["研究輸出", "output", "成果", "研究成果"],
    "parameters": ["研究參數", "key parameters", "參數", "變項與參數"],
    "notes": ["註解", "notes", "備註", "限制"],
}

ACADEMIC_FIGURE_STYLE_GUIDE = """請固定參考使用者一開始提供的 ViT / Encoder Transformer 學術圖鑑風格，將它轉成以下文字化設計標準：
1. 白色論文圖底，黑色高權重標題，副標題清楚但不搶主圖。
2. 主流程採中心對齊或清楚的分層網格，圖框間距一致，避免小畫家式任意散落。
3. 色彩以淡色填底加高對比邊框：藍=嵌入/輸入，紅=注意力/判斷，橙=交叉或方法補充，綠=MLP/輸出，灰=規範/殘差/檢核。
4. 圖框文字短而可讀，標題 12 字以內，補充文字 30 字以內，寧可增加節點也不要塞爆單一框。
5. 線條要有語意：主流程用實線箭頭，補充關係用虛線，回饋修正用曲線或雙向箭頭；箭頭應指向圖框邊界中心或最合理的側邊。
6. 視覺上要像正式論文/方法圖：一致線寬、穩定圓角、乾淨圖例、底部 Flow 條，以及必要的 Notes/Legend，而不是裝飾性模板。"""


@dataclass
class ParsedSections:
    title: str
    subtitle: str
    input_items: List[str]
    flow_steps: List[str]
    core_steps: List[str]
    outputs: List[str]
    parameters: List[str]
    notes: List[str]
    raw_lines: List[str]


def compact_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def strip_bullet(line: str) -> str:
    line = compact_whitespace(line)
    line = re.sub(r"^[-*•]\s*", "", line)
    line = re.sub(r"^\(?[0-9一二三四五六七八九十]+\)?[.、)]\s*", "", line)
    return line.strip()


def split_inline_items(value: str) -> List[str]:
    cleaned = compact_whitespace(value)
    cleaned = re.sub(r"^[：:]\s*", "", cleaned)
    if not cleaned:
        return []
    parts = re.split(r"\s*(?:→|->|=>|-->|／|/|；|;|\n)\s*", cleaned)
    parts = [strip_bullet(part) for part in parts if strip_bullet(part)]
    return parts or [cleaned]


def section_key_for(line: str) -> Tuple[Optional[str], str]:
    normalized = line.strip().strip("【】[]# ")
    for key, aliases in SECTION_ALIASES.items():
        for alias in aliases:
            pattern = rf"^{re.escape(alias)}\s*[:：]?\s*(.*)$"
            match = re.match(pattern, normalized, flags=re.IGNORECASE)
            if match:
                return key, match.group(1).strip()
    return None, line


def parse_sections(text: str) -> ParsedSections:
    raw_lines = [compact_whitespace(line) for line in text.replace("\r", "\n").split("\n")]
    raw_lines = [line for line in raw_lines if line]

    buckets: Dict[str, List[str]] = {
        "title": [],
        "subtitle": [],
        "input": [],
        "flow": [],
        "core": [],
        "output": [],
        "parameters": [],
        "notes": [],
        "loose": [],
    }
    current: Optional[str] = None

    for line in raw_lines:
        key, rest = section_key_for(line)
        if key:
            current = key
            if rest:
                buckets[key].extend(split_inline_items(rest))
            continue
        if current:
            buckets[current].extend(split_inline_items(line))
        else:
            buckets["loose"].extend(split_inline_items(line))

    if not any(buckets[key] for key in ("input", "flow", "core", "output")):
        inferred = infer_steps_from_loose_text(text)
        buckets["flow"].extend(inferred)

    title = first_or_default(buckets["title"], infer_title(raw_lines))
    subtitle = first_or_default(buckets["subtitle"], "研究流程與方法架構圖")

    input_items = clean_unique(buckets["input"])
    flow_steps = clean_unique(buckets["flow"])
    core_steps = clean_unique(buckets["core"])
    outputs = clean_unique(buckets["output"])
    parameters = clean_unique(buckets["parameters"])
    notes = clean_unique(buckets["notes"])

    if not input_items:
        input_items = infer_by_type(buckets["loose"] + flow_steps, "input")[:4]
    if not outputs:
        outputs = infer_by_type(buckets["loose"] + flow_steps, "output")[:4]
    if not core_steps:
        core_steps = infer_core_steps(flow_steps)

    flow_steps = trim_step_list(flow_steps, input_items, outputs, core_steps)
    if not flow_steps:
        flow_steps = [
            "資料蒐集與研究問題界定",
            "文獻整理與理論架構建立",
            "研究材料前處理與編碼",
            "核心分析與比較解釋",
            "研究發現、限制與建議",
        ]

    return ParsedSections(
        title=title,
        subtitle=subtitle,
        input_items=input_items or ["研究文本", "文獻資料", "政策文件", "訪談或問卷資料"],
        flow_steps=flow_steps[:8],
        core_steps=core_steps[:6],
        outputs=outputs or ["研究發現", "理論貢獻", "政策建議"],
        parameters=parameters or infer_parameters(text),
        notes=notes or infer_notes(text),
        raw_lines=raw_lines,
    )


def first_or_default(values: List[str], fallback: str) -> str:
    return values[0] if values else fallback


def infer_title(lines: List[str]) -> str:
    if not lines:
        return "研究架構圖"
    for line in lines[:5]:
        if len(line) <= 42 and not section_key_for(line)[0]:
            return strip_bullet(line)
    return "研究架構圖"


def extract_arrow_sequences(text: str) -> List[str]:
    results: List[str] = []
    for line in text.splitlines():
        if any(token in line for token in ("→", "->", "=>", "-->")):
            results.extend(split_inline_items(line))
    return results


def infer_steps_from_loose_text(text: str) -> List[str]:
    steps = extract_arrow_sequences(text)
    numbered = re.findall(r"(?:^|\n)\s*(?:\d+|[一二三四五六七八九十]+)[.、)]\s*([^\n]+)", text)
    steps.extend(strip_bullet(item) for item in numbered)
    if steps:
        return clean_unique(steps)

    sentences = re.split(r"[。.!?？]\s*", text)
    candidates = [compact_whitespace(sentence) for sentence in sentences if len(compact_whitespace(sentence)) >= 6]
    return candidates[:7]


def clean_unique(items: Iterable[str]) -> List[str]:
    seen = set()
    clean: List[str] = []
    for item in items:
        value = strip_bullet(item).strip("，,。.;； ")
        value = re.sub(r"^[-–—]\s*", "", value)
        if not value or value in seen:
            continue
        seen.add(value)
        clean.append(value)
    return clean


def infer_by_type(items: Iterable[str], block_type: str) -> List[str]:
    keywords = TYPE_KEYWORDS[block_type]
    return [item for item in clean_unique(items) if any(keyword.lower() in item.lower() for keyword in keywords)]


def infer_core_steps(flow_steps: List[str]) -> List[str]:
    analysis_steps = infer_by_type(flow_steps, "analysis")
    if analysis_steps:
        return analysis_steps[:5]
    return ["資料清理", "概念編碼", "類型歸納", "比較分析", "解釋與檢核"]


def infer_parameters(text: str) -> List[str]:
    params = []
    if re.search(r"\d{4}", text):
        years = re.findall(r"\d{4}(?:\s*[-~至]\s*\d{4})?", text)
        params.append(f"研究期間：{years[0]}")
    if re.search(r"(樣本|案例|文獻|訪談|問卷).{0,8}\d+", text):
        params.append("樣本規模：依輸入文本標示")
    params.extend(["分析單位：研究個案／文本段落", "方法：文本解析、分類與流程建模", "檢核：人工校讀與版面調整"])
    return clean_unique(params)[:6]


def infer_notes(text: str) -> List[str]:
    notes = ["AI 初稿需由研究者確認概念關係與因果方向。", "框內文字建議保持精簡，正式投稿前可再進行版面校稿。"]
    if len(text) < 180:
        notes.insert(0, "輸入內容偏短，建議補充研究問題、資料來源與分析方法。")
    return notes


def classify_step(step: str, index: int, total: int) -> str:
    lowered = step.lower()
    for block_type, keywords in TYPE_KEYWORDS.items():
        if any(keyword.lower() in lowered for keyword in keywords):
            if block_type == "analysis":
                return "core" if index == max(1, total // 2) or "核心" in step else "analysis"
            return block_type
    if index == 0:
        return "input"
    if index == total - 1:
        return "output"
    if 1 <= index <= 2:
        return "theory"
    if index >= total - 2:
        return "validation"
    return "analysis"


def trim_step_list(
    flow_steps: List[str], input_items: List[str], outputs: List[str], core_steps: List[str]
) -> List[str]:
    combined = clean_unique(flow_steps)
    has_input_step = any(any(keyword in step for keyword in TYPE_KEYWORDS["input"]) for step in combined[:2])
    if input_items and not has_input_step:
        combined.insert(0, "資料來源與研究問題界定")
    if core_steps and not any(any(core in step for core in core_steps) for step in combined):
        combined.insert(max(2, len(combined) // 2), "核心分析模組")
    has_output_step = any(any(keyword in step for keyword in TYPE_KEYWORDS["output"]) for step in combined[-2:])
    if outputs and not has_output_step:
        combined.append("研究輸出與結論建議")
    return clean_unique(combined)


def summarize_items(items: List[str], limit: int = 3) -> str:
    usable = [item for item in items if item]
    if len(usable) <= limit:
        return "；".join(usable)
    return "；".join(usable[:limit]) + f"；另 {len(usable) - limit} 項"


def node_body_for(step: str, parsed: ParsedSections, block_type: str) -> str:
    if block_type == "input":
        return summarize_items(parsed.input_items)
    if block_type == "output":
        return summarize_items(parsed.outputs)
    if block_type == "core":
        return " → ".join(parsed.core_steps[:5])
    if block_type == "theory":
        return "概念定義、文獻對話與研究假設"
    if block_type == "validation":
        return "一致性檢核、限制說明與研究者校訂"
    return "依研究問題進行分類、比較與解釋"


def build_diagram(parsed: ParsedSections) -> Dict[str, Any]:
    canvas = {"width": 1280, "height": 1780}
    center_x = 430
    y_start = 250
    gap = 28
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, str]] = []

    visible_steps = parsed.flow_steps[:7]
    for index, step in enumerate(visible_steps):
        block_type = classify_step(step, index, len(visible_steps))
        if "核心分析" in step or "分析模組" in step:
            block_type = "core"
        height = 250 if block_type == "core" else 112
        y = y_start + sum((250 if n.get("type") == "core" else 112) + gap for n in nodes)
        node = {
            "id": f"node-{index + 1}",
            "type": block_type,
            "number": index + 1,
            "x": center_x,
            "y": y,
            "w": 500,
            "h": height,
            "title": step[:72],
            "body": node_body_for(step, parsed, block_type),
            "children": parsed.core_steps[:5] if block_type == "core" else [],
        }
        nodes.append(node)

    for previous, current in zip(nodes, nodes[1:]):
        edges.append({"id": f"edge-{previous['id']}-{current['id']}", "from": previous["id"], "to": current["id"]})

    flow = " → ".join([node["title"] for node in nodes])
    if len(flow) > 130:
        flow = " → ".join([node["title"] for node in nodes[:5]]) + " → ..."

    suggestions = build_suggestions(parsed, nodes)

    return {
        "title": parsed.title,
        "subtitle": parsed.subtitle,
        "canvas": canvas,
        "nodes": nodes,
        "edges": edges,
        "legend": [
            {"type": "input", "label": "Input / 資料來源"},
            {"type": "theory", "label": "Theory / 理論架構"},
            {"type": "core", "label": "Core Analysis / 核心分析"},
            {"type": "validation", "label": "Validation / 檢核"},
            {"type": "output", "label": "Output / 研究輸出"},
            {"type": "optional", "label": "Optional / 補充分析"},
        ],
        "parameters": parsed.parameters,
        "notes": parsed.notes,
        "flow": flow,
        "suggestions": suggestions,
        "meta": {
            "engine": "local-rule-analysis",
            "generatedAt": int(time.time()),
            "llmEnabled": bool(os.environ.get("RESEARCH_CANVAS_LLM_URL")),
        },
    }


def build_suggestions(parsed: ParsedSections, nodes: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    suggestions: List[Dict[str, str]] = []
    if len(parsed.input_items) < 2:
        suggestions.append({"level": "warn", "title": "資料來源不足", "body": "建議補上樣本、資料期間或文本來源，左側 Input 區塊會更像論文方法圖。"})
    if not parsed.core_steps or len(parsed.core_steps) < 3:
        suggestions.append({"level": "warn", "title": "核心分析可再拆細", "body": "核心分析模組至少拆成資料清理、編碼、分析、檢核等子步驟，圖面會更有說服力。"})
    if len(nodes) > 6:
        suggestions.append({"level": "info", "title": "流程偏長", "body": "可以把部分步驟合併進核心分析框，避免主線太長。"})
    if not infer_by_type(parsed.parameters, "validation") and not any("檢核" in note for note in parsed.notes):
        suggestions.append({"level": "info", "title": "補上檢核機制", "body": "研究架構圖通常需要標示效度、信度、穩健性或人工校讀。"})
    suggestions.append({"level": "ok", "title": "可編輯初稿已生成", "body": "你可以拖曳模組、點選後改文字，也可以匯出 SVG/PNG/JSON。"})
    return suggestions


def maybe_call_external_llm(text: str, diagram_type: str = "flowchart", mode: str = "local") -> Optional[Dict[str, Any]]:
    """Optional LLM adapter.

    Two routes are supported:
    - Custom OpenAI-compatible endpoint through environment variables.
    - Pollinations OpenAI-compatible endpoint in deep mode, no API key required
      for basic usage at the time this app was updated.
    """

    base_url = os.environ.get("RESEARCH_CANVAS_LLM_URL")
    api_key = os.environ.get("RESEARCH_CANVAS_LLM_API_KEY", "")
    model = os.environ.get("RESEARCH_CANVAS_LLM_MODEL", "openai")
    if not base_url and mode == "deep":
        base_url = "https://text.pollinations.ai/openai"
    if not base_url:
        return None

    source = text
    if mode == "deep" and len(text) > 14000:
        summaries = []
        chunks = chunk_text(text, 7000)[:14]
        for index, chunk in enumerate(chunks, 1):
            summary_prompt = (
                f"請閱讀第 {index} 段，萃取研究問題、理論概念、資料、方法、流程、變項、因果或回饋關係與研究輸出。"
                "請用繁體中文條列，700 字內。\n\n"
                + chunk
            )
            try:
                summary = call_openai_compatible(base_url, api_key, model, [
                    {"role": "system", "content": "You summarize academic articles for diagram generation."},
                    {"role": "user", "content": summary_prompt},
                ], expect_json=False)
            except RuntimeError:
                return None
            summaries.append(f"第 {index} 段摘要：\n{summary}")
        source = "\n\n".join(summaries)

    prompt = build_llm_diagram_prompt(source, diagram_type)
    try:
        content = call_openai_compatible(base_url, api_key, model, [
            {"role": "system", "content": "You are an academic diagram architect. Return valid JSON only."},
            {"role": "user", "content": prompt},
        ], expect_json=True)
    except RuntimeError:
        return None
    try:
        result = json.loads(extract_json_object(content))
    except json.JSONDecodeError:
        return None
    result.setdefault("meta", {})
    result["meta"]["engine"] = "external-llm"
    result["meta"]["provider"] = "pollinations" if "pollinations.ai" in base_url else "custom-openai-compatible"
    return result


def build_llm_diagram_prompt(text: str, diagram_type: str) -> str:
    return f"""請把下列研究文字轉成「學術研究架構圖」JSON。請真正判斷研究邏輯，不要只摘句子。

參考圖鑑風格標準:
{ACADEMIC_FIGURE_STYLE_GUIDE}

輸出只允許 JSON，不要 Markdown。JSON schema:
{{
  "title": "圖標題",
  "subtitle": "副標題",
  "diagramType": "{diagram_type}",
  "nodes": [
    {{"id":"n1","number":1,"title":"短標題","body":"說明","role":"input|theory|concept|method|analysis|validation|output|note","shape":"rounded|pill|diamond|circle|ellipse|triangle|hexagon|parallelogram|document|subroutine|cylinder|table|callout|swimlane|legend|brace","palette":"process|concept|data|method|decision|output|reference|warning|node","x":120,"y":240,"w":300,"h":110}}
  ],
  "edges": [
    {{"id":"e1","from":"n1","to":"n2","label":"關係文字","line":"curved|straight|elbow","style":"solid|dashed|dotted|feedback","arrow":"end|both|start|none","arrowStyle":"triangle|open|diamond|dot","strokeWidth":2,"dashLength":8,"dashGap":7,"curveTension":0.65,"autoRoute":true}}
  ],
  "legend": {{"shape:palette":"圖例文字"}},
  "flow": "底部流程文字",
  "suggestions": [{{"level":"ok|info|warn","title":"建議標題","body":"建議內容"}}]
}}

排版要求:
- 節點 5 到 10 個，不要擠成一條直線。
- 研究架構圖要有層次、群組、回饋路徑或虛線關聯。
- 請輸出接近範例圖鑑的專業論文圖：有主圖、圖例、底部 Flow，線條端點要貼到圖框合理側邊。
- 菱形只用於判斷或檢核，尺寸請接近正方形，避免文字超出。
- 框內標題 12 字以內，body 30 字以內。
- 若原文是整篇文章，請歸納成研究問題、理論/概念、資料、方法、分析、發現/輸出，不要逐段照抄。

研究文字:
{text}"""


def call_openai_compatible(
    base_url: str,
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    expect_json: bool,
) -> str:
    endpoint = openai_compatible_endpoint(base_url)
    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
    }
    if expect_json:
        payload["response_format"] = {"type": "json_object"}
    headers = {"Content-Type": "application/json", "User-Agent": "research-canvas/0.2"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        raise RuntimeError(f"LLM request failed: {exc}") from exc
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    if not content:
        raise RuntimeError("LLM returned empty content")
    return content


def openai_compatible_endpoint(base_url: str) -> str:
    cleaned = base_url.rstrip("/")
    if cleaned.endswith("/chat/completions") or cleaned.endswith("/openai"):
        return cleaned
    if cleaned.endswith("/v1"):
        return cleaned + "/chat/completions"
    return cleaned + "/v1/chat/completions"


def extract_json_object(content: str) -> str:
    cleaned = content.strip()
    cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
    cleaned = re.sub(r"```$", "", cleaned).strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start < 0 or end <= start:
        raise json.JSONDecodeError("No JSON object found", cleaned, 0)
    return cleaned[start : end + 1]


def chunk_text(text: str, size: int) -> List[str]:
    return [text[index : index + size] for index in range(0, len(text), size)]


def analyze_text(text: str, diagram_type: str = "flowchart", mode: str = "local") -> Dict[str, Any]:
    llm_diagram = maybe_call_external_llm(text, diagram_type, mode)
    if llm_diagram and "nodes" in llm_diagram:
        return llm_diagram
    parsed = parse_sections(text)
    return build_diagram(parsed)


class ResearchCanvasHandler(SimpleHTTPRequestHandler):
    server_version = "ResearchCanvas/0.1"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def log_message(self, format: str, *args: Any) -> None:
        print(f"[research-canvas] {self.address_string()} - {format % args}")

    def end_json(self, status: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        if clean_path == "/api/health":
            self.end_json(200, {"ok": True, "engine": "local-rule-analysis"})
            return
        if clean_path == "/":
            self.path = "/index.html"
        else:
            self.path = clean_path
        super().do_GET()

    def do_POST(self) -> None:
        if self.path != "/api/analyze":
            self.end_json(404, {"ok": False, "error": "Not found"})
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(content_length)
            payload = json.loads(raw.decode("utf-8") or "{}")
            text = str(payload.get("text", "")).strip()
            diagram_type = str(payload.get("diagramType", "flowchart")).strip() or "flowchart"
            mode = str(payload.get("mode", "local")).strip() or "local"
            if not text:
                self.end_json(400, {"ok": False, "error": "請先貼上研究流程或研究架構文字。"})
                return
            diagram = analyze_text(text, diagram_type, mode)
            self.end_json(200, {"ok": True, "diagram": diagram})
        except Exception as exc:  # pragma: no cover - defensive API boundary
            self.end_json(500, {"ok": False, "error": str(exc)})


def run() -> None:
    port = int(os.environ.get("PORT", "8765"))
    host = os.environ.get("HOST", "127.0.0.1")
    httpd = ThreadingHTTPServer((host, port), ResearchCanvasHandler)
    print(f"Research Architecture Canvas running at http://{host}:{port}")
    print(f"Serving static files from {PUBLIC_DIR}")
    httpd.serve_forever()


if __name__ == "__main__":
    run()
