import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAll, reset } from "../redux/formSlice";
import Stage from "../components/Stage";
import { formConfig } from "../utils/formConfig";
import { saveData, saveStage, loadData, loadStage } from "../utils/storage";
import Popup from "../components/Popup"; // ✅ added import

const STAGE_ORDER = [
  "basicDetails",
  "personalDetails",
  "selfieStage",
  "taxInformation",
  "employementInformation",
  "review",
];

export default function DynamicForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  let userId = params.get("userId");
  const stageParam = params.get("stage");

  const values = useSelector((s) => s.form.values);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [showQuitPopup, setShowQuitPopup] = useState(false);

  const formatTitle = (str) =>
    str
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Initialize data & stage
  useEffect(() => {
    if (!userId) {
      userId =
        "USER-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      params.set("userId", userId);
      params.set("stage", "basicDetails");
      navigate({ search: params.toString() }, { replace: true });
    }
    const savedData = loadData(userId);
    if (savedData && Object.keys(savedData).length) dispatch(setAll(savedData));

    const savedStage = stageParam || loadStage(userId);
    if (savedStage) {
      const idx = STAGE_ORDER.indexOf(savedStage);
      if (idx !== -1) setCurrentStageIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prepare stages
  const stages = useMemo(
    () =>
      STAGE_ORDER.map((id) => ({
        id,
        fields: formConfig.filter((f) => f.stageId === id),
      })),
    [],
  );

  // Save data & stage on changes
  useEffect(() => {
    if (!userId) return;
    const stageId = stages[currentStageIndex].id;
    saveStage(userId, stageId);
    saveData(userId, values);
    const p = new URLSearchParams(location.search);
    p.set("userId", userId);
    p.set("stage", stageId);
    navigate({ search: p.toString() }, { replace: true });
  }, [currentStageIndex, userId, navigate, stages, values, location.search]);

  // Per-field validation
  const validateField = (fieldId, value) => {
    const field = formConfig.find((f) => f.id === fieldId);
    if (!field) return null;

    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (field.validation?.pattern && value) {
      try {
        const re = new RegExp(field.validation.pattern);
        if (!re.test(value)) return field.validation.message || "Invalid value";
      } catch (e) {
        console.error("Bad regex:", field.validation.pattern, e);
      }
    }

    if (
      field.minLength &&
      typeof value === "string" &&
      value.trim().length < field.minLength
    ) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    if (
      field.maxLength &&
      typeof value === "string" &&
      value.trim().length > field.maxLength
    ) {
      return `${field.label} must be at most ${field.maxLength} characters`;
    }

    return null;
  };

  const handleFieldChange = (fieldId, value) => {
    dispatch(setAll({ ...values, [fieldId]: value }));
    const error = validateField(fieldId, value);
    setErrors((prev) => ({ ...prev, [fieldId]: error }));
  };

  const validateStage = (index) => {
    const st = stages[index];
    const stageErrors = {};
    for (const f of st.fields) {
      const val = values[f.id];
      const error = validateField(f.id, val);
      if (error) stageErrors[f.id] = error;
    }
    setErrors(stageErrors);
    return Object.keys(stageErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStage(currentStageIndex)) return;
    setCurrentStageIndex((i) => Math.min(i + 1, stages.length - 1));
  };
  const goPrev = () => setCurrentStageIndex((i) => Math.max(i - 1, 0));
  const goToStage = (stageId) => {
    const idx = STAGE_ORDER.indexOf(stageId);
    if (idx !== -1) setCurrentStageIndex(idx);
  };

  const handleQuit = () => setShowQuitPopup(true);
  const confirmQuit = () => {
    setShowQuitPopup(false);
    navigate("/");
  };
  const cancelQuit = () => setShowQuitPopup(false);

  const handleSubmit = () => {
    console.log("Final submission:", values);
    dispatch(reset());
    navigate("/");
  };

  const isReviewStage = stages[currentStageIndex].id === "review";

  const isStageComplete = (index) => {
    const st = stages[index];
    for (const f of st.fields) {
      if (f.required) {
        const val = values[f.id];
        const error = validateField(f.id, val);
        if (!val || error) return false;
      }
    }
    return true;
  };

  const handleNextClick = () => {
    if (!isStageComplete(currentStageIndex)) {
      validateStage(currentStageIndex); // show all missing/invalid field errors
      return;
    }
    goNext();
  };

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <h2>Dynamic Form</h2>
          <button className="top-cross" title="Exit" onClick={handleQuit}>
            ✕
          </button>
        </div>

        <div className="stage-title">
          <strong>{formatTitle(stages[currentStageIndex].id)}</strong>
        </div>

        {isReviewStage ? (
          <div>
            {STAGE_ORDER.slice(0, STAGE_ORDER.length - 1).map((sid) => {
              const group = formConfig.filter((f) => f.stageId === sid);
              const saved = loadData(userId) || {};
              return (
                <div
                  key={sid}
                  style={{
                    border: "1px solid #ddd",
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>{formatTitle(sid)}</strong>
                    <button
                      className="button ghost"
                      onClick={() => goToStage(sid)}
                    >
                      Edit
                    </button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {group.map((f) => {
                      const val = saved[f.id] || values[f.id];
                      return (
                        <div key={f.id} style={{ marginBottom: 6 }}>
                          <strong>{f.label}:</strong>{" "}
                          {typeof val === "string" &&
                          val.startsWith("data:image") ? (
                            <img
                              src={val}
                              alt={f.label}
                              style={{ width: 120 }}
                            />
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
          </div>
        ) : (
          <Stage
            fields={stages[currentStageIndex].fields}
            errors={errors}
            onFieldChange={handleFieldChange}
          />
        )}

        <div
          className="footer-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <div>
            {currentStageIndex > 0 && (
              <button className="button ghost" onClick={goPrev}>
                Back
              </button>
            )}
          </div>
          <div>
            <button
              className={`button ${isStageComplete(currentStageIndex) ? "primary" : "disabled-look"}`}
              style={{
                marginLeft: 8,
                backgroundColor: isStageComplete(currentStageIndex)
                  ? "#007bff"
                  : "#b0b0b0",
                borderColor: isStageComplete(currentStageIndex)
                  ? "#007bff"
                  : "#b0b0b0",
                color: "white",
                cursor: "pointer",
              }}
              onClick={isReviewStage ? handleSubmit : handleNextClick}
            >
              {isReviewStage ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Popup */}
      {showQuitPopup && (
        <Popup
          title="Exit Form?"
          message="Your progress will be saved. Do you want to exit?"
          onConfirm={confirmQuit}
          onCancel={cancelQuit}
          confirmText="Exit"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
