import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import AppBar from "./components/AppBar";
import NotepadCard from "./components/NotepadCard";
import TitleInput from "./components/TitleInput";
import Editor from "./components/Editor";
import NotesList from "./components/NotesList";
import ConfirmModal from "./components/ConfirmModal";
import { getNotesApi } from "./services/api";
import { formatLastSaved, registerShortcuts } from "./utils/shortcuts";

/**
 * App: Old Notepad themed Notes UI with CRUD and in-memory fallback.
 * - Layout: AppBar, NotepadCard with optional two-pane (list + editor)
 * - Keyboard: Ctrl/Cmd+S (save), Ctrl/Cmd+N (new), Ctrl/Cmd+F (focus search)
 * - Accessibility: semantics, focus rings, labeled controls, aria props
 */

// PUBLIC_INTERFACE
function App() {
  // Data and selection state
  const api = useMemo(() => getNotesApi(), []);
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Draft editor state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState(0);
  const [dirty, setDirty] = useState(false);

  // UI state
  const [query, setQuery] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const searchRef = useRef(null);

  // Load notes (list) with optional search query
  const loadNotes = async (q = "") => {
    try {
      const list = await api.list(q);
      setNotes(list);
      // Ensure selection is valid
      if (list.length && (!selectedId || !list.find((n) => n.id === selectedId))) {
        setSelectedId(list[0].id);
      } else if (!list.length) {
        setSelectedId(null);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load notes:", e);
    }
  };

  // Load a single note into editor
  const loadNote = async (id) => {
    if (!id) {
      setTitle("");
      setContent("");
      setLastSaved(0);
      setDirty(false);
      return;
    }
    try {
      const n = await api.get(id);
      if (!n) return;
      setTitle(n.title || "");
      setContent(n.content || "");
      setLastSaved(n.updatedAt || 0);
      setDirty(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load note:", e);
    }
  };

  // Initial list load
  useEffect(() => {
    loadNotes(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload selection when selectedId changes
  useEffect(() => {
    loadNote(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Search debounce/load
  useEffect(() => {
    const t = setTimeout(() => {
      loadNotes(query);
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const unsub = registerShortcuts({
      onSave: () => doSave(),
      onNew: () => doNew(),
      onFind: () => {
        if (searchRef.current) searchRef.current.focus();
      },
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, selectedId, dirty]);

  // CRUD actions
  const doNew = async () => {
    // If current is dirty, opportunistically save first
    if (dirty && selectedId) {
      await doSave();
    }
    try {
      const created = await api.create({ title: "Untitled", content: "" });
      await loadNotes(query);
      setSelectedId(created.id);
      // Editor will load via effect
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Create failed:", e);
    }
  };

  const doSave = async () => {
    if (!dirty) return;
    try {
      if (selectedId) {
        const updated = await api.update(selectedId, { title, content });
        setLastSaved(updated.updatedAt || Date.now());
      } else {
        const created = await api.create({ title, content });
        setSelectedId(created.id);
        setLastSaved(created.updatedAt || Date.now());
      }
      setDirty(false);
      await loadNotes(query);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Save failed:", e);
    }
  };

  const doDelete = async () => {
    if (!selectedId) return;
    try {
      await api.remove(selectedId);
      setConfirmOpen(false);
      await loadNotes(query);
      // Select next note if exists
      if (notes.length) {
        const remaining = notes.filter((n) => n.id !== selectedId);
        setSelectedId(remaining[0]?.id || null);
      } else {
        setSelectedId(null);
      }
      // Clear editor
      setTitle("");
      setContent("");
      setDirty(false);
      setLastSaved(0);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Delete failed:", e);
    }
  };

  // Draft change handlers
  const onTitleChange = (v) => {
    setTitle(v);
    setDirty(true);
  };
  const onContentChange = (v) => {
    setContent(v);
    setDirty(true);
  };

  // Two-pane turns on automatically for >= 1024px by adding class; keep simple toggle via CSS media
  const paperClass = useMemo(() => {
    // Always render two-pane structure; CSS controls columns at >=1024px
    return "paper two-pane";
  }, []);

  return (
    <div className="app">
      <AppBar
        onNew={doNew}
        onSave={doSave}
        onDelete={() => setConfirmOpen(true)}
        onSearchChange={setQuery}
        canSave={dirty}
        canDelete={!!selectedId}
        searchRef={searchRef}
      />

      <main className="canvas" role="main">
        <NotepadCard>
          <div className={paperClass}>
            {/* Left list column (becomes stacked above editor on small screens) */}
            <aside aria-label="Notes navigation">
              <NotesList
                notes={notes}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
              />
            </aside>

            {/* Right editor column */}
            <section aria-label="Editor">
              <TitleInput
                value={title}
                onChange={onTitleChange}
                placeholder="Add a note title…"
              />
              <div className="meta-row" aria-live="polite">
                <span className="last-saved">{formatLastSaved(lastSaved)}</span>
                {dirty ? <span aria-label="Unsaved changes">• Unsaved</span> : null}
              </div>
              <Editor
                value={content}
                onChange={onContentChange}
                placeholder="Start typing on the notepad…"
              />
            </section>
          </div>
        </NotepadCard>
      </main>

      <footer className="app-footer">
        Old Notepad — a simple notes app. Shortcuts: Ctrl/Cmd+S save, Ctrl/Cmd+N new, Ctrl/Cmd+F search.
      </footer>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this note?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={doDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default App;
