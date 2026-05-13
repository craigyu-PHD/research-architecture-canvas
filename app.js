const svgNS = "http://www.w3.org/2000/svg";
const storageVersion = "2026-05-13-v4";

const sampleText = `研究主題：AI 輔助決策下數位治理與民權保障之研究
副標題：從文獻綜述、制度分析到政策建議的研究圖

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
研究架構圖、章節安排、理論貢獻、政策建議、後續檢核清單`;

const diagramTypes = {
  flowchart: {
    label: "流程圖",
    defaultShape: "rounded",
    defaultPalette: "process",
    flowHint: "依時間或操作順序排列。",
  },
  framework: {
    label: "研究架構圖",
    defaultShape: "ellipse",
    defaultPalette: "concept",
    flowHint: "把概念、變項與命題放成層次關係。",
  },
  methodology: {
    label: "方法流程圖",
    defaultShape: "parallelogram",
    defaultPalette: "data",
    flowHint: "呈現資料、方法、檢核與輸出管線。",
  },
  causal: {
    label: "因果模型圖",
    defaultShape: "rounded",
    defaultPalette: "method",
    flowHint: "呈現自變項、中介、調節與結果。",
  },
  matrix: {
    label: "文獻矩陣圖",
    defaultShape: "document",
    defaultPalette: "reference",
    flowHint: "呈現分類、比較與證據層級。",
  },
  timeline: {
    label: "時間軸圖",
    defaultShape: "pill",
    defaultPalette: "process",
    flowHint: "呈現研究期程、事件或階段。",
  },
  hierarchy: {
    label: "分層架構圖",
    defaultShape: "rounded",
    defaultPalette: "concept",
    flowHint: "呈現章節、類目或層級結構。",
  },
  network: {
    label: "關係網絡圖",
    defaultShape: "circle",
    defaultPalette: "node",
    flowHint: "呈現節點、關係與互動路徑。",
  },
};

const palettes = {
  process: { fill: "#e9f2ff", stroke: "#2563eb", dark: "#143a93" },
  concept: { fill: "#f3e9ff", stroke: "#7c3aed", dark: "#4c1d95" },
  data: { fill: "#e8fbff", stroke: "#0891b2", dark: "#075985" },
  method: { fill: "#fff1db", stroke: "#f97316", dark: "#9a3412" },
  decision: { fill: "#ffe8ed", stroke: "#e11d48", dark: "#9f1239" },
  output: { fill: "#e8fff1", stroke: "#059669", dark: "#065f46" },
  reference: { fill: "#f1f5e8", stroke: "#6b8a20", dark: "#3f6212" },
  warning: { fill: "#fff8d8", stroke: "#d97706", dark: "#92400e" },
  node: { fill: "#e8f5ff", stroke: "#0284c7", dark: "#075985" },
};

const shapeLabels = {
  rounded: "處理矩形",
  pill: "起訖圓角",
  diamond: "判斷菱形",
  circle: "圓形節點",
  ellipse: "概念橢圓",
  triangle: "三角形",
  hexagon: "六角形",
  parallelogram: "資料輸入",
  document: "文件框",
};

const keywordMap = {
  input: ["資料", "來源", "樣本", "文本", "文獻", "訪談", "問卷", "政策", "檔案"],
  framework: ["架構", "理論", "概念", "變項", "命題", "假設"],
  process: ["流程", "步驟", "程序", "階段"],
  method: ["方法", "模型", "設計", "抽樣", "統計", "分析"],
  validation: ["檢核", "驗證", "信度", "效度", "穩健"],
  output: ["結論", "發現", "建議", "輸出", "成果", "貢獻"],
  limitation: ["限制", "侷限", "風險", "注意"],
  reference: ["參考文獻", "引用", "書目"],
};

const sectionAliases = {
  title: ["研究主題", "圖表標題", "題目", "title"],
  subtitle: ["副標題", "研究目的", "目的", "摘要", "subtitle"],
  input: ["資料來源", "input", "資料", "樣本", "研究材料"],
  framework: ["研究架構", "架構", "概念架構", "framework"],
  flow: ["主要研究流程", "研究流程", "main research flow", "流程", "步驟"],
  core: ["核心分析模組", "核心分析", "分析模組"],
  output: ["研究輸出", "output", "成果", "研究成果"],
  notes: ["註解", "notes", "備註", "限制"],
};

let state = {
  diagramType: "flowchart",
  title: "學術研究的 AI 畫布",
  subtitle: "貼上研究內容並選擇圖表類型",
  canvas: { width: 1400, height: 1800 },
  nodes: [],
  edges: [],
  legend: {},
  flow: "文字輸入 → 選擇圖表類型 → AI 初稿 → 人工修圖 → 匯出",
  suggestions: [],
};

let selected = { kind: null, id: null };
let zoom = 1;
let panOffset = { x: 0, y: 0 };
let snapToGrid = true;
let lineMode = false;
let pendingLineSource = null;
let currentEdgePreset = { line: "curved", style: "solid", arrow: "end" };
let dragNode = null;
let resizeDrag = null;
let edgeAnchorDrag = null;
let panDrag = null;
let inlineEditor = null;
let pendingExportMode = "export";

const resizeHandleDefs = [
  ["nw", 0, 0, "nwse-resize"],
  ["n", 0.5, 0, "ns-resize"],
  ["ne", 1, 0, "nesw-resize"],
  ["e", 1, 0.5, "ew-resize"],
  ["se", 1, 1, "nwse-resize"],
  ["s", 0.5, 1, "ns-resize"],
  ["sw", 0, 1, "nesw-resize"],
  ["w", 0, 0.5, "ew-resize"],
];

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  loadInitialState();
  render();
  requestAnimationFrame(fitToView);
});

function bindElements() {
  [
    "canvasTabBtn",
    "helpTabBtn",
    "canvasView",
    "helpView",
    "themeToggleBtn",
    "saveLocalBtn",
    "leftRailToggle",
    "rightRailToggle",
    "researchInput",
    "loadSampleBtn",
    "analyzeBtn",
    "clearInputBtn",
    "diagramTypeGrid",
    "shapeGrid",
    "arrowGrid",
    "lineModeHint",
    "canvasScroll",
    "diagramCanvas",
    "zoomOutBtn",
    "zoomInBtn",
    "zoomSlider",
    "zoomLabel",
    "fitBtn",
    "expandCanvasBtn",
    "shrinkCanvasBtn",
    "autoArrangeBtn",
    "snapToggleBtn",
    "snapStateText",
    "resetCanvasBtn",
    "exportSvgBtn",
    "exportPngBtn",
    "exportJsonBtn",
    "importJsonInput",
    "legendEditor",
    "diagramTitleInput",
    "diagramSubtitleInput",
    "diagramFlowInput",
    "exportDialog",
    "exportDialogTitle",
    "exportFilenameInput",
    "exportFormatInput",
    "exportDialogNote",
    "confirmExportBtn",
    "cancelExportBtn",
    "closeExportDialogBtn",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.canvasTabBtn.addEventListener("click", () => setView("canvas"));
  els.helpTabBtn.addEventListener("click", () => setView("help"));
  els.themeToggleBtn.addEventListener("click", toggleTheme);
  els.saveLocalBtn.addEventListener("click", () => openExportDialog("json", "draft"));
  els.leftRailToggle.addEventListener("click", () => togglePanel("left"));
  els.rightRailToggle.addEventListener("click", () => togglePanel("right"));

  els.loadSampleBtn.addEventListener("click", () => {
    els.researchInput.value = sampleText;
  });
  els.clearInputBtn.addEventListener("click", () => {
    els.researchInput.value = "";
    showToast("文字已清空。");
  });
  els.analyzeBtn.addEventListener("click", analyzeInput);

  els.diagramTypeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-diagram]");
    if (!button) return;
    setDiagramType(button.dataset.diagram);
  });
  els.shapeGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-shape]");
    if (!button) return;
    addShapeNode(button.dataset.shape, button.dataset.palette);
  });
  els.arrowGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-line]");
    if (!button) return;
    currentEdgePreset = {
      line: button.dataset.line,
      style: button.dataset.style,
      arrow: button.dataset.arrow,
    };
    lineMode = true;
    pendingLineSource = null;
    updateArrowButtons(button);
    updateLineModeUi();
  });

  els.zoomOutBtn.addEventListener("click", () => setZoom(zoom - 0.1));
  els.zoomInBtn.addEventListener("click", () => setZoom(zoom + 0.1));
  els.zoomSlider.addEventListener("input", () => setZoom(Number(els.zoomSlider.value) / 100));
  els.fitBtn.addEventListener("click", fitToView);
  els.expandCanvasBtn.addEventListener("click", () => resizeCanvas(220, 220));
  els.shrinkCanvasBtn.addEventListener("click", () => resizeCanvas(-220, -220));
  els.autoArrangeBtn.addEventListener("click", autoArrange);
  els.snapToggleBtn.addEventListener("click", toggleSnap);
  els.resetCanvasBtn.addEventListener("click", resetCanvas);

  els.exportSvgBtn.addEventListener("click", exportSvg);
  els.exportPngBtn.addEventListener("click", exportPng);
  els.exportJsonBtn.addEventListener("click", exportJson);
  els.importJsonInput.addEventListener("change", importJson);
  els.confirmExportBtn.addEventListener("click", confirmExport);
  els.cancelExportBtn.addEventListener("click", closeExportDialog);
  els.closeExportDialogBtn.addEventListener("click", closeExportDialog);
  els.exportDialog.addEventListener("cancel", closeExportDialog);

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

  els.canvasScroll.addEventListener("mousedown", startCanvasPan);
  els.canvasScroll.addEventListener("wheel", onCanvasWheel, { passive: false });
  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("mouseup", onDocumentMouseUp);
  document.addEventListener("keydown", onKeyDown);
}

function setView(view) {
  const isHelp = view === "help";
  els.canvasView.classList.toggle("hidden", isHelp);
  els.helpView.classList.toggle("hidden", !isHelp);
  els.canvasTabBtn.classList.toggle("active", !isHelp);
  els.helpTabBtn.classList.toggle("active", isHelp);
}

function toggleTheme() {
  const next = document.body.dataset.theme === "dark" ? "light" : "dark";
  document.body.dataset.theme = next;
  els.themeToggleBtn.textContent = next === "dark" ? "正常模式" : "暗黑模式";
  localStorage.setItem("research-canvas-theme", next);
}

function loadInitialState() {
  const theme = localStorage.getItem("research-canvas-theme");
  if (theme) {
    document.body.dataset.theme = theme;
    els.themeToggleBtn.textContent = theme === "dark" ? "正常模式" : "暗黑模式";
  }
  const stored = localStorage.getItem("research-canvas-state");
  if (stored && localStorage.getItem("research-canvas-version") === storageVersion) {
    try {
      state = normalizeState(JSON.parse(stored));
      els.researchInput.value = localStorage.getItem("research-canvas-input") || "";
      setDiagramType(state.diagramType, false);
      return;
    } catch (error) {
      console.warn("Cannot restore saved diagram", error);
    }
  }
  resetCanvas(false);
}

function analyzeInput() {
  const text = els.researchInput.value.trim();
  if (!text) {
    showToast("請先貼上研究文字。");
    return;
  }
  const started = performance.now();
  els.analyzeBtn.disabled = true;
  els.analyzeBtn.textContent = "生成中...";
  requestAnimationFrame(() => {
    const parsed = parseResearchText(text);
    state = buildDiagram(parsed, state.diagramType);
    selected = { kind: null, id: null };
    ensureCanvasFits();
    els.analyzeBtn.disabled = false;
    els.analyzeBtn.textContent = "生成圖稿";
    showToast(`圖稿已生成，耗時 ${Math.round(performance.now() - started)}ms。`);
    saveLocal(false);
    render();
  });
}

function parseResearchText(text) {
  const lines = text.replace(/\r/g, "\n").split("\n").map(compact).filter(Boolean);
  const buckets = { title: [], subtitle: [], input: [], framework: [], flow: [], core: [], output: [], notes: [], loose: [] };
  let current = null;
  lines.forEach((line) => {
    const section = detectSection(line);
    if (section.key) {
      current = section.key;
      if (section.rest) buckets[current].push(...splitItems(section.rest));
      return;
    }
    if (current) buckets[current].push(...splitItems(line));
    else buckets.loose.push(...splitItems(line));
  });
  const flowSteps = uniqueClean(buckets.flow.length ? buckets.flow : inferLooseSteps(text));
  const frameworkSteps = uniqueClean(buckets.framework);
  const coreSteps = uniqueClean(buckets.core);
  const inputItems = uniqueClean(buckets.input);
  const outputs = uniqueClean(buckets.output);
  return {
    title: buckets.title[0] || inferTitle(lines),
    subtitle: buckets.subtitle[0] || diagramTypes[state.diagramType].label,
    inputItems,
    frameworkSteps,
    flowSteps,
    coreSteps,
    outputs,
    notes: uniqueClean(buckets.notes),
  };
}

function buildDiagram(parsed, diagramType) {
  const base = {
    diagramType,
    title: parsed.title,
    subtitle: parsed.subtitle,
    canvas: { width: 1400, height: 1800 },
    nodes: [],
    edges: [],
    legend: {},
    flow: "",
    suggestions: buildSuggestions(parsed, diagramType),
  };
  const steps = chooseSteps(parsed, diagramType);
  base.nodes = steps.map((step, index) => nodeForStep(step, index, diagramType, parsed));
  arrangeNodes(base.nodes, diagramType, base.canvas);
  base.edges = buildSmartEdges(base.nodes, diagramType);
  base.flow = base.nodes.map((node) => node.title).join(" → ");
  return base;
}

function createProfessionalTemplate(diagramType) {
  const nodes = [
    templateNode("problem", 1, "研究問題界定", "釐清研究目的、核心問題與範圍", "pill", "process", 120, 250, 250, 96),
    templateNode("literature", 2, "文獻綜述與理論框架", "整理概念、缺口與可操作化變項", "document", "reference", 430, 205, 320, 120),
    templateNode("framework", 3, "概念架構與研究命題", "形成變項關係、命題與分析焦點", "ellipse", "concept", 835, 240, 310, 112),
    templateNode("data", 4, "資料來源與樣本", "文本、政策文件、案例或訪談資料", "parallelogram", "data", 170, 520, 310, 112),
    templateNode("method", 5, "方法設計與分析策略", "編碼、比較、模型或詮釋分析", "hexagon", "method", 565, 510, 330, 122),
    templateNode("check", 6, "信度效度與倫理檢核", "資料品質、研究倫理與偏誤修正", "diamond", "decision", 960, 500, 230, 170),
    templateNode("output", 7, "研究發現與政策建議", "理論貢獻、實務建議與後續研究", "pill", "output", 485, 815, 350, 104),
  ];
  const edges = [
    templateEdge("problem", "literature", "", "curved", "solid", "end"),
    templateEdge("literature", "framework", "", "curved", "solid", "end"),
    templateEdge("framework", "data", "操作化", "curved", "solid", "end"),
    templateEdge("data", "method", "", "curved", "solid", "end"),
    templateEdge("method", "check", "", "curved", "solid", "end"),
    templateEdge("check", "output", "通過", "curved", "solid", "end"),
    templateEdge("check", "method", "修正設計", "curved", "feedback", "end"),
    templateEdge("output", "problem", "形成新問題", "curved", "dashed", "end"),
  ];
  return {
    diagramType,
    title: "學術研究設計與方法流程圖",
    subtitle: "問題、文獻、架構、資料、方法、檢核與輸出的迭代研究圖",
    canvas: { width: 1400, height: 1180 },
    nodes,
    edges,
    legend: {
      [legendKey("pill", "process")]: "研究起點",
      [legendKey("document", "reference")]: "文獻與理論",
      [legendKey("ellipse", "concept")]: "概念架構",
      [legendKey("parallelogram", "data")]: "資料來源",
      [legendKey("hexagon", "method")]: "方法設計",
      [legendKey("diamond", "decision")]: "檢核判斷",
      [legendKey("pill", "output")]: "研究輸出",
    },
    flow: "研究問題界定 → 文獻綜述與理論框架 → 概念架構與研究命題 → 資料來源與樣本 → 方法設計與分析策略 → 信度效度與倫理檢核 → 研究發現與政策建議 ↺ 回頭修正",
    suggestions: [],
  };
}

function templateNode(id, number, title, body, shape, palette, x, y, w, h) {
  return { id: `tpl-${id}`, number, title, body, shape, palette, x, y, w, h };
}

function templateEdge(from, to, label, line, style, arrow) {
  return {
    id: `tpl-edge-${from}-${to}`,
    from: `tpl-${from}`,
    to: `tpl-${to}`,
    label,
    line,
    style,
    arrow,
    fromAnchor: null,
    toAnchor: null,
  };
}

function chooseSteps(parsed, diagramType) {
  if (diagramType === "flowchart") return composeResearchSteps(parsed).slice(0, 9);
  if (diagramType === "framework" || diagramType === "causal") {
    const items = uniqueClean([
      "研究問題",
      ...(parsed.frameworkSteps.length ? parsed.frameworkSteps : parsed.flowSteps.slice(0, 4)),
      ...(parsed.coreSteps.length ? parsed.coreSteps.slice(0, 2) : []),
      parsed.outputs[0] || "研究輸出",
    ]);
    return withFallback(items, ["研究問題", "核心概念", "理論架構", "分析命題", "研究輸出"]);
  }
  if (diagramType === "methodology") {
    return uniqueClean([
      parsed.inputItems[0] || "資料來源",
      "資料前處理",
      ...(parsed.coreSteps.length ? parsed.coreSteps : ["核心分析"]),
      "檢核機制",
      parsed.outputs[0] || "研究輸出",
    ]).slice(0, 8);
  }
  if (diagramType === "matrix") {
    return withFallback(parsed.frameworkSteps.concat(parsed.flowSteps), ["文獻蒐集", "主題分類", "理論觀點", "方法類型", "研究缺口", "章節用途"]);
  }
  if (diagramType === "timeline") {
    return withFallback(parsed.flowSteps, ["問題界定", "文獻整理", "研究設計", "資料分析", "撰寫修正", "成果輸出"]);
  }
  if (diagramType === "network") {
    return withFallback(parsed.frameworkSteps.concat(parsed.flowSteps), ["核心問題", "資料來源", "理論架構", "研究方法", "檢核機制", "研究輸出"]);
  }
  if (diagramType === "hierarchy") {
    return withFallback(parsed.frameworkSteps.concat(parsed.flowSteps), ["總研究問題", "理論層", "方法層", "分析層", "輸出層"]);
  }
  return composeResearchSteps(parsed).slice(0, 9);
}

function composeResearchSteps(parsed) {
  return withFallback(uniqueClean([
    parsed.frameworkSteps[0] || parsed.flowSteps[0] || "研究問題界定",
    ...(parsed.inputItems.length ? [parsed.inputItems[0]] : ["資料來源盤點"]),
    ...(parsed.frameworkSteps.length > 1 ? parsed.frameworkSteps.slice(1, 3) : ["理論架構建立"]),
    ...(parsed.coreSteps.length ? parsed.coreSteps.slice(0, 3) : parsed.flowSteps.slice(1, 4)),
    "檢核與修正",
    parsed.outputs[0] || "研究輸出",
  ]), ["研究問題界定", "資料來源盤點", "研究架構建立", "核心分析", "檢核與修正", "研究輸出"]);
}

function withFallback(items, fallback) {
  const clean = uniqueClean(items);
  return (clean.length ? clean : fallback).slice(0, 9);
}

function nodeForStep(step, index, diagramType, parsed) {
  const typeInfo = diagramTypes[diagramType];
  const role = classifyStep(step, index);
  let shape = typeInfo.defaultShape;
  let palette = typeInfo.defaultPalette;
  if (role === "input") {
    shape = "parallelogram";
    palette = "data";
  }
  if (role === "validation" || /判斷|是否|檢核/.test(step)) {
    shape = "diamond";
    palette = "decision";
  }
  if (role === "output") {
    shape = "pill";
    palette = "output";
  }
  if (role === "reference") {
    shape = "document";
    palette = "reference";
  }
  if (diagramType === "network") {
    shape = index === 0 ? "ellipse" : "circle";
    palette = index === 0 ? "concept" : "node";
  }
  if (diagramType === "timeline") {
    shape = "pill";
    palette = index % 2 ? "method" : "process";
  }
  return {
    id: `node-${Date.now()}-${index}-${Math.round(Math.random() * 1000)}`,
    number: index + 1,
    title: step,
    body: bodyForRole(role, parsed),
    role,
    shape,
    palette,
    x: 360,
    y: 240 + index * 142,
    w: shape === "circle" ? 138 : 360,
    h: shape === "circle" ? 138 : shape === "diamond" ? 150 : 112,
  };
}

function bodyForRole(role, parsed) {
  if (role === "input") return summarize(parsed.inputItems, "資料、樣本、文本或政策文件");
  if (role === "output") return summarize(parsed.outputs, "研究發現、理論貢獻或政策建議");
  if (role === "reference") return "文獻、引用來源與證據層級";
  if (role === "validation") return "信度、效度、穩健性或人工校讀";
  if (role === "framework") return summarize(parsed.frameworkSteps, "理論、概念、變項與命題關係");
  return "雙擊可直接編輯";
}

function classifyStep(step, index) {
  const text = step.toLowerCase();
  for (const [role, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) return role;
  }
  if (index === 0) return "framework";
  return "process";
}

function buildSmartEdges(nodes, diagramType) {
  if (nodes.length < 2) return [];
  if (diagramType === "network") {
    return nodes.slice(1).map((node, index) => smartEdge(nodes[0], node, index, "影響", "curved", "solid"));
  }
  const edges = nodes.slice(0, -1).map((node, index) => {
    const next = nodes[index + 1];
    const relation = relationLabel(node, next);
    const line = diagramType === "timeline" ? "straight" : relation.line;
    return smartEdge(node, next, index, relation.label, line, relation.style);
  });
  const validationIndex = nodes.findIndex((node) => node.role === "validation" || /檢核|驗證|修正|信度|效度/.test(node.title));
  const methodIndex = nodes.findIndex((node) => node.role === "method" || /方法|分析|模型|編碼/.test(node.title));
  if (validationIndex > methodIndex && methodIndex >= 0) {
    edges.push(smartEdge(nodes[validationIndex], nodes[methodIndex], edges.length, "回饋修正", "curved", "feedback"));
  }
  const outputIndex = nodes.findIndex((node) => node.role === "output");
  if (outputIndex > 1 && diagramType !== "timeline") {
    edges.push(smartEdge(nodes[outputIndex], nodes[0], edges.length, "形成新問題", "curved", "dashed"));
  }
  return edges;
}

function relationLabel(from, to) {
  if (from.role === "input" && to.role === "method") return { label: "分析", line: "curved", style: "solid" };
  if (from.role === "framework" && to.role === "input") return { label: "操作化", line: "curved", style: "solid" };
  if (to.role === "validation") return { label: "檢核", line: "curved", style: "dashed" };
  if (to.role === "output") return { label: "產出", line: "curved", style: "solid" };
  if (from.role === "reference") return { label: "支撐", line: "curved", style: "dashed" };
  return { label: "", line: "curved", style: "solid" };
}

function smartEdge(from, to, index, label, line, style) {
  return {
    id: `edge-${from.id}-${to.id}-${index}`,
    from: from.id,
    to: to.id,
    label,
    line,
    style,
    arrow: "end",
    fromAnchor: preferredAnchor(from, to, "from"),
    toAnchor: preferredAnchor(to, from, "to"),
  };
}

function preferredAnchor(node, other, direction) {
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const ox = other.x + other.w / 2;
  const oy = other.y + other.h / 2;
  const dx = ox - cx;
  const dy = oy - cy;
  if (Math.abs(dx) > Math.abs(dy)) return { x: dx > 0 ? 1 : 0, y: 0.5 };
  return { x: 0.5, y: dy > 0 ? 1 : 0 };
}

function arrangeNodes(nodes, diagramType, canvas) {
  if (diagramType === "timeline") {
    canvas.width = Math.max(1500, nodes.length * 250 + 280);
    canvas.height = 1100;
    nodes.forEach((node, index) => {
      node.x = 150 + index * 245;
      node.y = index % 2 ? 520 : 350;
      node.w = 190;
      node.h = 82;
    });
    return;
  }
  if (diagramType === "matrix") {
    canvas.width = 1400;
    canvas.height = Math.max(1100, Math.ceil(nodes.length / 3) * 180 + 520);
    nodes.forEach((node, index) => {
      node.x = 190 + (index % 3) * 360;
      node.y = 280 + Math.floor(index / 3) * 170;
      node.w = 290;
      node.h = 118;
    });
    return;
  }
  if (diagramType === "network") {
    canvas.width = 1400;
    canvas.height = 1300;
    const center = { x: 650, y: 560 };
    nodes.forEach((node, index) => {
      if (index === 0) {
        node.x = center.x - 190;
        node.y = center.y - 70;
        node.w = 380;
        node.h = 140;
        return;
      }
      const angle = ((index - 1) / Math.max(1, nodes.length - 1)) * Math.PI * 2 - Math.PI / 2;
      node.x = center.x + Math.cos(angle) * 360 - 75;
      node.y = center.y + Math.sin(angle) * 300 - 75;
      node.w = 150;
      node.h = 150;
    });
    return;
  }
  if (diagramType === "framework" || diagramType === "causal" || diagramType === "hierarchy") {
    canvas.width = 1400;
    canvas.height = Math.max(1300, nodes.length * 145 + 460);
    const columns = [180, 520, 860];
    nodes.forEach((node, index) => {
      const col = index === 0 ? 0 : index === nodes.length - 1 ? 2 : 1;
      node.x = columns[col];
      node.y = 270 + index * 125;
      node.w = col === 1 ? 410 : 300;
      node.h = node.shape === "diamond" ? 145 : 108;
    });
    return;
  }
  canvas.width = 1400;
  canvas.height = Math.max(1500, nodes.length * 152 + 520);
  nodes.forEach((node, index) => {
    node.x = 470;
    node.y = 245 + index * 148;
    node.w = node.shape === "diamond" ? 320 : 420;
    node.h = node.shape === "diamond" ? 145 : 108;
  });
}

function render() {
  const svg = els.diagramCanvas;
  svg.innerHTML = "";
  svg.setAttribute("viewBox", `0 0 ${state.canvas.width} ${state.canvas.height}`);
  svg.setAttribute("width", state.canvas.width);
  svg.setAttribute("height", state.canvas.height);
  applyCanvasTransform();
  addDefs(svg);
  drawBackground(svg);
  drawTitle(svg);
  drawEdges(svg);
  state.nodes.forEach((node) => drawNode(svg, node));
  drawLegend(svg);
  drawFlow(svg);
  renderLegendEditor();
  syncDiagramInputs();
  updateLineModeUi();
  updateSnapUi();
  saveLocal(false);
}

function applyCanvasTransform() {
  els.diagramCanvas.style.transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`;
  els.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  els.zoomSlider.value = Math.round(zoom * 100);
}

function addDefs(svg) {
  const defs = svgEl("defs");
  defs.appendChild(markerDef("arrowEnd", "M2,2 L10,6 L2,10 Z", 10, 6));
  defs.appendChild(markerDef("arrowStart", "M10,2 L2,6 L10,10 Z", 2, 6));
  svg.appendChild(defs);
}

function markerDef(id, path, refX, refY) {
  const marker = svgEl("marker", {
    id,
    markerWidth: 12,
    markerHeight: 12,
    refX,
    refY,
    orient: "auto",
    markerUnits: "strokeWidth",
  });
  marker.appendChild(svgEl("path", { d: path, fill: "currentColor" }));
  return marker;
}

function drawBackground(svg) {
  svg.appendChild(svgEl("rect", { class: "canvas-bg", x: 0, y: 0, width: state.canvas.width, height: state.canvas.height, fill: "var(--canvas)" }));
  for (let x = 40; x < state.canvas.width; x += 40) {
    svg.appendChild(svgEl("line", { x1: x, y1: 145, x2: x, y2: state.canvas.height - 90, stroke: "var(--grid)", "stroke-width": 1 }));
  }
  for (let y = 160; y < state.canvas.height - 90; y += 40) {
    svg.appendChild(svgEl("line", { x1: 40, y1: y, x2: state.canvas.width - 40, y2: y, stroke: "var(--grid)", "stroke-width": 1 }));
  }
}

function drawTitle(svg) {
  svg.appendChild(svgText(state.title, state.canvas.width / 2, 62, { "text-anchor": "middle", "font-size": 32, "font-weight": 850, fill: "var(--svg-ink)" }));
  svg.appendChild(svgText(state.subtitle, state.canvas.width / 2, 106, { "text-anchor": "middle", "font-size": 18, "font-weight": 650, fill: "var(--svg-muted)" }));
  svg.appendChild(svgText(diagramTypes[state.diagramType].label, 72, 112, { "font-size": 14, "font-weight": 850, fill: "var(--svg-muted)" }));
}

function drawEdges(svg) {
  const nodesById = new Map(state.nodes.map((node) => [node.id, node]));
  state.edges.forEach((edge) => {
    const from = nodesById.get(edge.from);
    const to = nodesById.get(edge.to);
    if (!from || !to) return;
    const start = edgeAnchorPoint(from, edge.fromAnchor) || anchorPoint(from, to);
    const end = edgeAnchorPoint(to, edge.toAnchor) || anchorPoint(to, from);
    const path = edgePath(start, end, edge.line);
    const selectedEdge = selected.kind === "edge" && selected.id === edge.id;
    const hit = svgEl("path", { d: path, fill: "none", stroke: "transparent", "stroke-width": 18, cursor: "pointer" });
    hit.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      selected = { kind: "edge", id: edge.id };
      render();
    });
    svg.appendChild(hit);
    const attrs = {
      d: path,
      class: "edge-line",
      "data-edge-line": edge.id,
      fill: "none",
      stroke: selectedEdge ? "#f97316" : "var(--svg-ink)",
      "stroke-width": selectedEdge ? 3 : 2,
      "stroke-dasharray": dashArray(edge.style),
      "pointer-events": "none",
    };
    if (edge.arrow === "end" || edge.arrow === "both") attrs["marker-end"] = "url(#arrowEnd)";
    if (edge.arrow === "both") attrs["marker-start"] = "url(#arrowStart)";
    svg.appendChild(svgEl("path", attrs));
    if (edge.label) drawEdgeLabel(svg, edge.label, start, end);
    if (selectedEdge) drawEdgeEndpointHandles(svg, edge, start, end);
  });
}

function drawEdgeEndpointHandles(svg, edge, start, end) {
  [
    ["from", start, "#2563eb"],
    ["to", end, "#f97316"],
  ].forEach(([endKey, point, color]) => {
    const handle = svgEl("circle", {
      class: "edge-endpoint edit-only",
      cx: point.x,
      cy: point.y,
      r: 8,
      fill: "var(--canvas)",
      stroke: color,
      "stroke-width": 3,
      cursor: "crosshair",
    });
    handle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      edgeAnchorDrag = { edgeId: edge.id, end: endKey };
    });
    svg.appendChild(handle);
  });
}

function drawEdgeLabel(svg, label, start, end) {
  const x = (start.x + end.x) / 2;
  const y = (start.y + end.y) / 2 - 12;
  const w = Math.max(62, Math.min(200, weightedLength(label) * 12));
  svg.appendChild(svgEl("rect", { x: x - w / 2, y: y - 22, width: w, height: 28, rx: 6, fill: "var(--canvas)", stroke: "var(--panel-border)", "stroke-width": 1 }));
  appendWrappedText(svg, label, x, y - 3, w - 14, { "text-anchor": "middle", "font-size": 13, "font-weight": 800, fill: "var(--svg-ink)" }, 1);
}

function drawNode(svg, node) {
  const palette = palettes[node.palette] || palettes.process;
  const group = svgEl("g", { class: "node", "data-id": node.id, cursor: lineMode ? "crosshair" : "move" });
  const isSelected = selected.kind === "node" && selected.id === node.id;
  const isLineSource = pendingLineSource === node.id;
  if (isSelected || isLineSource) {
    group.appendChild(svgEl("rect", {
      class: "selection-ring edit-only",
      x: node.x - 10,
      y: node.y - 10,
      width: node.w + 20,
      height: node.h + 20,
      rx: 12,
      fill: "none",
      stroke: isLineSource ? "#f97316" : "#2563eb",
      "stroke-width": 3,
      "stroke-dasharray": "8 6",
    }));
  }
  drawShape(group, node, palette);
  const textWidth = node.shape === "diamond" ? node.w * 0.58 : node.shape === "triangle" ? node.w * 0.55 : node.w - 48;
  appendWrappedText(group, node.title, node.x + node.w / 2, node.y + node.h * 0.43, textWidth, { "text-anchor": "middle", "font-size": 17, "font-weight": 850, fill: nodeTextColor(node, "title") }, 2);
  appendWrappedText(group, node.body, node.x + node.w / 2, node.y + node.h * 0.66, textWidth, { "text-anchor": "middle", "font-size": 13, fill: nodeTextColor(node, "body") }, 2);
  if (isSelected && !lineMode) drawResizeHandles(group, node);
  group.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (lineMode) {
      handleLineNodeClick(node.id);
      return;
    }
    selected = { kind: "node", id: node.id };
    const point = clientToSvg(event.clientX, event.clientY);
    dragNode = { id: node.id, offsetX: point.x - node.x, offsetY: point.y - node.y };
    render();
  });
  group.addEventListener("dblclick", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openNodeInlineEditor(node);
  });
  svg.appendChild(group);
}

function drawResizeHandles(group, node) {
  resizeHandleDefs.forEach(([handle, px, py, cursor]) => {
    const x = node.x + node.w * px;
    const y = node.y + node.h * py;
    const rect = svgEl("rect", {
      class: "resize-handle edit-only",
      "data-handle": handle,
      x: x - 6,
      y: y - 6,
      width: 12,
      height: 12,
      rx: 3,
      fill: "var(--canvas)",
      stroke: "#2563eb",
      "stroke-width": 2,
      cursor,
    });
    rect.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const point = clientToSvg(event.clientX, event.clientY);
      resizeDrag = {
        id: node.id,
        handle,
        startX: point.x,
        startY: point.y,
        x: node.x,
        y: node.y,
        w: node.w,
        h: node.h,
      };
    });
    group.appendChild(rect);
  });
}

function drawShape(group, node, palette) {
  const attrs = {
    fill: palette.fill,
    stroke: palette.stroke,
    "stroke-width": 2,
  };
  if (node.shape === "circle" || node.shape === "ellipse") {
    group.appendChild(svgEl("ellipse", { cx: node.x + node.w / 2, cy: node.y + node.h / 2, rx: node.w / 2, ry: node.h / 2, ...attrs }));
    return;
  }
  if (node.shape === "diamond") {
    group.appendChild(svgEl("path", { d: `M ${node.x + node.w / 2} ${node.y} L ${node.x + node.w} ${node.y + node.h / 2} L ${node.x + node.w / 2} ${node.y + node.h} L ${node.x} ${node.y + node.h / 2} Z`, ...attrs }));
    return;
  }
  if (node.shape === "triangle") {
    group.appendChild(svgEl("path", { d: `M ${node.x + node.w / 2} ${node.y} L ${node.x + node.w} ${node.y + node.h} L ${node.x} ${node.y + node.h} Z`, ...attrs }));
    return;
  }
  if (node.shape === "hexagon") {
    const cut = node.w * 0.16;
    group.appendChild(svgEl("path", { d: `M ${node.x + cut} ${node.y} L ${node.x + node.w - cut} ${node.y} L ${node.x + node.w} ${node.y + node.h / 2} L ${node.x + node.w - cut} ${node.y + node.h} L ${node.x + cut} ${node.y + node.h} L ${node.x} ${node.y + node.h / 2} Z`, ...attrs }));
    return;
  }
  if (node.shape === "parallelogram") {
    const slant = node.w * 0.12;
    group.appendChild(svgEl("path", { d: `M ${node.x + slant} ${node.y} L ${node.x + node.w} ${node.y} L ${node.x + node.w - slant} ${node.y + node.h} L ${node.x} ${node.y + node.h} Z`, ...attrs }));
    return;
  }
  if (node.shape === "document") {
    const wave = 16;
    group.appendChild(svgEl("path", { d: `M ${node.x} ${node.y} H ${node.x + node.w} V ${node.y + node.h - wave} C ${node.x + node.w * 0.72} ${node.y + node.h - wave * 2}, ${node.x + node.w * 0.42} ${node.y + node.h + wave * 0.5}, ${node.x} ${node.y + node.h - wave} Z`, ...attrs }));
    return;
  }
  const rx = node.shape === "pill" ? node.h / 2 : 10;
  group.appendChild(svgEl("rect", { x: node.x, y: node.y, width: node.w, height: node.h, rx, ...attrs }));
}

function nodeTextColor(node, part) {
  const darkTextPalettes = new Set(["warning"]);
  if (darkTextPalettes.has(node.palette)) return part === "title" ? "#1f2937" : "#374151";
  return part === "title" ? "#111827" : "#344054";
}

function drawLegend(svg) {
  const items = buildLegendItems();
  if (!items.length) return;
  const x = state.canvas.width - 300;
  const y = 590;
  const height = Math.max(112, 62 + items.length * 44);
  drawPanel(svg, x, y, 240, height, "圖例");
  items.forEach((item, index) => {
    const rowY = y + 54 + index * 44;
    const node = { x: x + 24, y: rowY, w: 56, h: 28, shape: item.shape, palette: item.palette };
    const g = svgEl("g");
    drawShape(g, node, palettes[item.palette] || palettes.process);
    g.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLegendInlineEditor(item, { x: x + 91, y: rowY - 4, w: 122, h: 34 });
    });
    svg.appendChild(g);
    const text = svgText(item.label, x + 96, rowY + 20, { "font-size": 13, "font-weight": 800, fill: "var(--svg-ink)", cursor: "text" });
    text.addEventListener("dblclick", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openLegendInlineEditor(item, { x: x + 91, y: rowY - 4, w: 122, h: 34 });
    });
    svg.appendChild(text);
  });
}

function drawFlow(svg) {
  const x = 70;
  const w = state.canvas.width - 140;
  const maxChars = Math.max(12, Math.floor((w - 115) / (15 * 0.62)));
  const lines = wrapText(state.flow || "", maxChars, 8);
  const h = Math.max(54, 34 + lines.length * 21);
  const y = state.canvas.height - h - 26;
  const group = svgEl("g", { cursor: "text" });
  group.appendChild(svgEl("rect", { x, y, width: w, height: h, rx: 8, fill: "var(--canvas)", stroke: "var(--svg-ink)", "stroke-width": 1.5, "stroke-dasharray": "7 5" }));
  group.appendChild(svgText("Flow:", x + 28, y + 35, { "font-size": 18, "font-weight": 850, fill: "var(--svg-ink)" }));
  appendWrappedText(group, state.flow || "", x + 90, y + 35, w - 115, { "font-size": 15, "font-weight": 760, fill: "var(--svg-ink)" }, 8, "start");
  group.addEventListener("dblclick", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openFlowInlineEditor({ x: x + 88, y: y + 9, w: w - 110, h: h - 16 });
  });
  svg.appendChild(group);
}

function drawPanel(svg, x, y, w, h, title) {
  svg.appendChild(svgEl("rect", { x, y, width: w, height: h, rx: 8, fill: "var(--canvas)", stroke: "var(--svg-ink)", "stroke-width": 1.4 }));
  svg.appendChild(svgText(title, x + w / 2, y + 31, { "text-anchor": "middle", "font-size": 16, "font-weight": 850, fill: "var(--svg-ink)" }));
}

function handleLineNodeClick(nodeId) {
  if (!pendingLineSource) {
    pendingLineSource = nodeId;
    selected = { kind: "node", id: nodeId };
    showToast("已選第一個圖框，請點第二個圖框。");
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
    ...currentEdgePreset,
  };
  const source = state.nodes.find((node) => node.id === pendingLineSource);
  const target = state.nodes.find((node) => node.id === nodeId);
  if (source && target) {
    edge.fromAnchor = preferredAnchor(source, target, "from");
    edge.toAnchor = preferredAnchor(target, source, "to");
  }
  state.edges.push(edge);
  selected = { kind: "edge", id: edge.id };
  pendingLineSource = null;
  lineMode = false;
  render();
}

function startCanvasPan(event) {
  if (event.button !== 0 || inlineEditor || lineMode) return;
  const target = event.target;
  if (target.closest?.(".node") || target.closest?.("path[stroke='transparent']")) return;
  event.preventDefault();
  const hadSelection = Boolean(selected.kind);
  selected = { kind: null, id: null };
  panDrag = {
    startX: event.clientX,
    startY: event.clientY,
    x: panOffset.x,
    y: panOffset.y,
    moved: false,
    hadSelection,
  };
  els.canvasScroll.classList.add("panning");
}

function onDocumentMouseMove(event) {
  if (resizeDrag) {
    const node = state.nodes.find((item) => item.id === resizeDrag.id);
    if (!node) return;
    resizeSelectedNode(node, event);
    render();
    return;
  }
  if (edgeAnchorDrag) {
    const edge = state.edges.find((item) => item.id === edgeAnchorDrag.edgeId);
    if (!edge) return;
    const nodeId = edgeAnchorDrag.end === "from" ? edge.from : edge.to;
    const node = state.nodes.find((item) => item.id === nodeId);
    if (!node) return;
    edge[`${edgeAnchorDrag.end}Anchor`] = pointToBoundaryAnchor(node, clientToSvg(event.clientX, event.clientY));
    render();
    return;
  }
  if (dragNode) {
    const node = state.nodes.find((item) => item.id === dragNode.id);
    if (!node) return;
    const point = clientToSvg(event.clientX, event.clientY);
    node.x = clamp(point.x - dragNode.offsetX, 24, state.canvas.width - node.w - 24);
    node.y = clamp(point.y - dragNode.offsetY, 140, state.canvas.height - node.h - 100);
    render();
    return;
  }
  if (panDrag) {
    panOffset.x = panDrag.x + (event.clientX - panDrag.startX);
    panOffset.y = panDrag.y + (event.clientY - panDrag.startY);
    panDrag.moved = true;
    applyCanvasTransform();
  }
}

function onDocumentMouseUp() {
  if (resizeDrag) {
    const node = state.nodes.find((item) => item.id === resizeDrag.id);
    if (node && snapToGrid) {
      node.x = snap(node.x);
      node.y = snap(node.y);
      node.w = Math.max(80, snap(node.w));
      node.h = Math.max(60, snap(node.h));
    }
    resizeDrag = null;
    render();
  }
  if (edgeAnchorDrag) {
    edgeAnchorDrag = null;
    render();
  }
  if (dragNode) {
    const node = state.nodes.find((item) => item.id === dragNode.id);
    if (node && snapToGrid) {
      node.x = snap(node.x);
      node.y = snap(node.y);
    }
    dragNode = null;
    render();
  }
  if (panDrag) {
    const needsRender = panDrag.moved || panDrag.hadSelection;
    panDrag = null;
    els.canvasScroll.classList.remove("panning");
    if (needsRender) render();
  }
}

function resizeSelectedNode(node, event) {
  const point = clientToSvg(event.clientX, event.clientY);
  const dx = point.x - resizeDrag.startX;
  const dy = point.y - resizeDrag.startY;
  const handle = resizeDrag.handle;
  let nextX = resizeDrag.x;
  let nextY = resizeDrag.y;
  let nextW = resizeDrag.w;
  let nextH = resizeDrag.h;
  const minW = 82;
  const minH = 58;
  if (handle.includes("e")) nextW = resizeDrag.w + dx;
  if (handle.includes("s")) nextH = resizeDrag.h + dy;
  if (handle.includes("w")) {
    nextX = resizeDrag.x + dx;
    nextW = resizeDrag.w - dx;
  }
  if (handle.includes("n")) {
    nextY = resizeDrag.y + dy;
    nextH = resizeDrag.h - dy;
  }
  if (nextW < minW) {
    if (handle.includes("w")) nextX -= minW - nextW;
    nextW = minW;
  }
  if (nextH < minH) {
    if (handle.includes("n")) nextY -= minH - nextH;
    nextH = minH;
  }
  node.x = clamp(nextX, 24, state.canvas.width - minW - 24);
  node.y = clamp(nextY, 140, state.canvas.height - minH - 100);
  node.w = clamp(nextW, minW, state.canvas.width - node.x - 24);
  node.h = clamp(nextH, minH, state.canvas.height - node.y - 100);
}

function onCanvasWheel(event) {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  setZoom(zoom + (event.deltaY > 0 ? -0.08 : 0.08));
}

function onKeyDown(event) {
  const tag = document.activeElement?.tagName?.toLowerCase();
  if (["input", "textarea", "select"].includes(tag)) return;
  if (event.key === "Escape") {
    lineMode = false;
    pendingLineSource = null;
    closeInlineEditor(false);
    render();
  }
  if (event.key === "Delete" || event.key === "Backspace") deleteSelected();
}

function openNodeInlineEditor(node) {
  openInlineEditor({
    value: `${node.title}\n${node.body || ""}`,
    rect: { x: node.x + 24, y: node.y + 18, w: node.w - 48, h: Math.max(76, node.h - 30) },
    commit: (value) => {
      const lines = value.split("\n").map((line) => line.trim());
      node.title = lines[0] || node.title;
      node.body = lines.slice(1).join(" ").trim();
      rebuildFlow();
    },
  });
}

function openFlowInlineEditor(rect) {
  openInlineEditor({
    value: state.flow,
    rect,
    commit: (value) => {
      state.flow = value.trim();
    },
  });
}

function openLegendInlineEditor(item, rect) {
  openInlineEditor({
    value: item.label,
    rect,
    commit: (value) => {
      setLegendLabel(item.key, value.trim() || item.defaultLabel);
    },
  });
}

function openInlineEditor({ value, rect, commit }) {
  closeInlineEditor(false);
  const svgRect = els.diagramCanvas.getBoundingClientRect();
  const scrollRect = els.canvasScroll.getBoundingClientRect();
  const textarea = document.createElement("textarea");
  textarea.className = "inline-editor";
  textarea.value = value;
  textarea.style.left = `${svgRect.left - scrollRect.left + rect.x * zoom}px`;
  textarea.style.top = `${svgRect.top - scrollRect.top + rect.y * zoom}px`;
  textarea.style.width = `${rect.w * zoom}px`;
  textarea.style.height = `${rect.h * zoom}px`;
  textarea.addEventListener("mousedown", (event) => event.stopPropagation());
  textarea.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") closeInlineEditor(true);
    if (event.key === "Escape") closeInlineEditor(false);
  });
  textarea.addEventListener("blur", () => closeInlineEditor(true));
  els.canvasScroll.appendChild(textarea);
  inlineEditor = { textarea, commit };
  textarea.focus();
  textarea.select();
}

function closeInlineEditor(commit) {
  if (!inlineEditor) return;
  const { textarea, commit: commitFn } = inlineEditor;
  inlineEditor = null;
  if (commit) commitFn(textarea.value);
  if (textarea.parentNode?.contains(textarea)) {
    textarea.parentNode.removeChild(textarea);
  }
  render();
}

function renderLegendEditor() {
  if (!els.legendEditor) return;
  const items = state.nodes.slice().sort((a, b) => a.number - b.number);
  els.legendEditor.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "目前畫布沒有可編輯的圖框。";
    els.legendEditor.appendChild(empty);
    return;
  }
  items.forEach((node) => {
    const card = document.createElement("article");
    card.className = "node-editor-card";
    card.classList.toggle("active", selected.kind === "node" && selected.id === node.id);
    const palette = palettes[node.palette] || palettes.process;
    const head = document.createElement("div");
    head.className = "node-editor-head";
    const badge = document.createElement("button");
    badge.className = "node-number-badge";
    badge.type = "button";
    badge.textContent = String(node.number);
    badge.title = `選取第 ${node.number} 個圖框`;
    badge.addEventListener("click", () => {
      selected = { kind: "node", id: node.id };
      render();
    });
    const swatch = document.createElement("span");
    swatch.className = `legend-swatch ${node.shape}`;
    swatch.style.setProperty("--swatch-fill", palette.fill);
    swatch.style.setProperty("--swatch-stroke", palette.stroke);
    const meta = document.createElement("div");
    meta.className = "node-editor-meta";
    meta.innerHTML = `<strong>圖框 ${node.number}</strong><span>${shapeLabels[node.shape] || "圖框"} · ${paletteLabel(node.palette)}</span>`;
    head.append(badge, swatch, meta);

    const title = editorInput("標題", node.title, (value) => {
      node.title = value || `圖框 ${node.number}`;
    }, () => {
      rebuildFlow();
      render();
    });
    const body = editorTextarea("說明", node.body, (value) => {
      node.body = value;
    }, render);

    const controlGrid = document.createElement("div");
    controlGrid.className = "node-editor-grid";
    controlGrid.append(
      editorSelect("形狀", node.shape, shapeLabels, (value) => {
        node.shape = value;
        selected = { kind: "node", id: node.id };
        render();
      }),
      editorSelect("顏色", node.palette, paletteLabels(), (value) => {
        node.palette = value;
        selected = { kind: "node", id: node.id };
        render();
      }),
      editorNumber("寬", node.w, 80, 900, (value) => {
        node.w = clamp(value, 80, 900);
        selected = { kind: "node", id: node.id };
        render();
      }),
      editorNumber("高", node.h, 58, 520, (value) => {
        node.h = clamp(value, 58, 520);
        selected = { kind: "node", id: node.id };
        render();
      }),
    );
    card.append(head, title, body, controlGrid);
    els.legendEditor.appendChild(card);
  });
}

function editorInput(labelText, value, onInput, onChange) {
  const label = document.createElement("label");
  label.className = "node-editor-field";
  label.textContent = labelText;
  const input = document.createElement("input");
  input.value = value || "";
  input.addEventListener("input", () => {
    onInput(input.value.trim());
    saveLocal(false);
  });
  input.addEventListener("change", onChange);
  label.appendChild(input);
  return label;
}

function editorTextarea(labelText, value, onInput, onChange) {
  const label = document.createElement("label");
  label.className = "node-editor-field";
  label.textContent = labelText;
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.addEventListener("input", () => {
    onInput(textarea.value.trim());
    saveLocal(false);
  });
  textarea.addEventListener("change", onChange);
  label.appendChild(textarea);
  return label;
}

function editorSelect(labelText, value, options, onChange) {
  const label = document.createElement("label");
  label.className = "node-editor-field";
  label.textContent = labelText;
  const select = document.createElement("select");
  Object.entries(options).forEach(([optionValue, optionLabel]) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionLabel;
    select.appendChild(option);
  });
  select.value = value;
  select.addEventListener("change", () => onChange(select.value));
  label.appendChild(select);
  return label;
}

function editorNumber(labelText, value, min, max, onChange) {
  const label = document.createElement("label");
  label.className = "node-editor-field";
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = "number";
  input.min = min;
  input.max = max;
  input.value = Math.round(value);
  input.addEventListener("change", () => onChange(Number(input.value) || value));
  label.appendChild(input);
  return label;
}

function paletteLabels() {
  return {
    process: "流程藍",
    concept: "概念紫",
    data: "資料青",
    method: "方法橙",
    decision: "判斷紅",
    output: "輸出綠",
    reference: "文獻綠",
    warning: "限制黃",
    node: "節點藍",
  };
}

function paletteLabel(key) {
  return paletteLabels()[key] || "自訂色";
}

function syncDiagramInputs() {
  if (document.activeElement !== els.diagramTitleInput) els.diagramTitleInput.value = state.title || "";
  if (document.activeElement !== els.diagramSubtitleInput) els.diagramSubtitleInput.value = state.subtitle || "";
  if (document.activeElement !== els.diagramFlowInput) els.diagramFlowInput.value = state.flow || "";
}

function setDiagramType(type, shouldRender = true) {
  state.diagramType = diagramTypes[type] ? type : "flowchart";
  els.diagramTypeGrid.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.diagram === state.diagramType);
  });
  els.analyzeBtn.title = diagramTypes[state.diagramType].flowHint;
  if (shouldRender) render();
}

function addShapeNode(shape, palette) {
  const number = state.nodes.length + 1;
  const y = Math.max(230, ...state.nodes.map((node) => node.y + node.h + 40));
  const node = {
    id: `node-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    number,
    title: shapeLabels[shape] || "新增圖框",
    body: "雙擊可直接編輯",
    shape,
    palette,
    x: snap(420),
    y: snap(y),
    w: shape === "circle" ? 140 : shape === "diamond" ? 180 : 320,
    h: shape === "circle" ? 140 : shape === "diamond" ? 150 : 110,
  };
  state.nodes.push(node);
  selected = { kind: "node", id: node.id };
  rebuildFlow();
  ensureCanvasFits();
  render();
}

function autoArrange() {
  arrangeNodes(state.nodes, state.diagramType, state.canvas);
  state.nodes.forEach((node, index) => {
    node.number = index + 1;
    node.x = snap(node.x);
    node.y = snap(node.y);
  });
  rebuildFlow();
  ensureCanvasFits();
  render();
}

function resetCanvas(confirmFirst = true) {
  if (confirmFirst && !window.confirm("確定要重置畫布？目前圖稿會清除。")) return;
  state = createProfessionalTemplate(state.diagramType);
  selected = { kind: null, id: null };
  panOffset = { x: 0, y: 0 };
  render();
}

function deleteSelected() {
  if (!selected.kind) return;
  if (selected.kind === "node") {
    state.nodes = state.nodes.filter((node) => node.id !== selected.id);
    state.edges = state.edges.filter((edge) => edge.from !== selected.id && edge.to !== selected.id);
  } else if (selected.kind === "edge") {
    state.edges = state.edges.filter((edge) => edge.id !== selected.id);
  }
  selected = { kind: null, id: null };
  rebuildFlow();
  render();
}

function selectedNode() {
  return state.nodes.find((node) => node.id === selected.id) || null;
}

function selectedEdge() {
  return state.edges.find((edge) => edge.id === selected.id) || null;
}

function buildLegendItems() {
  const seen = new Set();
  return state.nodes.reduce((items, node) => {
    const key = legendKey(node.shape, node.palette);
    if (seen.has(key)) return items;
    seen.add(key);
    const defaultLabel = shapeLabels[node.shape] || "圖框";
    items.push({
      key,
      shape: node.shape,
      palette: node.palette,
      defaultLabel,
      label: state.legend?.[key] || defaultLabel,
    });
    return items;
  }, []);
}

function legendKey(shape, palette) {
  return `${shape}:${palette}`;
}

function setLegendLabel(key, label) {
  state.legend = { ...(state.legend || {}), [key]: label };
}

function rebuildFlow() {
  state.flow = state.nodes.slice().sort((a, b) => a.number - b.number).map((node) => node.title).join(" → ");
}

function buildSuggestions(parsed, diagramType) {
  const suggestions = [];
  if (!parsed.frameworkSteps.length && diagramType === "framework") {
    suggestions.push({ level: "warn", title: "研究架構素材不足", body: "請補概念、變項、命題或章節關係，架構圖會更準確。" });
  }
  if (!parsed.flowSteps.length && diagramType === "flowchart") {
    suggestions.push({ level: "warn", title: "流程步驟不足", body: "請用 1、2、3 或箭頭列出操作順序。" });
  }
  if (!parsed.inputItems.length) {
    suggestions.push({ level: "info", title: "補資料來源", body: "論文圖通常要標出樣本、資料期間或文本來源。" });
  }
  suggestions.push({ level: "ok", title: "可直接修圖", body: "雙擊圖框改字，拖曳空白畫布可平移，選箭頭模組可手動連線。" });
  return suggestions.slice(0, 3);
}

function ensureCanvasFits() {
  const maxX = Math.max(1200, ...state.nodes.map((node) => node.x + node.w + 360));
  const maxY = Math.max(1100, ...state.nodes.map((node) => node.y + node.h + 260));
  state.canvas.width = Math.max(980, Math.ceil(maxX / 80) * 80);
  state.canvas.height = Math.max(900, Math.ceil(maxY / 80) * 80);
}

function resizeCanvas(dx, dy) {
  state.canvas.width = clamp(state.canvas.width + dx, 900, 4000);
  state.canvas.height = clamp(state.canvas.height + dy, 760, 5000);
  render();
}

function setZoom(next) {
  zoom = clamp(next, 0.35, 1.8);
  render();
}

function fitToView() {
  const widthZoom = (els.canvasScroll.clientWidth - 60) / state.canvas.width;
  zoom = clamp(widthZoom, 0.35, 1);
  panOffset = { x: 0, y: 0 };
  render();
}

function togglePanel(side) {
  const className = side === "left" ? "left-collapsed" : "right-collapsed";
  document.body.classList.toggle(className);
  requestAnimationFrame(fitToView);
}

function toggleSnap() {
  snapToGrid = !snapToGrid;
  updateSnapUi();
}

function updateSnapUi() {
  els.snapToggleBtn.classList.toggle("active", snapToGrid);
  els.snapToggleBtn.classList.toggle("dim", !snapToGrid);
  els.snapToggleBtn.setAttribute("aria-pressed", String(snapToGrid));
  els.snapStateText.textContent = snapToGrid ? "啟用" : "關閉";
}

function updateArrowButtons(activeButton) {
  els.arrowGrid.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button === activeButton));
}

function updateLineModeUi() {
  els.lineModeHint.textContent = lineMode
    ? pendingLineSource
      ? "已選第一個圖框，請點第二個圖框。"
      : "連線工具已啟用：請先點來源圖框。"
    : "目前未啟用連線工具。";
  if (!lineMode) {
    els.arrowGrid.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
  }
}

function setAnalysisStatus(primary, secondary) {
  if (primary) showToast(secondary ? `${primary}：${secondary}` : primary);
}

function exportSvg() {
  openExportDialog("svg", "export");
}

function exportPng() {
  openExportDialog("png", "export");
}

function exportJson() {
  openExportDialog("json", "export");
}

function openExportDialog(format = "json", mode = "export") {
  pendingExportMode = mode;
  if (els.exportDialog.open) closeExportDialog();
  els.exportDialogTitle.textContent = mode === "draft" ? "儲存草稿" : "匯出圖稿";
  els.exportFormatInput.value = format;
  els.exportFilenameInput.value = baseFileName();
  els.exportDialogNote.textContent = mode === "draft"
    ? "JSON 草稿可以之後重新匯入編輯；支援時會開啟系統儲存視窗。"
    : "可改選 SVG、PNG 或 JSON；支援時會開啟系統儲存視窗。";
  if (typeof els.exportDialog.showModal === "function") {
    els.exportDialog.showModal();
  } else {
    els.exportDialog.setAttribute("open", "");
  }
  els.exportFilenameInput.focus();
  els.exportFilenameInput.select();
}

function closeExportDialog() {
  els.exportDialog.close?.();
  els.exportDialog.removeAttribute("open");
}

async function confirmExport() {
  const format = els.exportFormatInput.value;
  const filename = ensureExtension(els.exportFilenameInput.value || baseFileName(), format);
  els.confirmExportBtn.disabled = true;
  els.confirmExportBtn.textContent = "選擇位置...";
  try {
    const target = await chooseSaveTarget(filename, format);
    if (target.kind === "cancelled") return;
    els.confirmExportBtn.textContent = "準備中...";
    const blob = await buildExportBlob(format);
    const result = await writeSaveTarget(target, blob, filename);
    saveLocal(false);
    closeExportDialog();
    showToast(result === "picker" ? "已儲存到指定位置。" : "瀏覽器已開始下載。");
  } catch (error) {
    console.error(error);
    showToast("儲存失敗，請改用其他格式。");
  } finally {
    els.confirmExportBtn.disabled = false;
    els.confirmExportBtn.textContent = "選擇位置並儲存";
  }
}

async function buildExportBlob(format) {
  if (format === "json") {
    return new Blob([JSON.stringify(state, null, 2)], { type: "application/json;charset=utf-8" });
  }
  if (format === "svg") {
    return new Blob([serializedSvg()], { type: "image/svg+xml;charset=utf-8" });
  }
  return buildPngBlob();
}

function serializedSvg() {
  const clone = els.diagramCanvas.cloneNode(true);
  clone.removeAttribute("style");
  clone.setAttribute("xmlns", svgNS);
  clone.querySelectorAll(".edit-only").forEach((element) => element.remove());
  clone.querySelectorAll("[data-edge-line]").forEach((element) => {
    element.setAttribute("stroke", "var(--svg-ink)");
    element.setAttribute("stroke-width", "2");
  });
  inlineSvgVars(clone);
  return new XMLSerializer().serializeToString(clone);
}

function inlineSvgVars(root) {
  const computed = getComputedStyle(document.body);
  const replacements = {
    "var(--canvas)": computed.getPropertyValue("--canvas").trim() || "#fff",
    "var(--grid)": computed.getPropertyValue("--grid").trim() || "#eef0ef",
    "var(--svg-ink)": computed.getPropertyValue("--svg-ink").trim() || "#171a1c",
    "var(--svg-muted)": computed.getPropertyValue("--svg-muted").trim() || "#58636c",
    "var(--panel-border)": computed.getPropertyValue("--panel-border").trim() || "#ccd6df",
  };
  root.querySelectorAll("*").forEach((el) => {
    ["fill", "stroke"].forEach((attr) => {
      const value = el.getAttribute(attr);
      if (!value) return;
      el.setAttribute(attr, replacements[value] || value);
    });
  });
}

function buildPngBlob() {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([serializedSvg()], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = state.canvas.width * 2;
      canvas.height = state.canvas.height * 2;
      const context = canvas.getContext("2d");
      context.fillStyle = getComputedStyle(document.body).getPropertyValue("--canvas").trim() || "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        blob ? resolve(blob) : reject(new Error("PNG export failed"));
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG image load failed"));
    };
    image.src = url;
  });
}

async function chooseSaveTarget(filename, format) {
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [filePickerType(format)],
      });
      return { kind: "picker", handle };
    } catch (error) {
      if (error?.name === "AbortError") return { kind: "cancelled" };
      console.warn("Native save picker failed, falling back to download.", error);
    }
  }
  return { kind: "download" };
}

async function writeSaveTarget(target, blob, filename) {
  if (target.kind === "picker") {
    try {
      const writable = await target.handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return "picker";
    } catch (error) {
      console.warn("Native write failed, falling back to download.", error);
    }
  }
  downloadBlob(blob, filename);
  return "download";
}

function importJson(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      state = normalizeState(JSON.parse(reader.result));
      setDiagramType(state.diagramType, false);
      selected = { kind: null, id: null };
      render();
    } catch (error) {
      showToast("JSON 格式無法讀取。");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function saveLocal(showMessage = true) {
  localStorage.setItem("research-canvas-state", JSON.stringify(state));
  localStorage.setItem("research-canvas-input", els.researchInput.value);
  localStorage.setItem("research-canvas-version", storageVersion);
  if (showMessage) showToast("已儲存到此瀏覽器。");
}

function normalizeState(input) {
  return {
    diagramType: input.diagramType || "flowchart",
    title: input.title || "學術研究的 AI 畫布",
    subtitle: input.subtitle || "",
    canvas: input.canvas || { width: 1400, height: 1800 },
    nodes: Array.isArray(input.nodes) ? input.nodes.map(normalizeNode) : [],
    edges: Array.isArray(input.edges) ? input.edges.map(normalizeEdge) : [],
    legend: input.legend && typeof input.legend === "object" ? input.legend : {},
    flow: input.flow || "",
    suggestions: Array.isArray(input.suggestions) ? input.suggestions.slice(0, 3) : [],
  };
}

function normalizeNode(node, index) {
  return {
    id: node.id || `node-${Date.now()}-${index}`,
    number: Number(node.number || index + 1),
    title: node.title || "圖框",
    body: node.body || "",
    shape: node.shape || "rounded",
    palette: node.palette || "process",
    x: Number(node.x || 420),
    y: Number(node.y || 240 + index * 140),
    w: Number(node.w || 320),
    h: Number(node.h || 110),
  };
}

function normalizeEdge(edge) {
  return {
    id: edge.id || `edge-${edge.from}-${edge.to}-${Date.now()}`,
    from: edge.from,
    to: edge.to,
    label: edge.label || "",
    line: edge.line || "curved",
    style: edge.style || "solid",
    arrow: edge.arrow || "end",
    fromAnchor: normalizeAnchor(edge.fromAnchor),
    toAnchor: normalizeAnchor(edge.toAnchor),
  };
}

function normalizeAnchor(anchor) {
  if (!anchor || typeof anchor !== "object") return null;
  return {
    x: clamp(Number(anchor.x ?? 0.5), 0, 1),
    y: clamp(Number(anchor.y ?? 0.5), 0, 1),
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
  return text.split(/[。.!?？]\s*/).map(compact).filter((item) => item.length >= 6).slice(0, 8);
}

function inferTitle(lines) {
  for (const line of lines.slice(0, 6)) {
    if (line.length <= 44 && !detectSection(line).key) return stripBullet(line);
  }
  return "學術研究圖";
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

function summarize(items, fallback) {
  const clean = uniqueClean(items);
  if (!clean.length) return fallback;
  if (clean.length <= 3) return clean.join("；");
  return `${clean.slice(0, 3).join("；")}；另 ${clean.length - 3} 項`;
}

function anchorPoint(node, target) {
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const tx = target.x + target.w / 2;
  const ty = target.y + target.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (Math.abs(dx) > Math.abs(dy)) return { x: dx > 0 ? node.x + node.w : node.x, y: cy };
  return { x: cx, y: dy > 0 ? node.y + node.h : node.y };
}

function edgeAnchorPoint(node, anchor) {
  if (!anchor) return null;
  return {
    x: node.x + node.w * clamp(anchor.x, 0, 1),
    y: node.y + node.h * clamp(anchor.y, 0, 1),
  };
}

function pointToBoundaryAnchor(node, point) {
  const localX = clamp((point.x - node.x) / node.w, 0, 1);
  const localY = clamp((point.y - node.y) / node.h, 0, 1);
  const distances = [
    ["left", localX],
    ["right", 1 - localX],
    ["top", localY],
    ["bottom", 1 - localY],
  ];
  const side = distances.sort((a, b) => a[1] - b[1])[0][0];
  if (side === "left") return { x: 0, y: localY };
  if (side === "right") return { x: 1, y: localY };
  if (side === "top") return { x: localX, y: 0 };
  return { x: localX, y: 1 };
}

function edgePath(start, end, line) {
  if (line === "straight") return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  if (line === "elbow") {
    const midY = start.y + (end.y - start.y) / 2;
    return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
  }
  const vertical = Math.abs(start.y - end.y) > Math.abs(start.x - end.x);
  if (vertical) {
    const middle = start.y + (end.y - start.y) / 2;
    return `M ${start.x} ${start.y} C ${start.x} ${middle}, ${end.x} ${middle}, ${end.x} ${end.y}`;
  }
  const middle = start.x + (end.x - start.x) / 2;
  return `M ${start.x} ${start.y} C ${middle} ${start.y}, ${middle} ${end.y}, ${end.x} ${end.y}`;
}

function dashArray(style) {
  if (style === "dashed") return "8 7";
  if (style === "dotted") return "2 7";
  if (style === "feedback") return "5 6";
  return "0";
}

function clientToSvg(clientX, clientY) {
  const rect = els.diagramCanvas.getBoundingClientRect();
  return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
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
    fill: attrs.fill || "var(--svg-ink)",
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
    const tspan = svgEl("tspan", { x, dy: index === 0 ? 0 : fontSize * 1.24 });
    tspan.textContent = line;
    textEl.appendChild(tspan);
  });
  parent.appendChild(textEl);
}

function wrapText(text, maxChars, maxLines) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (!normalized) return [""];
  const tokens = /\s/.test(normalized) ? normalized.split(" ") : Array.from(normalized);
  const lines = [];
  let line = "";
  tokens.forEach((token) => {
    const next = /\s/.test(normalized) ? (line ? `${line} ${token}` : token) : line + token;
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

function stripBullet(line) {
  return compact(line).replace(/^[-*•]\s*/, "").replace(/^\(?[0-9一二三四五六七八九十]+\)?[.、)]\s*/, "").trim();
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function snap(value) {
  return Math.round(value / 20) * 20;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function baseFileName() {
  const title = compact(state.title || "academic-research-ai-canvas")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 56);
  return title || "academic-research-ai-canvas";
}

function ensureExtension(filename, format) {
  const clean = filename.replace(/\.[a-z0-9]+$/i, "");
  return `${clean}.${format}`;
}

function filePickerType(format) {
  if (format === "svg") {
    return { description: "SVG 向量圖", accept: { "image/svg+xml": [".svg"] } };
  }
  if (format === "png") {
    return { description: "PNG 圖片", accept: { "image/png": [".png"] } };
  }
  return { description: "JSON 可編輯草稿", accept: { "application/json": [".json"] } };
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

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.remove(), 2200);
}
