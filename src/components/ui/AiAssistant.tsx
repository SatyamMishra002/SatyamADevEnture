"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Link from "next/link";

const replies: { match: RegExp; answer: string; href?: string }[] = [
  {
    match: /project|work|portfolio/i,
    answer: "Start with Neural Pipeline — a calm production ML inference system.",
    href: "/projects/neural-pipeline/",
  },
  {
    match: /blog|write|essay/i,
    answer: "Try Designing Calm APIs — short, practical, and opinionated.",
    href: "/blogs/calm-apis/",
  },
  {
    match: /adventure|mountain|travel|trip/i,
    answer: "The Triund Ridge journal captures the mindset behind the work.",
    href: "/adventure/triund-ridge/",
  },
  {
    match: /contact|email|hire|available/i,
    answer: "I’m open to thoughtful collaborations. Reach out via the contact page.",
    href: "/contact/",
  },
  {
    match: /stack|tech|python|fastapi/i,
    answer: "Python, FastAPI, Django, PyTorch, PostgreSQL, Redis, Docker.",
    href: "/about/",
  },
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string; href?: string }[]
  >([
    {
      role: "assistant",
      text: "Ask about projects, writing, adventures, or how to get in touch.",
    },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    const hit = replies.find((r) => r.match.test(q));
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      hit
        ? { role: "assistant", text: hit.answer, href: hit.href }
        : {
            role: "assistant",
            text: "I can guide you to projects, blogs, adventure journals, or contact. Try asking about those.",
          },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-accent shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
        aria-label="Open assistant"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
      {open && (
        <div className="glass fixed right-5 bottom-20 z-40 flex h-[420px] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm text-text">Guide</p>
              <p className="text-[11px] text-text-muted">Local assistant · no API</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4 text-text-muted" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={`${i}-${m.text.slice(0, 12)}`}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl bg-accent-soft px-3 py-2 text-sm text-text"
                    : "mr-8 rounded-2xl bg-bg-card px-3 py-2 text-sm text-text-muted"
                }
              >
                <p>{m.text}</p>
                {m.href && (
                  <Link href={m.href} className="mt-2 inline-block text-xs text-accent">
                    Open →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask something…"
              className="flex-1 rounded-xl border border-border bg-bg-card px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={send}
              className="rounded-xl bg-accent px-3 py-2 text-sm text-bg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
