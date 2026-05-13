# 學術研究的 AI 畫布

這是一個可部署成靜態網站的學術研究繪圖工具。使用者貼上研究流程、研究架構或整篇文章後，先選擇圖表類型，再選擇「快速本地」或「深度大模型」模式產生可編輯 SVG 畫布。

## 線上部署

本專案可直接透過 GitHub Pages 部署 repo 根目錄。部署後不需要 Python，也能使用：

- 本地即時解析
- 深度大模型解析：GitHub Pages 可直接嘗試 Pollinations 免金鑰 API；本機可走 Python 後端代理
- 可拖曳整個畫布與個別圖框
- 手動新增線條與箭頭
- 側欄邊緣收合
- 圖表類型選擇
- 圖框形狀模組
- 深色／正常模式
- 匯出 SVG / PNG / JSON

## 本地啟動

```bash
cd "/Users/craig/Library/CloudStorage/GoogleDrive-craigpop.tw@gmail.com/我的雲端硬碟/010-Codex GPT/014-博論蒐集文獻區/research-architecture-canvas"
python3 server.py
```

瀏覽器開啟：

```text
http://127.0.0.1:8765
```

也可以直接開 `index.html`，但 Python API 補強會自動略過。

## 主要功能

- 文字輸入框：貼上研究主題、資料來源、研究架構、研究流程、方法、核心分析與研究輸出。
- 圖表類型：流程圖、研究架構圖、方法流程圖、因果模型圖、文獻矩陣圖、時間軸圖、分層架構圖、關係網絡圖。
- 圖框模組：處理矩形、起訖圓角、判斷菱形、圓形節點、概念橢圓、三角提醒、方法六角、資料輸入、文件框。
- 箭頭模組：單向曲線、單向直線、折線箭頭、虛線關聯、雙向回饋、註記線。
- 直接編輯：雙擊圖框可直接在畫布中修改文字；底部 Flow 也可雙擊編輯。
- 畫布控制：拖曳空白畫布可平移；支援縮放、擴大畫布、縮小畫布、重置畫布。
- 自動排列：依目前圖表類型自動重新排版，並支援吸附網格。
- AI 模式：快速本地模式不會送出文字；深度大模型模式會把文字送到本機後端或 Pollinations API 分析。
- Python 協同分析：本地 `server.py` 可作為代理，支援 Pollinations 與 OpenAI-compatible endpoint。
- 線上協同 AI：GitHub Pages 上會優先使用 Pollinations 免金鑰 OpenAI-compatible API；若 API 失敗，會自動退回本地模式。
- 匯出匯入：支援 SVG、PNG、JSON。
- 草稿保存：使用瀏覽器 localStorage。

## AI 模式與 API 來源

前端提供兩種模式：

1. 快速本地：只用瀏覽器內建規則分析，不會送出文字，速度最快，但不適合整篇文章。
2. 深度大模型：支援整篇文章，會先分段摘要，再由大模型輸出節點、線條、圖例與排版 JSON。

目前已接入：

- Pollinations OpenAI-compatible API：`https://text.pollinations.ai/openai`，基本使用可免 API key。
- 自訂 OpenAI-compatible 後端：設定 `RESEARCH_CANVAS_LLM_URL`、`RESEARCH_CANVAS_LLM_API_KEY`、`RESEARCH_CANVAS_LLM_MODEL`。例如可接 OpenRouter free router 或其他相容服務。

注意：深度大模型模式會把研究文字送到外部 API。正式論文、未公開資料、訪談逐字稿或敏感資料，建議改用本機後端並接自己的 API key，不要直接送公共免金鑰服務。

## Python 後端 API

本地開發時可呼叫：

```text
POST /api/analyze
```

請求：

```json
{
  "mode": "deep",
  "diagramType": "framework",
  "text": "研究主題與流程文字"
}
```

回應會包含可直接繪圖的 `diagram` JSON。

可選環境變數：

```bash
export RESEARCH_CANVAS_LLM_URL="https://openrouter.ai/api/v1"
export RESEARCH_CANVAS_LLM_API_KEY="你的 API key"
export RESEARCH_CANVAS_LLM_MODEL="openrouter/free"
python3 server.py
```
