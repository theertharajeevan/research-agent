from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.pipeline import build_pipeline, ResearchState

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
pipeline = build_pipeline()
session_memory = []

class QueryRequest(BaseModel):
    query : str

@app.post("/research")
async def research(req: QueryRequest):
    state: ResearchState = {
        "query": req.query,
        "sub_questions" : [],
        "raw_results" : [],
        "summary" : "",
        "final_report" : "",
        "memory" : session_memory.copy()
    }
    result = pipeline.invoke(state)
    session_memory.extend(result["memory"][-1:])
    return {"report": result["final_report"]}

@app.delete("/memory")
async def clear_memory():
    session_memory.clear()
    return {"status": "cleared"}
