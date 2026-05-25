import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState("");

  const steps = [
    { icon: "🧠", name: "Planner", desc: "Breaking your question into sub-questions..." },
    { icon: "🌐", name: "Researcher", desc: "Searching the web for sources..." },
    { icon: "📝", name: "Summarizer", desc: "Condensing and cleaning results..." },
    { icon: "✍️", name: "Writer", desc: "Compiling your final report..." },
  ];

  const runResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(`${steps[i].icon} ${steps[i].name}: ${steps[i].desc}`);
      await new Promise((r) => setTimeout(r, 500));
    }
    setCurrentStep("⏳ Agents working... this takes 30–60 seconds");

    try {
      const res = await axios.post(`${API}/research`, { query });
      setHistory((prev) => [{ query, report: res.data.report }, ...prev]);
      setCurrentStep("");
    } catch (err) {
      setError("❌ Could not connect to backend. Make sure uvicorn is running on port 8000.");
      setCurrentStep("");
    }
    setLoading(false);
  };

  const clearMemory = async () => {
    try { await axios.delete(`${API}/memory`); } catch {}
    setHistory([]);
  };

  const extractUrls = (text) => {
    const urls = [...new Set(text.match(/https?:\/\/[^\s\)\]\*,]+/g) || [])];
    return urls;
  };

  const getDomain = (url) => {
    try { return new URL(url).hostname; } catch { return url; }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🔍</span>
            <div>
              <h1>Multi-Agent Research Assistant</h1>
              <p className="subtitle">Powered by Claude + Tavily · Planner → Researcher → Summarizer → Writer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Search bar */}
        <div className="search-card">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="e.g. What are the latest breakthroughs in fusion energy?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && runResearch()}
              disabled={loading}
            />
            <button className="btn-primary" onClick={runResearch} disabled={loading}>
              {loading ? "Researching..." : "🔍 Research"}
            </button>
            <button className="btn-secondary" onClick={clearMemory} disabled={loading}>
              🗑️ Clear memory
            </button>
          </div>

          {/* Progress */}
          {loading && (
            <div className="progress-box">
              <div className="progress-steps">
                {steps.map((s, i) => (
                  <div key={i} className="step">
                    <span className="step-icon">{s.icon}</span>
                    <span className="step-name">{s.name}</span>
                  </div>
                ))}
              </div>
              <div className="status-text">{currentStep}</div>
              <div className="progress-bar"><div className="progress-fill" /></div>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}
        </div>

        {/* Results */}
        {history.map((item, i) => {
          const urls = extractUrls(item.report);
          return (
            <div key={i} className="result-card">
              <div className="result-header">
                <span className="result-icon">📄</span>
                <h2 className="result-query">Q: {item.query}</h2>
              </div>

              {urls.length > 0 && (
                <div className="sources-section">
                  <span className="sources-label">🔗 Sources</span>
                  <div className="sources-list">
                    {urls.map((url, j) => (
                      <a key={j} href={url} target="_blank" rel="noreferrer" className="source-pill">
                        {getDomain(url)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="report-body">
                <ReactMarkdown>{item.report}</ReactMarkdown>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;