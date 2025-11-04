import React, { useEffect, useRef } from "react";

/**
 * Simple accessible confirmation modal.
 * Props: open, title, message, confirmText, cancelText, onConfirm, onCancel
 */

// PUBLIC_INTERFACE
export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const firstBtnRef = useRef(null);

  useEffect(() => {
    if (open && firstBtnRef.current) {
      firstBtnRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  const onKey = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCancel && onCancel();
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onKeyDown={onKey}
    >
      <div className="modal" ref={dialogRef}>
        <h2 id="confirm-title" className="modal-title">
          {title}
        </h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button
            ref={firstBtnRef}
            className="btn"
            onClick={() => onConfirm && onConfirm()}
          >
            {confirmText}
          </button>
          <button className="btn" onClick={() => onCancel && onCancel()}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
