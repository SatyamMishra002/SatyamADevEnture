"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Line = { type: "in" | "out" | "sys"; text: string };

const help = [
  "help                 — list commands",
  "whoami               — identity",
  "stack                — current tools",
  "projects             — list work",
  "open <path>          — navigate (about, projects, adventure…)",
  "music                — now playing",
  "clear                — clear screen",
  "egg                  — ?",
];

export default function TerminalPage() {
  const [lines, setLines] = useState<Line[]>([
    { type: "sys", text: "satyamOS v1.0 — type help to begin" },
  ]);
  const [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const next: Line[] = [...lines, { type: "in", text: `› ${cmd}` }];
    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");

    switch (head.toLowerCase()) {
      case "help":
        help.forEach((h) => next.push({ type: "out", text: h }));
        break;
      case "whoami":
        next.push({
          type: "out",
          text: "Satyam — Python developer · AI · backend · mountains",
        });
        break;
      case "stack":
        next.push({
          type: "out",
          text: "Python, FastAPI, Django, PyTorch, PostgreSQL, Redis, Docker",
        });
        break;
      case "projects":
        next.push({ type: "out", text: "neural-pipeline · scrapecraft · signalboard" });
        next.push({ type: "out", text: "open projects  — browse case studies" });
        break;
      case "music":
        next.push({ type: "out", text: "Now playing: Midnight City — M83" });
        break;
      case "clear":
        setLines([{ type: "sys", text: "cleared" }]);
        setInput("");
        return;
      case "egg":
        next.push({
          type: "out",
          text: "You found the quiet easter egg. The best systems leave room for wonder.",
        });
        break;
      case "open": {
        const map: Record<string, string> = {
          about: "/about/",
          projects: "/projects/",
          adventure: "/adventure/",
          blogs: "/blogs/",
          photography: "/photography/",
          contact: "/contact/",
          home: "/",
        };
        const href = map[arg.toLowerCase()];
        if (href) {
          next.push({ type: "out", text: `opening ${href}` });
          setLines(next);
          setInput("");
          setTimeout(() => {
            window.location.href = href;
          }, 400);
          return;
        }
        next.push({ type: "out", text: `unknown path: ${arg || "(empty)"}` });
        break;
      }
      default:
        next.push({ type: "out", text: `command not found: ${head}` });
    }
    setLines(next);
    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg px-4 py-10 text-text">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-text-muted hover:text-text">
            ← Exit terminal
          </Link>
          <p className="font-mono text-[11px] tracking-widest text-text-muted uppercase">
            Interactive shell
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/15" />
            <span className="font-mono ml-3 text-[11px] text-text-muted">zsh — satyam</span>
          </div>
          <div className="font-mono max-h-[70vh] min-h-[50vh] overflow-y-auto p-4 text-sm leading-relaxed">
            {lines.map((l, i) => (
              <p
                key={`${i}-${l.text}`}
                className={
                  l.type === "in"
                    ? "text-accent"
                    : l.type === "sys"
                      ? "text-text-muted"
                      : "text-text"
                }
              >
                {l.text}
              </p>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-accent">›</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") run(input);
                }}
                className="flex-1 bg-transparent outline-none"
                autoFocus
                aria-label="Terminal input"
              />
            </div>
            <div ref={bottom} />
          </div>
        </div>
      </div>
    </div>
  );
}
