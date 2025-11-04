import React from "react";

/**
 * Title input for note title
 * Props: value, onChange, placeholder
 */

// PUBLIC_INTERFACE
export default function TitleInput({ value, onChange, placeholder }) {
  /** Accessible labeled input for note title. */
  return (
    <div className="title-row">
      <label htmlFor="note-title" className="sr-only">
        Note title
      </label>
      <input
        id="note-title"
        className="note-title"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
}
