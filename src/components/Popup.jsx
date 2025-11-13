import React from "react";

export default function Popup({
  title = "",
  message = "",
  children,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  showButtons = true,
}) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        {title && <h3>{title}</h3>}
        {message && <p>{message}</p>}

        {/* optional custom content */}
        {children && <div style={{ marginTop: 10 }}>{children}</div>}

        {showButtons && (
          <div className="popup-buttons">
            {onCancel && (
              <button className="button ghost" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button className="button primary" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
