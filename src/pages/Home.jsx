import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup"; // ✅ generic popup

export default function Home() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [uid, setUid] = useState("");
  const [err, setErr] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

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
    // Simulate sending OTP
    sendOtp();
    setShowOtpPopup(true);
  };

  const sendOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    console.log("OTP sent:", generatedOtp);
    setOtpSent(true);
    setResendMessage("A 6-digit OTP has been sent to your registered contact.");
  };

  const handleResend = () => {
    sendOtp();
    setOtp("");
    setResendMessage("A new OTP has been sent!");
    setTimeout(() => setResendMessage(""), 2000);
  };

  const verifyOtp = () => {
    const otpPattern = /^[0-9]{6}$/;
    if (otpPattern.test(otp)) {
      const s = localStorage.getItem(`formStage-${uid}`);
      nav(`/form?userId=${uid}&stage=${s}`);
    } else {
      alert("Invalid OTP. Please enter a valid 6-digit number.");
    }
  };

  const isOtpValid = /^[0-9]{6}$/.test(otp);

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

      {/* ✅ OTP Popup */}
      {showOtpPopup && (
        <Popup
          title="Verify OTP"
          message="Please enter the OTP sent to your registered contact."
          confirmText="Verify"
          cancelText="Cancel"
          onCancel={() => {
            setShowOtpPopup(false);
            setOtp("");
          }}
          onConfirm={verifyOtp}
        >
          <input
            className="input"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={{
              textAlign: "center",
              fontSize: "18px",
              letterSpacing: "2px",
            }}
          />

          <div style={{ marginTop: 8, textAlign: "center" }}>
            <button
              className="button ghost"
              style={{
                padding: "4px 10px",
                fontSize: "13px",
              }}
              onClick={handleResend}
            >
              Resend OTP
            </button>
            {resendMessage && (
              <div style={{ color: "green", fontSize: "12px", marginTop: 4 }}>
                {resendMessage}
              </div>
            )}
          </div>

          {/* ✅ Greyed Verify Button Logic */}
          <style>
            {`
              .popup-buttons .button.primary {
                background-color: ${isOtpValid ? "#007bff" : "#b0b0b0"};
                border-color: ${isOtpValid ? "#007bff" : "#b0b0b0"};
                color: white;
                cursor: ${isOtpValid ? "pointer" : "not-allowed"};
              }
            `}
          </style>
        </Popup>
      )}
    </div>
  );
}
