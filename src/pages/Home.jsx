import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [uid, setUid] = useState("");
  const [err, setErr] = useState("");

  const start = () => {
    const id =
      "USER-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    nav(`/form?userId=${id}&stage=basicDetails`);
  };
  const resume = () => {
    if (!uid.trim()) {
      setErr("Enter User ID");
      return;
    }
    const s = localStorage.getItem(`formStage-${uid}`);
    const d = localStorage.getItem(`formData-${uid}`);
    if (!s || !d) {
      setErr("No saved journey for this ID");
      return;
    }
    nav(`/form?userId=${uid}&stage=${s}`);
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h2>Dynamic Form - POC</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="button primary" onClick={start}>
            New Form
          </button>
          <button className="button ghost" onClick={() => setShow((s) => !s)}>
            Resume Journey
          </button>
        </div>
        {show && (
          <div style={{ marginTop: 12 }}>
            <input
              className="input"
              placeholder="Enter User ID"
              value={uid}
              onChange={(e) => {
                setUid(e.target.value);
                setErr("");
              }}
            />
            <div style={{ marginTop: 8 }}>
              <button className="button primary" onClick={resume}>
                Continue
              </button>
            </div>
            {err && (
              <div className="error" style={{ marginTop: 8 }}>
                {err}
              </div>
            )}
          </div>
        )}
        <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>
          Save your User ID to resume later.
        </div>
      </div>
    </div>
  );
}
