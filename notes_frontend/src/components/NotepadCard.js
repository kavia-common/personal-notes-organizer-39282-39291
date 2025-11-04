import React from "react";
import Rings from "./Rings";

/**
 * Wraps content with the notepad paper and rings
 * Props: children
 */

// PUBLIC_INTERFACE
export default function NotepadCard({ children }) {
  /** Paper card with spiral rings at top */
  return (
    <div className="notepad-card">
      <Rings />
      <div className="paper">{children}</div>
    </div>
  );
}
