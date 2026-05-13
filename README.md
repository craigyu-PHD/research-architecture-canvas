# 學術研究的 AI 畫布

這是一個可部署成靜態網站的學術研究繪圖工具。使用者貼上研究流程或研究架構文字後，先選擇圖表類型，瀏覽器會用本地分析引擎即時產生可編輯 SVG 畫布；Python 後端與線上 AI API 都只是選配補強，不會阻塞出圖。

## 線上部署

本專案可直接透過 GitHub Pages 部署 repo 根目錄。部署後不需要 Python，也能使用：

- 本地即時解析
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
- Python 協同分析：本地 `server.py` 可作為補強 API。
- 線上協同 AI：支援 OpenAI-compatible endpoint，例如 Pollinations 或 Hugging Face Router。請只使用可放在前端的 publishable token，不要貼 secret key。
- 匯出匯入：支援 SVG、PNG、JSON。
- 草稿保存：使用瀏覽器 localStorage。

## 可選 API 來源

目前前端提供 OpenAI-compatible 設定欄位。使用方式：

1. 打開「協同 AI 設定」。
2. 選擇 Pollinations 或 Hugging Face Router 預設值，或填自訂 Base URL。
3. 填入模型名稱。
4. 填入前端可公開使用的 publishable token。
5. 勾選「啟用線上協同建議」。

注意：線上協同只會補充右側建議；畫布主圖仍由本地引擎即時生成，以避免卡住。

## Python 後端 API

本地開發時可呼叫：

```text
POST /api/analyze
```

請求：

```json
{
  "text": "研究主題與流程文字"
}
```

回應會包含可直接繪圖的 `diagram` JSON。
