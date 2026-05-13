const svgNS = "http://www.w3.org/2000/svg";

const sampleText = `研究主題：AI 輔助決策下數位治理與民權保障之研究
副標題：從文獻綜述、制度分析到政策建議的研究流程

資料來源：
1. 數位政府與 AI 治理相關文獻
2. OECD、UN、EU 與台灣政策文件
3. 公共參與平台與自動化決策制度案例
4. 博士論文口試計畫書既有章節草稿

研究架構：
民權保障理論 → 程序負擔 → 數位落差 → AI 行政裁量 → 制度問責

主要研究流程：
1. 研究問題界定與資料來源盤點
2. 文獻綜述與理論架構建立
3. 核心分析模組
4. 制度案例比較與研究命題修正
5. 研究發現、理論貢獻與政策建議

核心分析模組：
資料清理 → 主題編碼 → 民權保障面向分類 → 程序負擔分析 → 數位落差檢核 → 綜合解釋

研究輸出：
研究架構圖、章節安排、理論貢獻、政策建議、後續檢核清單

研究參數：
研究期間：2020-2026
分析單位：政策文件、學術文獻、平台案例
方法：文獻分析、制度分析、比較案例研究

註解：
需區分制度設計、技術工具與公民權利效果，不將平台使用率直接視為民主深化。`;

const templates = {
  thesis: `研究主題：博士論文研究設計
資料來源：文獻、政策文件、制度案例、訪談資料
研究架構：研究問題 → 理論架構 → 研究命題 → 分析方法 → 論文章節
主要研究流程：問題意識 → 文獻綜述 → 理論框架 → 研究設計 → 資料分析 → 章節撰寫 → 口試修正
核心分析模組：概念定義 → 材料編碼 → 類型建構 → 個案比較 → 理論回扣
研究輸出：五章架構、研究發現、理論貢獻、政策建議、參考文獻`,
  journal: `研究主題：期刊論文方法架構
資料來源：研究樣本、公開資料庫、政策文件、既有文獻
研究架構：研究問題 → 文獻缺口 → 變項關係 → 方法選擇 → 實證發現
主要研究流程：資料蒐集 → 前處理 → 操作型定義 → 分析模型 → 穩健性檢核 → 討論與結論
核心分析模組：資料清理 → 變項建構 → 模型估計 → 敏感度分析 → 圖表輸出
研究輸出：摘要、方法章、結果圖表、討論、限制、參考文獻`,
  policy: `研究主題：政策分析流程
資料來源：政策白皮書、法規、預算資料、利害關係人意見、新聞資料
研究架構：問題界定 → 政策工具 → 執行機制 → 影響評估 → 改革建議
主要研究流程：議題掃描 → 資料蒐集 → 利害關係人分析 → 方案比較 → 風險檢核 → 政策建議
核心分析模組：政策目標 → 工具分類 → 可行性分析 → 成本效益 → 公平性檢核
研究輸出：政策圖像、風險清單、替代方案、執行路徑`,
  literature: `研究主題：文獻綜述流程
資料來源：期刊論文、專書、研究報告、法規與政策文件
研究架構：檢索策略 → 納入排除 → 主題分類 → 理論整合 → 研究缺口
主要研究流程：關鍵字設計 → 資料庫檢索 → 文獻篩選 → 摘要編碼 → 主題矩陣 → 綜述撰寫
核心分析模組：書目清理 → 摘要萃取 → 主題編碼 → 理論脈絡 → 缺口辨識
研究輸出：文獻矩陣、分類索引、研究缺口、章節建議、參考文獻`,
};

const colors = {
  question: { fill: "#f8f1ff", stroke: "#7b4fc9", dark: "#40276f" },
  input: { fill: "#eef3ff", stroke: "#405cda", dark: "#1d2f88" },
  framework: { fill: "#f2ecff", stroke: "#7659d8", dark: "#45328c" },
  process: { fill: "#eef8ff", stroke: "#177da8", dark: "#0d536f" },
  theory: { fill: "#f0edff", stroke: "#7560d6", dark: "#433986" },
  method: { fill: "#fff6df", stroke: "#c88a1f", dark: "#725011" },
  analysis: { fill: "#fff7e8", stroke: "#d79b22", dark: "#7b5510" },
  core: { fill: "#fff0f0", stroke: "#ef3434", dark: "#8c1e1e" },
  validation: { fill: "#f4f5f6", stroke: "#596069", dark: "#343941" },
  output: { fill: "#edfff3", stroke: "#0c8f48", dark: "#07562d" },
  limitation: { fill: "#f7f2ea", stroke: "#8b7462", dark: "#504035" },
  reference: { fill: "#f5f8ed", stroke: "#6b8a20", dark: "#3e5111" },
  optional: { fill: "#fff8d8", stroke: "#d7a41f", dark: "#7a5d10" },
};

const typeLabels = {
  question: "研究問題",
  input: "資料來源",
  framework: "研究架構",
  process: "研究流程",
  theory: "理論架構",
  method: "研究方法",
  analysis: "一般分析",
  core: "核心分析",
  validation: "檢核機制",
  output: "研究輸出",
  limitation: "限制說明",
  reference: "參考文獻",
  optional: "補充分析",
};

const keywordMap = {
  question: ["研究問題", "問題", "疑問", "RQ", "question"],
  input: ["資料", "來源", "樣本", "文本", "文獻", "訪談", "問卷", "政策", "檔案", "source", "data"],
  framework: ["研究架構", "架構", "框架", "概念圖", "framework"],
  process: ["研究流程", "流程", "步驟", "程序", "process", "workflow"],
  theory: ["理論", "概念", "假設", "命題", "變項", "theory"],
  method: ["方法", "模型", "設計", "抽樣", "統計", "method", "design"],
  core: ["核心", "分析", "編碼", "比較", "迴歸", "網絡", "分類", "萃取", "analysis", "coding"],
  validation: ["檢核", "驗證", "信度", "效度", "穩健", "三角", "valid", "robust"],
  output: ["結論", "發現", "建議", "輸出", "成果", "貢獻", "報告", "output", "finding", "result"],
  limitation: ["限制", "侷限", "風險", "注意", "limitation"],
  reference: ["參考文獻", "引用", "bibliography", "reference"],
};

const sectionAliases = {
  title: ["研究主題", "圖表標題", "題目", "title"],
  subtitle: ["副標題", "研究目的", "目的", "摘要", "subtitle"],
  input: ["資料來源", "input", "資料", "樣本", "研究材料"],
  framework: ["研究架構", "架構", "概念架構", "framework"],
  flow: ["主要研究流程", "研究流程", "main research flow", "流程", "步驟"],
  core: ["核心分析模組", "核心分析", "分析模組", "core analytical module"],
  output: ["研究輸出", "output", "成果", "研究成果"],
  parameters: ["研究參數", "key parameters", "參數", "變項與參數"],
  notes: ["註解", "notes", "備註", "限制"],
};

let state = {
  title: "研究架構圖",
  subtitle: "貼上研究流程後，按 AI 解析生成",
  canvas: { width: 1280, height: 1780 },
  nodes: [],
  edges: [],
  legend: defaultLegend(),
  parameters: ["分析單位：研究文本／流程節點", "方法：AI 解析與人工編修", "輸出：SVG、PNG、JSON"],
  notes: ["先貼上研究流程，系統會產生可拖曳與可編輯的初稿。"],
  flow: "資料輸入 → AI 解析 → 可編輯畫布 → 匯出圖檔",
  suggestions: [],
  meta: { engine: "initial" },
};

let selected = { kind: null, id: null };
let zoom = 1;
let drag = null;
let lineMode = false;
let pendingLineSource = null;
let apiAbort = null;

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  loadSettings();
  loadInitialState();
  render();
  requestAnimationFrame(fitToView);
});

function bindElements() {
  [
    "engineStatus",
    "leftToggleBtn",
    "rightToggleBtn",
    "saveLocalBtn",
    "resetBtn",
    "researchInput",
    "loadSampleBtn",
    "analyzeBtn",
    "clearInputBtn",
    "analysisPrimary",
    "analysisSecondary",
    "onlineAssistToggle",
    "apiPresetInput",
    "apiBaseInput",
    "apiModelInput",
    "apiKeyInput",
    "toolGrid",
    "templateGrid",
    "autoArrangeBtn",
    "lineModeBtn",
    "lineModeHint",
    "duplicateBtn",
    "deleteBtn",
    "zoomOutBtn",
    "zoomInBtn",
    "zoomSlider",
    "fitBtn",
    "expandCanvasBtn",
    "zoomLabel",
    "exportSvgBtn",
    "exportPngBtn",
    "exportJsonBtn",
    "importJsonInput",
    "diagramCanvas",
    "suggestions",
    "suggestionCount",
    "emptyInspector",
    "nodeInspectorForm",
    "edgeInspectorForm",
    "nodeTitleInput",
    "nodeBodyInput",
    "nodeTypeInput",
    "nodeWidthInput",
    "nodeHeightInput",
    "edgeLabelInput",
    "edgeStyleInput",
    "diagramTitleInput",
    "diagramSubtitleInput",
    "diagramFlowInput",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.loadSampleBtn.addEventListener("click", () => {
    els.researchInput.value = sampleText;
  });
  els.clearInputBtn.addEventListener("click", () => {
    els.researchInput.value = "";
    setAnalysisStatus("待輸入", "本地引擎不會把文字送出瀏覽器");
  });
  els.analyzeBtn.addEventListener("click", analyzeInput);
  els.saveLocalBtn.addEventListener("click", saveLocal);
  els.resetBtn.addEventListener("click", resetAll);
  els.leftToggleBtn.addEventListener("click", () => togglePanel("left"));
  els.rightToggleBtn.addEventListener("click", () => togglePanel("right"));
  els.autoArrangeBtn.addEventListener("click", autoArrange);
  els.lineModeBtn.addEventListener("click", toggleLineMode);
  els.duplicateBtn.addEventListener("click", duplicateSelected);
  els.deleteBtn.addEventListener("click", deleteSelected);
  els.expandCanvasBtn.addEventListener("click", () => {
    state.canvas.height += 420;
    state.canvas.width += 120;
    render();
  });

  els.toolGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (button) addNode(button.dataset.type);
  });
  els.templateGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-template]");
    if (!button) return;
    els.researchInput.value = templates[button.dataset.template] || sampleText;
    analyzeInput();
  });

  els.zoomOutBtn.addEventListener("click", () => setZoom(Math.max(0.35, zoom - 0.1)));
  els.zoomInBtn.addEventListener("click", () => setZoom(Math.min(1.8, zoom + 0.1)));
  els.zoomSlider.addEventListener("input", () => setZoom(Number(els.zoomSlider.value) / 100));
  els.fitBtn.addEventListener("click", fitToView);

  els.exportSvgBtn.addEventListener("click", exportSvg);
  els.exportPngBtn.addEventListener("click", exportPng);
  els.exportJsonBtn.addEventListener("click", exportJson);
  els.importJsonInput.addEventListener("change", importJson);

  els.nodeTitleInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeBodyInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeTypeInput.addEventListener("change", updateSelectedNodeFromInspector);
  els.nodeWidthInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.nodeHeightInput.addEventListener("input", updateSelectedNodeFromInspector);
  els.edgeLabelInput.addEventListener("input", updateSelectedEdgeFromInspector);
  els.edgeLabelInput.addEventListener("change", updateSelectedEdgeFromInspector);
  els.edgeStyleInput.addEventListener("change", updateSelectedEdgeFromInspector);

  els.diagramTitleInput.addEventListener("input", () => {
    state.title = els.diagramTitleInput.value;
    render();
  });
  els.diagramSubtitleInput.addEventListener("input", () => {
    state.subtitle = els.diagramSubtitleInput.value;
    render();
  });
  els.diagramFlowInput.addEventListener("input", () => {
    state.flow = els.diagramFlowInput.value;
    render();
  });

  els.apiPresetInput.addEventListener("change", applyApiPreset);
  [els.onlineAssistToggle, els.apiBaseInput, els.apiModelInput, els.apiKeyInput].forEach((el) => {
    el.addEventListener("change", saveSettings);
    el.addEventListener("input", saveSettings);
  });

  const scroll = document.querySelector(".canvas-scroll");
  scroll.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    setZoom(clamp(zoom + delta, 0.35, 1.8));
  }, { passive: false });

  document.addEventListener("mousemove", onPointerMove);
  document.addEventListener("mouseup", onPointerUp);
  document.addEventListener("keydown", (event) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (["input", "textarea", "select"].includes(tag)) return;
    if (event.key === "Delete" || event.key === "Backspace") deleteSelected();
    if (event.key.toLowerCase() === "l") toggleLineMode();
    if (event.key === "Escape") {
      lineMode = false;
      pendingLineSource = null;
      updateLineModeUi();
    }
  });
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem("research-canvas-settings") || "{}");
  els.onlineAssistToggle.checked = Boolean(settings.onlineAssist);
  els.apiBaseInput.value = settings.apiBase || "";
  els.apiModelInput.value = settings.apiModel || "";
  els.apiKeyInput.value = settings.apiKey || "";
  els.apiPresetInput.value = settings.apiPreset || "";
}

function saveSettings() {
  localStorage.setItem("research-canvas-settings", JSON.stringify({
    onlineAssist: els.onlineAssistToggle.checked,
    apiPreset: els.apiPresetInput.value,
    apiBase: els.apiBaseInput.value.trim(),
    apiModel: els.apiModelInput.value.trim(),
    apiKey: els.apiKeyInput.value,
  }));
}

function applyApiPreset() {
  const preset = els.apiPresetInput.value;
  if (preset === "pollinations") {
    els.apiBaseInput.value = "https://gen.pollinations.ai";
    els.apiModelInput.value = "openai";
  } else if (preset === "huggingface") {
    els.apiBaseInput.value = "https://router.huggingface.co";
    els.apiModelInput.value = "deepseek-ai/DeepSeek-V3-0324";
  }
  saveSettings();
}

function loadInitialState() {
  const stored = localStorage.getItem("research-canvas-state");
  if (stored) {
    try {
      state = normalizeDiagram(JSON.parse(stored));
      els.researchInput.value = localStorage.getItem("research-canvas-input") || "";
      return;
    } catch (error) {
      console.warn("Cannot restore saved diagram", error);
    }
  }
  state.nodes = [
    makeNode("question", 1, 395, 230, "研究問題界定", "明確化研究對象、問題意識與研究範圍"),
    makeNode("input", 2, 395, 370, "資料來源與樣本", "文獻、政策文件、訪談、問卷或資料庫"),
    makeNode("framework", 3, 395, 510, "研究架構", "理論概念、變項關係與研究命題"),
    makeNode("process", 4, 395, 650, "研究流程", "資料蒐集 → 前處理 → 分析 → 檢核 → 輸出"),
    makeNode("core", 5, 395, 790, "核心分析模組", "資料清理 → 編碼 → 分類 → 比較 → 解釋", ["資料清理", "主題編碼", "類型歸納", "比較分析", "效度檢核"]),
    makeNode("output", 6, 395, 1080, "研究發現與建議", "理論貢獻、政策建議與後續研究"),
  ];
  rebuildEdges();
}

function analyzeInput() {
  const text = els.researchInput.value.trim();
  if (!text) {
    showToast("請先貼上研究流程或研究架構文字。");
    return;
  }
  const started = performance.now();
  if (apiAbort) apiAbort.abort();
  setBusy(true);
  setAnalysisStatus("本地解析中", "正在瀏覽器內整理研究流程");

  requestAnimationFrame(() => {
    const localDiagram = analyzeTextLocal(text);
    state = normalizeDiagram(localDiagram);
    selected = { kind: null, id: null };
    ensureCanvasFits();
    saveLocal(false);
    render();
    const elapsed = Math.max(1, Math.round(performance.now() - started));
    setBusy(false);
    setAnalysisStatus(`本地已完成 ${elapsed}ms`, "Python/API 只會背景補充，不阻塞畫布");
    tryPythonAssist(text);
    tryOnlineAssist(text);
  });
}

async function tryPythonAssist(text) {
  if (!isLocalHost()) return;
  const controller = new AbortController();
  apiAbort = controller;
  const timeoutId = window.setTimeout(() => controller.abort(), 2200);
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);
    if (!response.ok) return;
    const payload = await response.json();
    if (!payload.ok || !payload.diagram) return;
    mergeAssistDiagram(payload.diagram, "Python 已補強");
  } catch (error) {
    window.clearTimeout(timeoutId);
    if (error.name !== "AbortError") console.warn("Python assist skipped", error);
  }
}

async function tryOnlineAssist(text) {
  if (!els.onlineAssistToggle.checked) return;
  const base = els.apiBaseInput.value.trim().replace(/\/$/, "");
  const model = els.apiModelInput.value.trim();
  const key = els.apiKeyInput.value.trim();
  if (!base || !model || !key) {
    appendSuggestion("info", "線上協同未啟動", "請先設定 Base URL、Model 與前端可公開的 publishable token。");
    render();
    return;
  }
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: "你是研究方法與學術圖表顧問。請只回 JSON，格式為 {\"suggestions\":[{\"level\":\"info\",\"title\":\"...\",\"body\":\"...\"}]}" },
          { role: "user", content: `請檢查以下研究流程圖是否缺少資料來源、研究架構、研究流程、檢核機制或輸出，提出三點具體繪圖建議：\n${text.slice(0, 5000)}` },
        ],
      }),
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`API ${response.status}`);
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content || "";
    const jsonText = content.match(/\{[\s\S]*\}/)?.[0] || content;
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed.suggestions)) {
      parsed.suggestions.slice(0, 4).forEach((item) => appendSuggestion(item.level || "info", item.title || "線上建議", item.body || ""));
      setAnalysisStatus("線上協同已完成", "本地初稿已保留，外部 API 僅補建議");
      render();
    }
  } catch (error) {
    window.clearTimeout(timeoutId);
    appendSuggestion("warn", "線上協同略過", "外部 API 沒有在時間內回應，畫布已使用本地結果。");
    render();
  }
}

function mergeAssistDiagram(diagram, label) {
  const suggestions = Array.isArray(diagram.suggestions) ? diagram.suggestions : [];
  suggestions.slice(0, 3).forEach((item) => appendSuggestion(item.level || "info", item.title || label, item.body || ""));
  setAnalysisStatus(label, "本地畫布維持可編輯狀態");
  render();
}

function analyzeTextLocal(text) {
  const parsed = parseResearchText(text);
  return buildDiagram(parsed);
}

function parseResearchText(text) {
  const lines = text.replace(/\r/g, "\n").split("\n").map(compact).filter(Boolean);
  const buckets = { title: [], subtitle: [], input: [], framework: [], flow: [], core: [], output: [], parameters: [], notes: [], loose: [] };
  let current = null;
  lines.forEach((line) => {
    const found = detectSection(line);
    if (found.key) {
      current = found.key;
      if (found.rest) buckets[found.key].push(...splitItems(found.rest));
      return;
    }
    if (current) buckets[current].push(...splitItems(line));
    else buckets.loose.push(...splitItems(line));
  });
  if (!buckets.flow.length && !buckets.framework.length) {
    buckets.flow.push(...inferLooseSteps(text));
  }
  const title = buckets.title[0] || inferTitle(lines);
  const subtitle = buckets.subtitle[0] || "研究流程、研究架構與方法設計圖";
  const inputItems = uniqueClean(buckets.input);
  const frameworkItems = uniqueClean(buckets.framework);
  const flowSteps = normalizeFlowSteps(uniqueClean(buckets.flow), inputItems, frameworkItems, buckets.core, buckets.output);
  const coreSteps = uniqueClean(buckets.core).length ? uniqueClean(buckets.core) : inferCore(flowSteps);
  const outputs = uniqueClean(buckets.output);
  return {
    title,
    subtitle,
    inputItems: inputItems.length ? inputItems : inferByType(buckets.loose.concat(flowSteps), "input").slice(0, 4),
    frameworkItems: frameworkItems.length ? frameworkItems : inferByType(buckets.loose.concat(flowSteps), "framework").slice(0, 5),
    flowSteps,
    coreSteps,
    outputs: outputs.length ? outputs : inferByType(buckets.loose.concat(flowSteps), "output").slice(0, 4),
    parameters: uniqueClean(buckets.parameters).length ? uniqueClean(buckets.parameters) : inferParameters(text),
    notes: uniqueClean(buckets.notes).length ? uniqueClean(buckets.notes) : inferNotes(text),
  };
}

function detectSection(line) {
  const normalized = line.trim().replace(/^[【\[#]+|[】\]#]+$/g, "");
  for (const [key, aliases] of Object.entries(sectionAliases)) {
    for (const alias of aliases) {
      const pattern = new RegExp(`^${escapeRegExp(alias)}\\s*[:：]?\\s*(.*)$`, "i");
      const match = normalized.match(pattern);
      if (match) return { key, rest: match[1].trim() };
    }
  }
  return { key: null, rest: line };
}

function buildDiagram(parsed) {
  const steps = parsed.flowSteps.length ? parsed.flowSteps : [
    "研究問題界定",
    "資料來源盤點",
    "研究架構建立",
    "研究流程設計",
    "核心分析模組",
    "檢核與限制",
    "研究輸出",
  ];
  const nodes = steps.slice(0, 9).map((step, index) => {
    const type = classifyStep(step, index, steps.length);
    const node = makeNode(type, index + 1, 390, 230 + index * 142, step, bodyForType(type, parsed));
    if (type === "core") {
      node.h = 250;
      node.children = parsed.coreSteps.slice(0, 5);
    }
    return node;
  });
  const stateLike = {
    title: parsed.title,
    subtitle: parsed.subtitle,
    canvas: { width: 1280, height: Math.max(1780, 520 + nodes.reduce((max, node) => Math.max(max, node.y + node.h), 0)) },
    nodes,
    edges: [],
    legend: defaultLegend(),
    parameters: parsed.parameters,
    notes: parsed.notes,
    flow: nodes.map((node) => node.title).join(" → "),
    suggestions: buildSuggestions(parsed, nodes),
    meta: { engine: "browser-local", generatedAt: Date.now() },
  };
  stateLike.edges = nodes.slice(0, -1).map((node, index) => ({
    id: `edge-${node.id}-${nodes[index + 1].id}`,
    from: node.id,
    to: nodes[index + 1].id,
    label: "",
    style: "solid",
  }));
  return stateLike;
}

function bodyForType(type, parsed) {
  if (type === "input") return summarize(parsed.inputItems, "文獻、政策文件、訪談或資料庫");
  if (type === "framework") return summarize(parsed.frameworkItems, "概念、變項、命題與章節邏輯");
  if (type === "process") return "資料蒐集、前處理、分析、檢核與輸出";
  if (type === "theory") return "理論對話、概念定義與研究假設";
  if (type === "method") return "研究設計、抽樣、操作型定義與分析方法";
  if (type === "core") return parsed.coreSteps.slice(0, 5).join(" → ") || "資料清理 → 編碼 → 分析 → 檢核";
  if (type === "validation") return "信度、效度、穩健性、反例與人工校讀";
  if (type === "output") return summarize(parsed.outputs, "研究發現、理論貢獻與政策建議");
  if (type === "limitation") return "資料限制、推論邊界與倫理注意事項";
  if (type === "reference") return "參考文獻、來源索引與引用規範";
  if (type === "question") return "研究對象、核心疑問與範圍界定";
  return "依研究問題進行分類、比較與解釋";
}

function classifyStep(step, index, total) {
  const lowered = step.toLowerCase();
  for (const [type, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((keyword) => lowered.includes(keyword.toLowerCase()))) return type;
  }
  if (index === 0) return "question";
  if (index === 1) return "input";
  if (index === 2) return "framework";
  if (index === 3) return "process";
  if (index === total - 1) return "output";
  if (index >= total - 2) return "validation";
  return "core";
}

function normalizeFlowSteps(flowSteps, inputItems, frameworkItems, coreItems, outputItems) {
  let steps = flowSteps.slice();
  const joined = steps.join(" ");
  if (!steps.length) steps = ["研究問題界定", "資料來源盤點", "研究架構建立", "研究流程設計", "核心分析模組", "研究輸出"];
  if (!/資料|來源|樣本|input/i.test(joined) && inputItems.length) steps.splice(1, 0, "資料來源與樣本選取");
  if (!/研究架構|架構|framework/i.test(joined) && frameworkItems.length) steps.splice(2, 0, "研究架構建立");
  if (!/研究流程|流程|process|workflow/i.test(joined)) steps.splice(Math.min(3, steps.length), 0, "研究流程設計");
  if (!/核心|分析|編碼|analysis/i.test(joined) && coreItems.length) steps.splice(Math.max(3, Math.floor(steps.length / 2)), 0, "核心分析模組");
  if (!/輸出|成果|發現|結論|output/i.test(joined) && outputItems.length) steps.push("研究輸出與結論建議");
  return uniqueClean(steps).slice(0, 9);
}

function buildSuggestions(parsed, nodes) {
  const suggestions = [];
  if (parsed.inputItems.length < 2) suggestions.push({ level: "warn", title: "資料來源還可更明確", body: "建議補上資料期間、樣本範圍、文本來源或資料庫名稱。" });
  if (parsed.frameworkItems.length < 2) suggestions.push({ level: "warn", title: "研究架構需獨立標示", body: "研究架構最好獨立成模組，呈現理論、概念、變項或命題之間的關係。" });
  if (!nodes.some((node) => node.type === "process")) suggestions.push({ level: "info", title: "補上研究流程", body: "請把實際操作順序與研究架構分開，讀者會更容易理解。" });
  if (parsed.coreSteps.length < 3) suggestions.push({ level: "warn", title: "核心分析可再拆細", body: "核心分析至少拆成資料清理、編碼、分類、比較、檢核等子步驟。" });
  if (!nodes.some((node) => node.type === "validation")) suggestions.push({ level: "info", title: "加入檢核機制", body: "學術架構圖通常需要標示信度、效度、穩健性或人工校讀。" });
  suggestions.push({ level: "ok", title: "可編輯初稿已生成", body: "你可以拖曳模組、手動連線、修改文字，也可以匯出 SVG/PNG/JSON。" });
  return suggestions;
}

function render() {
  const svg = els.diagramCanvas;
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${state.canvas.width} ${state.canvas.height}`);
  svg.setAttribute("width", state.canvas.width);
  svg.setAttribute("height", state.canvas.height);
  svg.style.transform = `scale(${zoom})`;
  els.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  els.zoomSlider.value = Math.round(zoom * 100);

  addDefs(svg);
  drawBackground(svg);
  drawTitle(svg);
  drawEdges(svg);
  state.nodes.forEach((node) => drawNode(svg, node));
  drawLegend(svg);
  drawParameters(svg);
  drawNotes(svg);
  drawFlow(svg);
  renderSuggestions();
  renderInspector();
  syncDiagramInputs();
  updateLineModeUi();
  updateEngineLabel();
}

function addDefs(svg) {
  const defs = svgEl("defs");
  const marker = svgEl("marker", { id: "arrowHead", markerWidth: 12, markerHeight: 12, refX: 10, refY: 6, orient: "auto", markerUnits: "strokeWidth" });
  marker.appendChild(svgEl("path", { d: "M2,2 L10,6 L2,10 Z", fill: "#171717" }));
  defs.appendChild(marker);
  svg.appendChild(defs);
}

function drawBackground(svg) {
  svg.appendChild(svgEl("rect", { x: 0, y: 0, width: state.canvas.width, height: state.canvas.height, fill: "#fffefd" }));
  for (let x = 40; x < state.canvas.width; x += 40) {
    svg.appendChild(svgEl("line", { x1: x, y1: 160, x2: x, y2: state.canvas.height - 90, stroke: "#f1f1ee", "stroke-width": 1 }));
  }
  for (let y = 160; y < state.canvas.height - 90; y += 40) {
    svg.appendChild(svgEl("line", { x1: 40, y1: y, x2: state.canvas.width - 40, y2: y, stroke: "#f1f1ee", "stroke-width": 1 }));
  }
}

function drawTitle(svg) {
  svg.appendChild(svgText(state.title, state.canvas.width / 2, 64, { "text-anchor": "middle", "font-size": 32, "font-weight": 800 }));
  svg.appendChild(svgText(state.subtitle, state.canvas.width / 2, 108, { "text-anchor": "middle", "font-size": 19, "font-weight": 600, fill: "#2f2f2b" }));
}

function drawEdges(svg) {
  const nodesById = new Map(state.nodes.map((node) => [node.id, node]));
  state.edges.forEach((edge) => {
    const from = nodesById.get(edge.from);
    const to = nodesById.get(edge.to);
    if (!from || !to) return;
    const start = anchorPoint(from, to);
    const end = anchorPoint(to, from);
    const selectedEdge = selected.kind === "edge" && selected.id === edge.id;
    const path = edgePath(start, end, edge.style);
    const hit = svgEl("path", { d: path, fill: "none", stroke: "transparent", "stroke-width": 16, cursor: "pointer" });
    hit.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      selected = { kind: "edge", id: edge.id };
      render();
    });
    svg.appendChild(hit);
    svg.appendChild(svgEl("path", {
      d: path,
      fill: "none",
      stroke: selectedEdge ? "#1f5fbf" : "#171717",
      "stroke-width": selectedEdge ? 3 : 2,
      "stroke-dasharray": edge.style === "dashed" ? "8 7" : edge.style === "feedback" ? "5 6" : "0",
      "marker-end": "url(#arrowHead)",
      "pointer-events": "none",
    }));
    if (edge.label) {
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - 8;
      const labelWidth = Math.max(56, Math.min(180, edge.label.length * 16));
      svg.appendChild(svgEl("rect", { x: midX - labelWidth / 2, y: midY - 22, width: labelWidth, height: 28, rx: 6, fill: "#fffefd", stroke: "#bfc2bd", "stroke-width": 1 }));
      appendWrappedText(svg, edge.label, midX, midY - 3, labelWidth - 14, { "text-anchor": "middle", "font-size": 13, "font-weight": 700 }, 1);
    }
  });
}

function drawNode(svg, node) {
  const palette = colors[node.type] || colors.analysis;
  const group = svgEl("g", { class: "node", "data-id": node.id, cursor: lineMode ? "crosshair" : "move" });
  const isSelected = selected.kind === "node" && selected.id === node.id;
  const isLineSource = pendingLineSource === node.id;
  if (isSelected || isLineSource) {
    group.appendChild(svgEl("rect", {
      x: node.x - 8,
      y: node.y - 8,
      width: node.w + 16,
      height: node.h + 16,
      rx: 12,
      fill: "none",
      stroke: isLineSource ? "#d77900" : "#1f5fbf",
      "stroke-width": 3,
      "stroke-dasharray": "8 6",
    }));
  }
  group.appendChild(svgEl("rect", { x: node.x, y: node.y, width: node.w, height: node.h, rx: 10, fill: palette.fill, stroke: palette.stroke, "stroke-width": 2 }));
  group.appendChild(svgEl("circle", { cx: node.x, cy: node.y + 36, r: 24, fill: "#fff", stroke: palette.stroke, "stroke-width": 2 }));
  group.appendChild(svgText(String(node.number || ""), node.x, node.y + 44, { "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: palette.stroke }));
  appendWrappedText(group, node.title, node.x + node.w / 2, node.y + 40, node.w - 78, { "text-anchor": "middle", "font-size": 19, "font-weight": 800 }, 2);
  appendWrappedText(group, node.body, node.x + node.w / 2, node.y + 75, node.w - 84, { "text-anchor": "middle", "font-size": 14, fill: "#242424" }, node.type === "core" ? 2 : 3);
  if (node.type === "core") drawCoreChildren(group, node);
  group.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (lineMode) {
      handleLineNodeClick(node.id);
      return;
    }
    selected = { kind: "node", id: node.id };
    const point = clientToSvg(event.clientX, event.clientY);
    drag = { id: node.id, offsetX: point.x - node.x, offsetY: point.y - node.y };
    render();
  });
  group.addEventListener("dblclick", () => {
    const nextTitle = window.prompt("修改模組標題", node.title);
    if (nextTitle !== null) {
      node.title = nextTitle.trim() || node.title;
      rebuildFlowText();
      render();
    }
  });
  svg.appendChild(group);
}

function drawCoreChildren(group, node) {
  const children = node.children?.length ? node.children : ["資料清理", "編碼", "比較", "檢核"];
  const startY = node.y + 122;
  const boxW = Math.min(210, node.w - 140);
  const x = node.x + node.w / 2 - boxW / 2;
  children.slice(0, 5).forEach((child, index) => {
    const y = startY + index * 31;
    const color = index === 1 ? colors.core : index === 2 ? colors.output : colors.validation;
    group.appendChild(svgEl("rect", { x, y, width: boxW, height: 24, rx: 6, fill: color.fill, stroke: color.stroke, "stroke-width": 1.4 }));
    appendWrappedText(group, child, x + boxW / 2, y + 17, boxW - 14, { "text-anchor": "middle", "font-size": 12, "font-weight": 700 }, 1);
    if (index < Math.min(children.length, 5) - 1) {
      group.appendChild(svgEl("line", { x1: node.x + node.w / 2, y1: y + 24, x2: node.x + node.w / 2, y2: y + 31, stroke: "#171717", "stroke-width": 1.2, "marker-end": "url(#arrowHead)" }));
    }
  });
}

function drawLegend(svg) {
  const x = state.canvas.width - 302;
  const y = 600;
  drawPanel(svg, x, y, 250, 430, "Legend / 圖例");
  state.legend.forEach((item, index) => {
    const palette = colors[item.type] || colors.analysis;
    const rowY = y + 58 + index * 42;
    svg.appendChild(svgEl("rect", { x: x + 24, y: rowY - 22, width: 42, height: 30, rx: 5, fill: palette.fill, stroke: palette.stroke, "stroke-width": 1.5 }));
    appendWrappedText(svg, item.label, x + 80, rowY - 2, 142, { "font-size": 13, "font-weight": 700 }, 2, "start");
  });
}

function drawParameters(svg) {
  const x = state.canvas.width - 302;
  const y = 1060;
  drawPanel(svg, x, y, 250, 300, "Key Parameters");
  const items = state.parameters?.length ? state.parameters : ["研究期間：待補", "分析單位：待補", "方法：待補"];
  items.slice(0, 8).forEach((item, index) => {
    svg.appendChild(svgText("•", x + 28, y + 58 + index * 28, { "font-size": 15, "font-weight": 700 }));
    appendWrappedText(svg, item, x + 46, y + 58 + index * 28, 170, { "font-size": 13 }, 1, "start");
  });
}

function drawNotes(svg) {
  const y = state.canvas.height - 270;
  drawPanel(svg, 55, y, 820, 170, "Notes / 註解", true);
  const items = state.notes?.length ? state.notes : ["研究者可在右側面板修改圖表文字。"];
  items.slice(0, 5).forEach((item, index) => {
    svg.appendChild(svgText("•", 88, y + 62 + index * 26, { "font-size": 15, "font-weight": 700 }));
    appendWrappedText(svg, item, 108, y + 62 + index * 26, 700, { "font-size": 13 }, 1, "start");
  });
}

function drawFlow(svg) {
  const x = 65;
  const y = state.canvas.height - 76;
  const w = state.canvas.width - 130;
  svg.appendChild(svgEl("rect", { x, y, width: w, height: 54, rx: 8, fill: "#ffffff", stroke: "#171717", "stroke-width": 1.5, "stroke-dasharray": "7 5" }));
  svg.appendChild(svgText("Flow:", x + 30, y + 35, { "font-size": 19, "font-weight": 800 }));
  appendWrappedText(svg, state.flow || "資料輸入 → 分析 → 圖面輸出", x + 92, y + 35, w - 120, { "font-size": 16, "font-weight": 700 }, 1, "start");
}

function drawPanel(svg, x, y, w, h, title, dashed = false) {
  svg.appendChild(svgEl("rect", { x, y, width: w, height: h, rx: 8, fill: "#ffffff", stroke: "#171717", "stroke-width": 1.5, "stroke-dasharray": dashed ? "7 5" : "0" }));
  svg.appendChild(svgText(title, x + w / 2, y + 31, { "text-anchor": "middle", "font-size": 17, "font-weight": 800 }));
}

function handleLineNodeClick(nodeId) {
  if (!pendingLineSource) {
    pendingLineSource = nodeId;
    selected = { kind: "node", id: nodeId };
    showToast("已選第一個模組，請點選要連到的第二個模組。");
    render();
    return;
  }
  if (pendingLineSource === nodeId) {
    pendingLineSource = null;
    render();
    return;
  }
  const edge = {
    id: `edge-${pendingLineSource}-${nodeId}-${Date.now()}`,
    from: pendingLineSource,
    to: nodeId,
    label: "",
    style: "solid",
  };
  state.edges.push(edge);
  selected = { kind: "edge", id: edge.id };
  pendingLineSource = null;
  lineMode = false;
  render();
}

function renderSuggestions() {
  const suggestions = state.suggestions || [];
  els.suggestionCount.textContent = suggestions.length;
  els.suggestions.innerHTML = "";
  if (!suggestions.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "生成圖稿後，這裡會列出結構與版面建議。";
    els.suggestions.appendChild(empty);
    return;
  }
  suggestions.forEach((suggestion) => {
    const card = document.createElement("article");
    card.className = "suggestion-card";
    card.dataset.level = suggestion.level || "info";
    const title = document.createElement("strong");
    title.textContent = suggestion.title || "建議";
    const body = document.createElement("p");
    body.textContent = suggestion.body || "";
    card.append(title, body);
    els.suggestions.appendChild(card);
  });
}

function renderInspector() {
  const node = selected.kind === "node" ? selectedNode() : null;
  const edge = selected.kind === "edge" ? selectedEdge() : null;
  els.emptyInspector.classList.toggle("hidden", Boolean(node || edge));
  els.nodeInspectorForm.classList.toggle("hidden", !node);
  els.edgeInspectorForm.classList.toggle("hidden", !edge);
  if (node) {
    if (document.activeElement !== els.nodeTitleInput) els.nodeTitleInput.value = node.title;
    if (document.activeElement !== els.nodeBodyInput) els.nodeBodyInput.value = node.body;
    if (document.activeElement !== els.nodeTypeInput) els.nodeTypeInput.value = node.type;
    if (document.activeElement !== els.nodeWidthInput) els.nodeWidthInput.value = Math.round(node.w);
    if (document.activeElement !== els.nodeHeightInput) els.nodeHeightInput.value = Math.round(node.h);
  }
  if (edge) {
    if (document.activeElement !== els.edgeLabelInput) els.edgeLabelInput.value = edge.label || "";
    if (document.activeElement !== els.edgeStyleInput) els.edgeStyleInput.value = edge.style || "solid";
  }
}

function syncDiagramInputs() {
  if (document.activeElement !== els.diagramTitleInput) els.diagramTitleInput.value = state.title || "";
  if (document.activeElement !== els.diagramSubtitleInput) els.diagramSubtitleInput.value = state.subtitle || "";
  if (document.activeElement !== els.diagramFlowInput) els.diagramFlowInput.value = state.flow || "";
}

function updateSelectedNodeFromInspector() {
  const node = selectedNode();
  if (!node) return;
  node.title = els.nodeTitleInput.value;
  node.body = els.nodeBodyInput.value;
  node.type = els.nodeTypeInput.value;
  node.w = clamp(Number(els.nodeWidthInput.value) || node.w, 180, 820);
  node.h = clamp(Number(els.nodeHeightInput.value) || node.h, 72, 480);
  rebuildFlowText();
  ensureCanvasFits();
  render();
}

function updateSelectedEdgeFromInspector() {
  const edge = selectedEdge();
  if (!edge) return;
  edge.label = els.edgeLabelInput.value;
  edge.style = els.edgeStyleInput.value;
  render();
}

function selectedNode() {
  return state.nodes.find((node) => node.id === selected.id) || null;
}

function selectedEdge() {
  return state.edges.find((edge) => edge.id === selected.id) || null;
}

function addNode(type) {
  const number = state.nodes.length + 1;
  const y = Math.max(230, ...state.nodes.map((node) => node.y + node.h + 38));
  const node = makeNode(type, number, 390, y, typeLabels[type] || "新增模組", defaultBodyForNewNode(type));
  if (type === "core") node.children = ["資料清理", "編碼", "分類", "比較", "檢核"];
  state.nodes.push(node);
  if (state.nodes.length > 1) {
    const previous = state.nodes[state.nodes.length - 2];
    state.edges.push({ id: `edge-${previous.id}-${node.id}`, from: previous.id, to: node.id, label: "", style: "solid" });
  }
  selected = { kind: "node", id: node.id };
  rebuildFlowText();
  ensureCanvasFits();
  render();
}

function makeNode(type, number, x, y, title, body, children = []) {
  return {
    id: `node-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    type,
    number,
    x,
    y,
    w: type === "core" ? 520 : 500,
    h: type === "core" ? 250 : 112,
    title,
    body,
    children,
  };
}

function duplicateSelected() {
  const node = selectedNode();
  if (!node) return;
  const clone = {
    ...structuredClone(node),
    id: `node-${Date.now()}`,
    number: state.nodes.length + 1,
    x: node.x + 42,
    y: node.y + 42,
  };
  state.nodes.push(clone);
  selected = { kind: "node", id: clone.id };
  ensureCanvasFits();
  render();
}

function deleteSelected() {
  if (!selected.kind || !selected.id) return;
  if (selected.kind === "node") {
    state.nodes = state.nodes.filter((node) => node.id !== selected.id);
    state.edges = state.edges.filter((edge) => edge.from !== selected.id && edge.to !== selected.id);
    renumberNodes();
  } else if (selected.kind === "edge") {
    state.edges = state.edges.filter((edge) => edge.id !== selected.id);
  }
  selected = { kind: null, id: null };
  rebuildFlowText();
  render();
}

function renumberNodes() {
  state.nodes.slice().sort((a, b) => a.y - b.y).forEach((node, index) => {
    node.number = index + 1;
  });
}

function rebuildEdges() {
  const sorted = state.nodes.slice().sort((a, b) => a.y - b.y);
  state.edges = sorted.slice(0, -1).map((node, index) => ({
    id: `edge-${node.id}-${sorted[index + 1].id}`,
    from: node.id,
    to: sorted[index + 1].id,
    label: "",
    style: "solid",
  }));
  rebuildFlowText();
}

function autoArrange() {
  const sorted = state.nodes.slice().sort((a, b) => a.number - b.number);
  let y = 230;
  sorted.forEach((node, index) => {
    node.x = 390;
    node.y = y;
    node.number = index + 1;
    y += node.h + 34;
  });
  state.nodes = sorted;
  rebuildFlowText();
  ensureCanvasFits();
  render();
}

function rebuildFlowText() {
  state.flow = state.nodes.slice().sort((a, b) => a.number - b.number).map((node) => node.title).join(" → ");
}

function ensureCanvasFits() {
  const maxX = Math.max(1100, ...state.nodes.map((node) => node.x + node.w + 360));
  const maxY = Math.max(1540, ...state.nodes.map((node) => node.y + node.h + 420));
  state.canvas.width = Math.max(1280, Math.ceil(maxX / 80) * 80);
  state.canvas.height = Math.max(1780, Math.ceil(maxY / 80) * 80);
}

function onPointerMove(event) {
  if (!drag) return;
  const node = state.nodes.find((item) => item.id === drag.id);
  if (!node) return;
  const point = clientToSvg(event.clientX, event.clientY);
  node.x = clamp(point.x - drag.offsetX, 24, state.canvas.width - node.w - 24);
  node.y = clamp(point.y - drag.offsetY, 150, state.canvas.height - node.h - 90);
  render();
}

function onPointerUp() {
  if (drag) {
    drag = null;
    saveLocal(false);
  }
}

function clientToSvg(clientX, clientY) {
  const rect = els.diagramCanvas.getBoundingClientRect();
  return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
}

function setZoom(value) {
  zoom = clamp(value, 0.35, 1.8);
  render();
}

function fitToView() {
  const scroll = document.querySelector(".canvas-scroll");
  const widthZoom = (scroll.clientWidth - 56) / state.canvas.width;
  setZoom(clamp(widthZoom, 0.35, 1));
}

function togglePanel(side) {
  const className = side === "left" ? "left-collapsed" : "right-collapsed";
  document.body.classList.toggle(className);
  const collapsed = document.body.classList.contains(className);
  const button = side === "left" ? els.leftToggleBtn : els.rightToggleBtn;
  button.textContent = collapsed ? `展開${side === "left" ? "左" : "右"}欄` : `收合${side === "left" ? "左" : "右"}欄`;
  button.setAttribute("aria-pressed", String(collapsed));
  requestAnimationFrame(fitToView);
}

function toggleLineMode() {
  lineMode = !lineMode;
  pendingLineSource = null;
  updateLineModeUi();
}

function updateLineModeUi() {
  els.lineModeBtn.textContent = `新增線條：${lineMode ? "開" : "關"}`;
  els.lineModeBtn.setAttribute("aria-pressed", String(lineMode));
  els.lineModeBtn.classList.toggle("active", lineMode);
  els.lineModeHint.textContent = lineMode ? "請先點來源模組，再點目標模組。按 Esc 可取消。" : "開啟後依序點兩個模組，即可建立連接線。";
}

function exportSvg() {
  const clone = els.diagramCanvas.cloneNode(true);
  clone.removeAttribute("style");
  const xml = new XMLSerializer().serializeToString(clone);
  downloadBlob(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }), "research-architecture-canvas.svg");
}

function exportPng() {
  const clone = els.diagramCanvas.cloneNode(true);
  clone.removeAttribute("style");
  const xml = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = state.canvas.width * 2;
    canvas.height = state.canvas.height * 2;
    const context = canvas.getContext("2d");
    context.fillStyle = "#fffefd";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(url);
      if (blob) downloadBlob(blob, "research-architecture-canvas.png");
    }, "image/png");
  };
  image.src = url;
}

function exportJson() {
  downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" }), "research-architecture-canvas.json");
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalizeDiagram(JSON.parse(reader.result));
      selected = { kind: null, id: null };
      render();
      showToast("JSON 已匯入。");
    } catch (error) {
      showToast("JSON 格式無法讀取。");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function saveLocal(showMessage = true) {
  localStorage.setItem("research-canvas-state", JSON.stringify(state));
  localStorage.setItem("research-canvas-input", els.researchInput.value);
  if (showMessage) showToast("已儲存到此瀏覽器。");
}

function resetAll() {
  const ok = window.confirm("確定要重置畫布？這會清除目前瀏覽器草稿。");
  if (!ok) return;
  localStorage.removeItem("research-canvas-state");
  localStorage.removeItem("research-canvas-input");
  selected = { kind: null, id: null };
  state.nodes = [];
  loadInitialState();
  render();
}

function normalizeDiagram(diagram) {
  const normalized = {
    title: diagram.title || "研究架構圖",
    subtitle: diagram.subtitle || "研究流程與方法架構圖",
    canvas: diagram.canvas || { width: 1280, height: 1780 },
    nodes: Array.isArray(diagram.nodes) ? diagram.nodes.map(normalizeNode) : [],
    edges: Array.isArray(diagram.edges) ? diagram.edges.map(normalizeEdge) : [],
    legend: Array.isArray(diagram.legend) ? diagram.legend : defaultLegend(),
    parameters: Array.isArray(diagram.parameters) ? diagram.parameters : [],
    notes: Array.isArray(diagram.notes) ? diagram.notes : [],
    flow: diagram.flow || "",
    suggestions: Array.isArray(diagram.suggestions) ? diagram.suggestions : [],
    meta: diagram.meta || {},
  };
  if (!normalized.edges.length) {
    normalized.edges = normalized.nodes.slice(0, -1).map((node, index) => normalizeEdge({
      id: `edge-${node.id}-${normalized.nodes[index + 1].id}`,
      from: node.id,
      to: normalized.nodes[index + 1].id,
    }));
  }
  return normalized;
}

function normalizeNode(node, index = 0) {
  return {
    id: node.id || `node-${Date.now()}-${index}`,
    type: node.type || "analysis",
    number: Number(node.number || index + 1),
    x: Number(node.x || 390),
    y: Number(node.y || 230 + index * 140),
    w: Number(node.w || 500),
    h: Number(node.h || (node.type === "core" ? 250 : 112)),
    title: node.title || "新增模組",
    body: node.body || "",
    children: Array.isArray(node.children) ? node.children : [],
  };
}

function normalizeEdge(edge) {
  return {
    id: edge.id || `edge-${edge.from}-${edge.to}-${Date.now()}`,
    from: edge.from,
    to: edge.to,
    label: edge.label || "",
    style: edge.style || "solid",
  };
}

function defaultLegend() {
  return [
    { type: "question", label: "Question / 研究問題" },
    { type: "input", label: "Input / 資料來源" },
    { type: "framework", label: "Framework / 研究架構" },
    { type: "process", label: "Process / 研究流程" },
    { type: "core", label: "Core Analysis / 核心分析" },
    { type: "validation", label: "Validation / 檢核" },
    { type: "output", label: "Output / 研究輸出" },
    { type: "reference", label: "Reference / 參考文獻" },
  ];
}

function setBusy(isBusy) {
  els.analyzeBtn.disabled = isBusy;
  els.analyzeBtn.textContent = isBusy ? "解析中..." : "AI 解析生成";
}

function setAnalysisStatus(primary, secondary) {
  els.analysisPrimary.textContent = primary;
  els.analysisSecondary.textContent = secondary;
}

function appendSuggestion(level, title, body) {
  state.suggestions = state.suggestions || [];
  const exists = state.suggestions.some((item) => item.title === title && item.body === body);
  if (!exists) state.suggestions.unshift({ level, title, body });
  state.suggestions = state.suggestions.slice(0, 8);
}

function updateEngineLabel() {
  if (els.onlineAssistToggle.checked) els.engineStatus.textContent = "本地 + 線上協同";
  else if (isLocalHost()) els.engineStatus.textContent = "本地 + Python 可用";
  else els.engineStatus.textContent = "本地即時分析";
}

function isLocalHost() {
  return ["127.0.0.1", "localhost"].includes(window.location.hostname);
}

function defaultBodyForNewNode(type) {
  const map = {
    question: "研究對象、核心疑問與範圍界定",
    input: "資料來源、樣本、期間與取得方式",
    framework: "概念關係、理論命題與變項安排",
    process: "研究操作步驟與分析順序",
    theory: "理論工具、文獻脈絡與假設",
    method: "研究設計、抽樣、操作型定義",
    core: "資料清理 → 編碼 → 分析 → 檢核",
    validation: "信度、效度、穩健性與人工校讀",
    output: "研究發現、理論貢獻與政策建議",
    limitation: "資料限制、推論邊界與倫理提醒",
    reference: "引用來源、文獻索引與參考文獻",
    optional: "補充分析、延伸模型或替代路徑",
  };
  return map[type] || "點選後在右側修改內容";
}

function splitItems(value) {
  const cleaned = compact(value).replace(/^[：:]\s*/, "");
  if (!cleaned) return [];
  return cleaned.split(/\s*(?:→|->|=>|-->|；|;|\n)\s*/).map(stripBullet).filter(Boolean);
}

function inferLooseSteps(text) {
  const arrows = text.split("\n").flatMap((line) => /→|->|=>|-->/.test(line) ? splitItems(line) : []);
  if (arrows.length) return arrows;
  const numbered = Array.from(text.matchAll(/(?:^|\n)\s*(?:\d+|[一二三四五六七八九十]+)[.、)]\s*([^\n]+)/g)).map((match) => stripBullet(match[1]));
  if (numbered.length) return numbered;
  return text.split(/[。.!?？]\s*/).map(compact).filter((item) => item.length >= 6).slice(0, 7);
}

function inferTitle(lines) {
  for (const line of lines.slice(0, 6)) {
    if (line.length <= 44 && !detectSection(line).key) return stripBullet(line);
  }
  return "研究架構圖";
}

function inferByType(items, type) {
  const keywords = keywordMap[type] || [];
  return uniqueClean(items).filter((item) => keywords.some((keyword) => item.toLowerCase().includes(keyword.toLowerCase())));
}

function inferCore(flowSteps) {
  const core = inferByType(flowSteps, "core");
  return core.length ? core.slice(0, 5) : ["資料清理", "概念編碼", "類型歸納", "比較分析", "解釋與檢核"];
}

function inferParameters(text) {
  const params = [];
  const years = text.match(/\d{4}(?:\s*[-~至]\s*\d{4})?/);
  if (years) params.push(`研究期間：${years[0]}`);
  if (/(樣本|案例|文獻|訪談|問卷).{0,8}\d+/.test(text)) params.push("樣本規模：依輸入文本標示");
  params.push("分析單位：研究個案／文本段落", "方法：文本解析、分類與流程建模", "檢核：人工校讀與版面調整");
  return uniqueClean(params).slice(0, 6);
}

function inferNotes(text) {
  const notes = ["AI 初稿需由研究者確認概念關係與因果方向。", "正式投稿前建議再校對框內文字、圖例與箭頭方向。"];
  if (text.length < 180) notes.unshift("輸入內容偏短，建議補充研究問題、資料來源與分析方法。");
  return notes;
}

function uniqueClean(items) {
  const seen = new Set();
  const clean = [];
  items.forEach((item) => {
    const value = stripBullet(item).replace(/[，,。.;；\s]+$/g, "");
    if (!value || seen.has(value)) return;
    seen.add(value);
    clean.push(value);
  });
  return clean;
}

function stripBullet(line) {
  return compact(line).replace(/^[-*•]\s*/, "").replace(/^\(?[0-9一二三四五六七八九十]+\)?[.、)]\s*/, "").trim();
}

function summarize(items, fallback) {
  const usable = uniqueClean(items);
  if (!usable.length) return fallback;
  if (usable.length <= 3) return usable.join("；");
  return `${usable.slice(0, 3).join("；")}；另 ${usable.length - 3} 項`;
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function anchorPoint(node, target) {
  const nodeCenterX = node.x + node.w / 2;
  const nodeCenterY = node.y + node.h / 2;
  const targetCenterX = target.x + target.w / 2;
  const targetCenterY = target.y + target.h / 2;
  const dx = targetCenterX - nodeCenterX;
  const dy = targetCenterY - nodeCenterY;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: dx > 0 ? node.x + node.w : node.x, y: nodeCenterY };
  }
  return { x: nodeCenterX, y: dy > 0 ? node.y + node.h : node.y };
}

function edgePath(start, end, style) {
  if (style === "feedback") {
    const offset = Math.max(70, Math.abs(start.x - end.x) * 0.25);
    return `M ${start.x} ${start.y} C ${start.x + offset} ${start.y - 90}, ${end.x + offset} ${end.y - 90}, ${end.x} ${end.y}`;
  }
  const vertical = Math.abs(start.y - end.y) > Math.abs(start.x - end.x);
  if (vertical) {
    const middle = start.y + (end.y - start.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${middle}, ${end.x} ${middle}, ${end.x} ${end.y}`;
  }
  const middle = start.x + (end.x - start.x) / 2;
  return `M ${start.x} ${start.y} C ${middle} ${start.y}, ${middle} ${end.y}, ${end.x} ${end.y}`;
}

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(svgNS, tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) el.setAttribute(key, String(value));
  });
  return el;
}

function svgText(value, x, y, attrs = {}) {
  const text = svgEl("text", {
    x,
    y,
    fill: attrs.fill || "#171717",
    "font-family": "ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans TC, sans-serif",
    ...attrs,
  });
  text.textContent = value;
  return text;
}

function appendWrappedText(parent, text, x, y, maxWidth, attrs = {}, maxLines = 3, anchor = "middle") {
  const fontSize = Number(attrs["font-size"] || 16);
  const maxChars = Math.max(6, Math.floor(maxWidth / (fontSize * 0.62)));
  const lines = wrapText(text || "", maxChars, maxLines);
  const textEl = svgText("", x, y, { ...attrs, "text-anchor": attrs["text-anchor"] || anchor });
  lines.forEach((line, index) => {
    const tspan = svgEl("tspan", { x, dy: index === 0 ? 0 : fontSize * 1.25 });
    tspan.textContent = line;
    textEl.appendChild(tspan);
  });
  parent.appendChild(textEl);
}

function wrapText(text, maxChars, maxLines) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) return [""];
  const hasSpaces = /\s/.test(normalized);
  const tokens = hasSpaces ? normalized.split(" ") : Array.from(normalized);
  const lines = [];
  let line = "";
  tokens.forEach((token) => {
    const next = hasSpaces ? (line ? `${line} ${token}` : token) : line + token;
    if (weightedLength(next) > maxChars && line) {
      lines.push(line);
      line = token;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  const trimmed = lines.slice(0, maxLines);
  if (lines.length > maxLines) trimmed[trimmed.length - 1] = trimmed[trimmed.length - 1].replace(/[，,。.;；\s]*$/, "") + "...";
  return trimmed;
}

function weightedLength(text) {
  return Array.from(text).reduce((sum, char) => sum + (/[\u4e00-\u9fff]/.test(char) ? 1.45 : 1), 0);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.style.cssText = [
      "position:fixed",
      "left:50%",
      "bottom:24px",
      "transform:translateX(-50%)",
      "background:#171717",
      "color:#fff",
      "padding:10px 14px",
      "border-radius:6px",
      "font-size:13px",
      "z-index:50",
      "box-shadow:0 10px 24px rgba(0,0,0,.2)",
    ].join(";");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.remove(), 2200);
}
