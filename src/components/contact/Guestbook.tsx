"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { GuestbookEntry } from "@/types";
import { formatDate } from "@/lib/utils";

const STORAGE_KEY = "satyam-guestbook";

function loadLocal(): GuestbookEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as GuestbookEntry[];
  } catch {
    return [];
  }
}

export function Guestbook({ seed }: { seed: GuestbookEntry[] }) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(seed);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const local = loadLocal();
    if (local.length) {
      const merged = [...local, ...seed].filter(
        (e, i, arr) => arr.findIndex((x) => x.id === e.id) === i,
      );
      merged.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setEntries(merged);
    }
  }, [seed]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const entry: GuestbookEntry = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const local = [entry, ...loadLocal()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
    setEntries((prev) => [entry, ...prev]);
    setName("");
    setMessage("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
            className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-text outline-none focus:border-accent/40"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
            Message
          </span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            maxLength={280}
            rows={3}
            className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent py-3 text-text outline-none focus:border-accent/40"
          />
        </label>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-3 text-sm text-bg transition hover:opacity-90"
          >
            Sign guestbook
          </button>
          {saved && (
            <span className="font-mono text-xs text-text-muted">Saved locally</span>
          )}
        </div>
      </form>

      <ul className="mt-12 space-y-6">
        {entries.map((entry) => (
          <li key={entry.id} className="border-t border-border pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-display text-lg text-text">{entry.name}</p>
              <time className="font-mono text-[11px] text-text-muted">
                {formatDate(entry.date)}
              </time>
            </div>
            <p className="mt-2 text-text-muted">{entry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
