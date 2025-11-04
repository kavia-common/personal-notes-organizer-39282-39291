/**
 * Keyboard shortcut management for the app.
 * Register global handlers for Save (Ctrl/Cmd+S), New (Ctrl/Cmd+N), Find (Ctrl/Cmd+F).
 */

// PUBLIC_INTERFACE
export function registerShortcuts({ onSave, onNew, onFind }) {
  /** Register listeners; return unsubscribe function. */
  const handler = (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    const key = e.key.toLowerCase();

    if (key === "s") {
      e.preventDefault();
      if (onSave) onSave();
    } else if (key === "n") {
      e.preventDefault();
      if (onNew) onNew();
    } else if (key === "f") {
      e.preventDefault();
      if (onFind) onFind();
    }
  };

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}

// PUBLIC_INTERFACE
export function formatLastSaved(ts) {
  /** Format timestamp to human friendly string. */
  if (!ts) return "Not saved yet";
  const d = new Date(ts);
  return `Last saved ${d.toLocaleString()}`;
}

// PUBLIC_INTERFACE
export function srOnly(text) {
  /** Return visually hidden text for accessibility. */
  return <span className="sr-only">{text}</span>;
}
