import React, { useRef, useEffect } from "react";

/**
 * Notes list navigation.
 * Props:
 * - notes: array
 * - selectedId: string
 * - onSelect: (id) => void
 */

// PUBLIC_INTERFACE
export default function NotesList({ notes = [], selectedId, onSelect }) {
  const listRef = useRef(null);

  // Keyboard navigation: up/down to move selection
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (key !== "arrowdown" && key !== "arrowup") return;
      e.preventDefault();
      if (!notes.length) return;
      const idx = Math.max(
        0,
        Math.min(
          notes.length - 1,
          Math.max(
            0,
            selectedId
              ? notes.findIndex((n) => n.id === selectedId)
              : 0
          )
        )
      );
      const next =
        key === "arrowdown"
          ? Math.min(notes.length - 1, idx + 1)
          : Math.max(0, idx - 1);
      onSelect && onSelect(notes[next].id);
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [notes, selectedId, onSelect]);

  return (
    <nav
      className="notes-list"
      ref={listRef}
      aria-label="Notes list"
      tabIndex={0}
    >
      {notes.length === 0 ? (
        <div className="note-item empty">No notes yet</div>
      ) : (
        notes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect && onSelect(n.id)}
            className={"note-item" + (n.id === selectedId ? " selected" : "")}
            aria-current={n.id === selectedId ? "true" : "false"}
          >
            <span className="note-title-text">
              {n.title || "Untitled"}
            </span>
            <span className="note-updated">
              {new Date(n.updatedAt).toLocaleDateString()}
            </span>
          </button>
        ))
      )}
    </nav>
  );
}
