\# 🔍 Multi-Agent Research Assistant



An autonomous AI agent system where multiple specialized agents collaborate to research any topic and deliver a structured report — automatically.



> Type a question → Get a full research report with sources in under 60 seconds.



\---



\## 🤖 How It Works



```

User Query

&#x20;   │

&#x20;   ▼

🧠 Planner Agent      → Breaks query into 3 focused sub-questions

&#x20;   │

&#x20;   ▼

🌐 Researcher Agent   → Searches the web via Tavily API for each sub-question

&#x20;   │

&#x20;   ▼

📝 Summarizer Agent   → Condenses raw results, removes duplicates

&#x20;   │

&#x20;   ▼

✍️  Writer Agent       → Compiles a structured report with sources

&#x20;   │

&#x20;   ▼

📄 Final Report       → Executive Summary · Key Findings · Sources · Conclusion

```



\---



\## ✨ Features



\- \*\*Multi-agent pipeline\*\* orchestrated with LangGraph

\- \*\*Real-time web search\*\* via Tavily API

\- \*\*Structured reports\*\* with Executive Summary, Key Findings, Sources, and Conclusion

\- \*\*Memory layer\*\* for follow-up questions in the same session

\- \*\*React frontend\*\* with dark theme, animated progress, clickable source pills

\- \*\*FastAPI backend\*\* with auto-generated API docs at `/docs`

\- \*\*Fully Dockerized\*\* — runs with a single command



\---



\## 🛠️ Tech Stack



| Layer | Technology |

|---|---|

| Agent Orchestration | LangGraph |

| LLM | Claude (Anthropic) |

| Web Search | Tavily API |

| Backend | FastAPI + Uvicorn |

| Frontend | React + Axios |

| Containerization | Docker + Docker Compose |



\---



\## 🚀 Quick Start



\### Option 1 — Docker (Recommended)



```bash

\# 1. Clone the repo

git clone https://github.com/theertharajeevan/multi-agent-research-assistant.git

cd multi-agent-research-assistant



\# 2. Add your API keys

cp .env.example .env

\# Edit .env and add your keys



\# 3. Run everything

docker-compose up --build

```



\- Frontend → http://localhost:3000

\- Backend API docs → http://localhost:8000/docs



\### Option 2 — Run Locally



```bash

\# Terminal 1 — Backend

pip install -r requirements.txt

uvicorn backend.main:app --reload



\# Terminal 2 — Frontend

cd frontend-react

npm install

npm start

```



\---



\## 🔑 Environment Variables



Create a `.env` file in the root directory:



```env

ANTHROPIC\_API\_KEY=your\_anthropic\_key\_here

TAVILY\_API\_KEY=your\_tavily\_key\_here

```



Get your keys:

\- Anthropic API → https://console.anthropic.com

\- Tavily API → https://tavily.com (free tier: 1000 searches/month)



\---



\## 📁 Project Structure



```

research-agent/

├── agents/

│   ├── \_\_init\_\_.py

│   └── pipeline.py        # All 4 agents + LangGraph state graph

├── backend/

│   ├── \_\_init\_\_.py

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



\---



\## 📡 API Endpoints



| Method | Endpoint | Description |

|---|---|---|

| POST | `/research` | Run the full agent pipeline |

| DELETE | `/memory` | Clear session memory |

| GET | `/docs` | Auto-generated API documentation |



\### Example Request



```bash

curl -X POST http://localhost:8000/research \\

&#x20; -H "Content-Type: application/json" \\

&#x20; -d '{"query": "What is quantum computing?"}'

```



\---



\## 🧠 Agent Architecture



Each agent is a pure Python function that reads from and writes to a shared `ResearchState` TypedDict, passed through LangGraph's state graph:



```python

class ResearchState(TypedDict):

&#x20;   query: str

&#x20;   sub\_questions: List\[str]

&#x20;   raw\_results: List\[str]

&#x20;   summary: str

&#x20;   final\_report: str

&#x20;   memory: List\[str]

```



\---



\## 📄 License



MIT License — feel free to use, modify, and share.



\---



\## 🙋‍♀️ Author



\*\*Theertha Rajeevan\*\*

\- GitHub: \[@theertharajeevan](https://github.com/theertharajeevan)

