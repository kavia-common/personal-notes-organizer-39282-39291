import React from "react";

/**
 * Editor textarea for note content
 * Props: value, onChange, placeholder
 */

// PUBLIC_INTERFACE
export default function Editor({ value, onChange, placeholder }) {
  /** Monospace textarea aligned to ruled lines. */
  return (
    <div className="editor-wrap">
      <label htmlFor="note-editor" className="sr-only">
        Note content
      </label>
      <textarea
        id="note-editor"
        className="note-editor"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
}
