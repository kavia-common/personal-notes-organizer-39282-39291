/**
 * Simple API client abstracting backend calls for notes.
 * If REACT_APP_API_BASE is not set, falls back to in-memory store.
 */

import { getEnv, hasBackend } from "../utils/env";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Data shape
 * Note: { id: string, title: string, content: string, updatedAt: number }
 */

class MemoryStore {
  constructor() {
    this.notes = [];
    // Seed a welcome note
    const now = Date.now();
    this.notes.push({
      id: "welcome",
      title: "Welcome to Old Notepad",
      content:
        "This is your first note. Type to edit, press Ctrl/Cmd+S to save.\n\nUse the New button (Ctrl/Cmd+N) to create another note.\nSearch to filter on the left list (or in compact, via header).",
      updatedAt: now,
    });
  }

  async list(q = "") {
    await delay(120);
    const query = q.toLowerCase();
    const result = query
      ? this.notes.filter(
          (n) =>
            n.title.toLowerCase().includes(query) ||
            n.content.toLowerCase().includes(query)
        )
      : [...this.notes];
    // Order by updated desc
    result.sort((a, b) => b.updatedAt - a.updatedAt);
    return result;
  }

  async get(id) {
    await delay(80);
    return this.notes.find((n) => n.id === id) || null;
  }

  async create(note) {
    await delay(140);
    const id =
      "n_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    const newNote = {
      id,
      title: note.title || "Untitled",
      content: note.content || "",
      updatedAt: Date.now(),
    };
    this.notes.push(newNote);
    return newNote;
  }

  async update(id, patch) {
    await delay(140);
    const idx = this.notes.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error("Note not found");
    this.notes[idx] = {
      ...this.notes[idx],
      ...patch,
      updatedAt: Date.now(),
    };
    return this.notes[idx];
  }

  async remove(id) {
    await delay(100);
    const idx = this.notes.findIndex((n) => n.id === id);
    if (idx === -1) return { ok: true };
    this.notes.splice(idx, 1);
    return { ok: true };
  }
}

class RestClient {
  constructor(base) {
    this.base = base.replace(/\/+$/, "");
  }
  async list(q = "") {
    const url = new URL(this.base + "/notes");
    if (q) url.searchParams.set("q", q);
    const r = await fetch(url.toString());
    if (!r.ok) throw new Error("Failed to list notes");
    return r.json();
  }
  async get(id) {
    const r = await fetch(`${this.base}/notes/${encodeURIComponent(id)}`);
    if (!r.ok) throw new Error("Failed to get note");
    return r.json();
  }
  async create(note) {
    const r = await fetch(`${this.base}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    if (!r.ok) throw new Error("Failed to create note");
    return r.json();
  }
  async update(id, patch) {
    const r = await fetch(`${this.base}/notes/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) throw new Error("Failed to update note");
    return r.json();
  }
  async remove(id) {
    const r = await fetch(`${this.base}/notes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!r.ok) throw new Error("Failed to delete note");
    return { ok: true };
  }
}

// PUBLIC_INTERFACE
export function getNotesApi() {
  /** Returns a client with methods: list(q), get(id), create({title,content}), update(id,patch), remove(id) */
  if (hasBackend()) {
    const { apiBase } = getEnv();
    return new RestClient(apiBase);
    // In production, we could add connectivity checks and fallback.
  }
  return new MemoryStore();
}
