# 🔍 Multi-Agent Research Assistant

An autonomous AI agent system where multiple specialized agents collaborate to research any topic and deliver a structured report — automatically.

> Type a question → Get a full research report with sources in under 60 seconds.

---

## 🤖 How It Works

| Step | Agent | Action |
|------|-------|--------|
| 1 | 🧠 Planner | Breaks your query into 3 focused sub-questions |
| 2 | 🌐 Researcher | Searches the web via Tavily API for each sub-question |
| 3 | 📝 Summarizer | Condenses raw results, removes duplicates |
| 4 | ✍️ Writer | Compiles a structured report with sources |
| 5 | 📄 Final Report | Executive Summary · Key Findings · Sources · Conclusion |

---

## ✨ Features

- **Multi-agent pipeline** orchestrated with LangGraph
- **Real-time web search** via Tavily API
- **Structured reports** with Executive Summary, Key Findings, Sources, and Conclusion
- **Memory layer** for follow-up questions in the same session
- **React frontend** with dark theme, animated progress, clickable source pills
- **FastAPI backend** with auto-generated API docs at `/docs`
- **Fully Dockerized** — runs with a single command

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Agent Orchestration | LangGraph |
| LLM | Groq (LLaMA 3.3) |
| Web Search | Tavily API |
| Backend | FastAPI + Uvicorn |
| Frontend | React + Axios |
| Containerization | Docker + Docker Compose |

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/theertharajeevan/multi-agent-research-assistant.git
cd multi-agent-research-assistant

# 2. Add your API keys
cp .env.example .env
# Edit .env and add your real keys

# 3. Run everything
docker-compose up --build
```

- Frontend → http://localhost:3000
- Backend API docs → http://localhost:8000/docs

### Option 2 — Run Locally

```bash
# Terminal 1 — Backend
pip install -r requirements.txt
uvicorn backend.main:app --reload

# Terminal 2 — Frontend
cd frontend-react
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_key_here
TAVILY_API_KEY=your_tavily_key_here
```

Get your keys:
- Groq API → https://console.groq.com (free)
- Tavily API → https://tavily.com (free tier: 1000 searches/month)

---

## 📁 Project Structure

```
research-agent/
├── agents/
│   ├── __init__.py
│   └── pipeline.py        # All 4 agents + LangGraph state graph
├── backend/
│   ├── __init__.py
│   └── main.py            # FastAPI routes
├── frontend-react/
│   ├── src/
│   │   ├── App.js         # React UI
│   │   └── App.css        # Styles
│   ├── Dockerfile
│   └── nginx.conf
├── Dockerfile.backend
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/research` | Run the full agent pipeline |
| DELETE | `/memory` | Clear session memory |
| GET | `/docs` | Auto-generated API documentation |

### Example Request

```bash
curl -X POST http://localhost:8000/research \
  -H "Content-Type: application/json" \
  -d '{"query": "What is quantum computing?"}'
```

---

## 🧠 Agent Architecture

Each agent is a pure Python function that reads from and writes to a shared `ResearchState` TypedDict, passed through LangGraph's state graph:

```python
class ResearchState(TypedDict):
    query: str
    sub_questions: List[str]
    raw_results: List[str]
    summary: str
    final_report: str
    memory: List[str]
```

---

## 📄 License

MIT License — feel free to use, modify, and share.

---

## 🙋‍♀️ Author

**Theertha Rajeevan**
- GitHub: [@theertharajeevan](https://github.com/theertharajeevan)
