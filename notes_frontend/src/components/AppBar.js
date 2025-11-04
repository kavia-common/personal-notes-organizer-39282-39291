import React from "react";
import { srOnly } from "../utils/shortcuts";

/**
 * AppBar component showing brand and actions.
 * Props:
 * - onNew, onSave, onDelete, onSearchChange
 * - canSave (bool), canDelete (bool)
 */

// PUBLIC_INTERFACE
export default function AppBar({
  onNew,
  onSave,
  onDelete,
  onSearchChange,
  canSave = false,
  canDelete = false,
  searchRef,
}) {
  /** The top bar actions and search. */
  const onLogoError = (e) => {
    // Graceful fallback: hide the broken image element but keep title text visible
    e.currentTarget.style.display = "none";
  };

  return (
    <header className="app-bar" role="banner">
      <div className="brand" aria-label="Application title" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {/* Serve from /public/assets */}
        <img
          src={"/assets/logo-notepad.jpeg"}
          alt="Old Notepad app logo"
          width={28}
          height={28}
          onError={onLogoError}
          style={{
            width: 28,
            height: 28,
            objectFit: "contain",
            borderRadius: 4,
            boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
            background: "#ffffff",
          }}
        />
        <span className="brand-title">Old Notepad</span>
      </div>

      <div className="actions" role="toolbar" aria-label="Primary actions">
        <button className="btn" onClick={onNew} aria-label="Create new note">
          {/* icon-ish via unicode */}
          <span aria-hidden="true">✚</span>
          <span className="hide-xs">{srOnly("")} New</span>
        </button>
        <button
          className="btn"
          onClick={onSave}
          disabled={!canSave}
          aria-disabled={!canSave}
          aria-label="Save current note"
        >
          <span aria-hidden="true">💾</span>
          <span className="hide-xs">{srOnly("")} Save</span>
        </button>
        <button
          className="btn"
          onClick={onDelete}
          disabled={!canDelete}
          aria-disabled={!canDelete}
          aria-label="Delete current note"
        >
          <span aria-hidden="true">🗑</span>
          <span className="hide-xs">{srOnly("")} Delete</span>
        </button>
        <input
          ref={searchRef}
          className="search"
          type="search"
          placeholder="Search notes…"
          aria-label="Search notes"
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}
