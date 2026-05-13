# 研究架構圖 AI 畫布

這是一個可部署成靜態網站的研究架構圖生成與編輯工具。使用者貼上研究流程或研究架構文字後，瀏覽器會先用本地分析引擎即時產生可編輯 SVG 畫布；Python 後端與線上 AI API 都只是選配補強，不會阻塞出圖。

## 線上部署

本專案可直接透過 GitHub Pages 部署 repo 根目錄。部署後不需要 Python，也能使用：

- 本地即時解析
- 可拖曳模組
- 手動新增線條
- 側欄收合
- 模板套用
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

- 研究文字即時解析：瀏覽器端先出圖，不再等待後端。
- Python 協同分析：本地 `server.py` 可作為補強 API。
- 線上協同 AI：支援 OpenAI-compatible endpoint，例如 Pollinations 或 Hugging Face Router。請只使用可放在前端的 publishable token，不要貼 secret key。
- 手動線條連接：開啟「新增線條」後，依序點兩個模組即可建立連線。
- 線條樣式編輯：點選線條可修改標籤、實線、虛線或回饋線。
- 側邊欄收合：左右欄都可收合，方便檢視大圖。
- 模組分類：研究問題、資料來源、研究架構、研究流程、理論架構、研究方法、核心分析、檢核機制、研究輸出、限制說明、參考文獻、補充分析。
- 功能模板：博士論文研究設計、期刊論文方法架構、政策分析流程、文獻綜述流程。
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
