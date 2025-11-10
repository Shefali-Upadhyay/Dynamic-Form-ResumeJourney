import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formConfig } from "../utils/formConfig";
import { reset } from "../redux/formSlice";

export default function Review() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const nav = useNavigate();
  const dispatch = useDispatch();
  const values = useSelector((s) => s.form.values);

  const groups = [
    "basicDetails",
    "personalDetails",
    "selfieStage",
    "taxInformation",
    "employementInformation",
  ];

  const handleSubmit = () => {
    console.log("Final submission:", values);
    localStorage.removeItem(`formData-${userId}`);
    localStorage.removeItem(`formStage-${userId}`);
    dispatch(reset());
    nav("/");
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h2>Review</h2>
        </div>
        {groups.map((g) => {
          const fields = formConfig.filter((f) => f.stageId === g);
          return (
            <div
              key={g}
              style={{
                border: "1px solid #eee",
                padding: 12,
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ textTransform: "capitalize" }}>{g}</strong>
                <button
                  className="button ghost"
                  onClick={() => nav(`/form?userId=${userId}&stage=${g}`)}
                >
                  Edit
                </button>
              </div>
              <div style={{ marginTop: 8 }}>
                {fields.map((f) => {
                  const saved = JSON.parse(
                    localStorage.getItem(`formData-${userId}`) || "{}",
                  );
                  const val = saved[f.id] || values[f.id];
                  return (
                    <div key={f.id} style={{ marginBottom: 6 }}>
                      <strong>{f.label}:</strong>{" "}
                      {typeof val === "string" &&
                      val.startsWith("data:image") ? (
                        <img src={val} alt={f.label} style={{ width: 120 }} />
                      ) : (
                        val || "-"
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
