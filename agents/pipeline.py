from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from tavily import TavilyClient
from typing import TypedDict, List
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"))
tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))


class ResearchState(TypedDict):
    query: str
    sub_questions : List[str]
    raw_results : List[str]
    summary : str
    final_report : str
    memory : List[str]

def planner(state: ResearchState) -> ResearchState:
    prompt = f"""Break this research question into 3 focused sub-questions:
Question: {state['query']}
Return only a numbered list."""
    response = llm.invoke(prompt)
    lines = [l.strip() for l in response.content.split('\n') if l.strip()]
    state['sub_questions'] = lines[:3]
    return state


def researcher(state: ResearchState) -> ResearchState:
    results = []
    for q in state['sub_questions']:
        r = tavily.search(q, max_results=3)
        for item in r['results']:
            results.append(f"source: {item['url']}\n{item['content']}")
        state['raw_results'] = results
        return state
    
def summarizer(state: ResearchState) -> ResearchState:
    combined = "\n\n---\n\n".join(state['raw_results'][:6])
    prompt = f"""Summarize these research results clearly and concisely.
Remove duplicates. Keep jey facts and sources.

{combined}"""
    response = llm.invoke(prompt)
    state['summary'] = response.content
    return state


def writer(state: ResearchState) -> ResearchState:
    memory_content = "\n".join(state.get('memory', []))
    prompt = f"""Write a well-structured research report answering: {state['query']}
 
Previous content (if any): {memory_content}

Research summary:
{state['summary']}

Format with: Executive Summary, Key Findings, Sources, Conclusion."""
    response = llm.invoke(prompt)
    state['final_report'] = response.content
    state['memory'] = state.get('memory', []) + [
        f"Q: {state['query']}\nA summary: {state['summary'][:200]}"
    ]
    return state


def build_pipeline():
    graph = StateGraph(ResearchState)
    graph.add_node("planner", planner)
    graph.add_node("researcher", researcher)
    graph.add_node("summarizer", summarizer)
    graph.add_node("writer", writer)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "researcher")
    graph.add_edge("researcher", "summarizer")
    graph.add_edge("summarizer", "writer")
    graph.add_edge("writer", END)

    return graph.compile()