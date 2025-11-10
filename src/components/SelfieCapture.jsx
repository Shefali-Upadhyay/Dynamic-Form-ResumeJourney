import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../redux/formSlice";

export default function SelfieCapture({ field, error, onFieldChange }) {
  const dispatch = useDispatch();
  const storedValue = useSelector((s) => s.form.values[field.id] || "");

  const [preview, setPreview] = useState(storedValue || null);
  const [cameraError, setCameraError] = useState("");
  const [capturing, setCapturing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => () => stopCamera(), []);

  useEffect(() => {
    if (storedValue) {
      setPreview(storedValue);
      stopCamera();
    }
  }, [storedValue]);

  useEffect(() => {
    if (capturing) initCamera();
  }, [capturing]);

  const updateValue = (val) => {
    dispatch(setField({ id: field.id, value: val }));
    setPreview(val);
    onFieldChange && onFieldChange(field.id, val);
  };

  const initCamera = async () => {
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.onloadedmetadata = async () => {
        try {
          await video.play();
        } catch {
          setTimeout(() => video.play(), 200);
        }
      };
    } catch (err) {
      console.error(err);
      setCameraError("Camera permission denied or not supported.");
      setCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCapturing(false);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");
    updateValue(data);
    stopCamera();
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateValue(reader.result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const retake = () => {
    updateValue("");
    setPreview(null);
    setCapturing(true);
  };
  const startCamera = () => {
    setPreview(null);
    setCameraError("");
    setCapturing(true);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label className="field-label">
        {field.label}
        {field.required ? " *" : ""}
      </label>

      {preview && !capturing ? (
        <div>
          <img src={preview} alt="selfie" className="preview-img" />
          <div style={{ marginTop: 8 }}>
            <button className="button ghost" type="button" onClick={retake}>
              Retake Selfie
            </button>
          </div>
        </div>
      ) : (
        <>
          {!capturing && (
            <div className="controls">
              <input type="file" accept="image/*" onChange={handleUpload} />
              <button
                type="button"
                className="button ghost"
                onClick={startCamera}
              >
                Take Selfie
              </button>
            </div>
          )}

          {capturing && (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="video-preview"
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="controls" style={{ marginTop: 8 }}>
                <button
                  className="button primary"
                  type="button"
                  onClick={capture}
                >
                  Capture
                </button>
                <button
                  className="button ghost"
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setCapturing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {cameraError && <div style={{ color: "red" }}>{cameraError}</div>}
        </>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
