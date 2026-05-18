import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import "./ResumePage.css";

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(f.type)) {
      setError("Only PDF or .txt files are supported.");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let content = "";

      if (file.type === "application/pdf") {
        const base64 = await toBase64(file);
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "document",
                    source: { type: "base64", media_type: "application/pdf", data: base64 },
                  },
                  { type: "text", text: PROMPT },
                ],
              },
            ],
          }),
        });
        const data = await response.json();
        content = data.content?.map((b) => b.text || "").join("") || "";
      } else {
        const text = await file.text();
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: `${PROMPT}\n\nResume:\n${text}` }],
          }),
        });
        const data = await response.json();
        content = data.content?.map((b) => b.text || "").join("") || "";
      }

      const clean = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="rp-page">
        <div className="rp-inner">

          <div className="rp-header">
            <h1 className="rp-title">Resume <em>Analyzer</em></h1>
            <p className="rp-sub">Upload your resume and get instant AI-powered feedback.</p>
          </div>

          <div
            className={`rp-dropzone ${dragging ? "rp-dropzone--active" : ""} ${file ? "rp-dropzone--filled" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="rp-file-info">
                <span className="rp-file-icon">📄</span>
                <span className="rp-file-name">{file.name}</span>
                <span className="rp-file-size">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="rp-drop-inner">
                <span className="rp-drop-icon">⬆️</span>
                <p className="rp-drop-text">Drop your resume here or <span>browse</span></p>
                <p className="rp-drop-hint">PDF or TXT · Max 5MB</p>
              </div>
            )}
          </div>

          {error && <p className="rp-error">{error}</p>}

          <button
            className="rp-btn"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? <span className="rp-spinner" /> : "Analyze Resume →"}
          </button>

          {result && (
            <div className="rp-results">
              <div className="rp-score-card">
                <div className="rp-score-ring" style={{ "--score": result.score }}>
                  <span className="rp-score-num">{result.score}</span>
                  <span className="rp-score-label">/ 100</span>
                </div>
                <div>
                  <h2 className="rp-score-title">{getScoreLabel(result.score)}</h2>
                  <p className="rp-score-sub">{result.summary}</p>
                </div>
              </div>

              <div className="rp-grid">
                <section className="rp-section">
                  <h3 className="rp-section-title">✅ Strengths</h3>
                  <ul className="rp-list rp-list--good">
                    {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </section>
                <section className="rp-section">
                  <h3 className="rp-section-title">⚠️ Issues Found</h3>
                  <ul className="rp-list rp-list--bad">
                    {result.issues.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </section>
              </div>

              <section className="rp-section">
                <h3 className="rp-section-title">🚀 Improvements</h3>
                <div className="rp-improvements">
                  {result.improvements.map((item, i) => (
                    <div key={i} className="rp-improvement-card">
                      <span className="rp-improvement-tag">{item.category}</span>
                      <p>{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rp-section">
                <h3 className="rp-section-title">🔑 Missing Keywords</h3>
                <div className="rp-keywords">
                  {result.missingKeywords.map((k, i) => (
                    <span key={i} className="rp-keyword">{k}</span>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

const PROMPT = `You are an expert resume reviewer. Analyze the resume and respond ONLY with a JSON object, no markdown, no explanation, just raw JSON.

{
  "score": <number 0-100>,
  "summary": "<one sentence overall verdict>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "issues": ["<issue 1>", "<issue 2>", "<issue 3>"],
  "improvements": [
    { "category": "<e.g. Action Verbs>", "suggestion": "<specific fix>" },
    { "category": "<e.g. Quantification>", "suggestion": "<specific fix>" },
    { "category": "<e.g. Formatting>", "suggestion": "<specific fix>" }
  ],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

function getScoreLabel(score) {
  if (score >= 80) return "Strong Resume 💪";
  if (score >= 60) return "Needs Polish ✨";
  if (score >= 40) return "Needs Work 🔧";
  return "Major Revision Needed 🚨";
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}