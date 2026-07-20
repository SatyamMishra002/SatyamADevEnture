"use client";

import { motion } from "framer-motion";

const snippets = [
  { code: "async def infer(x):", x: "8%", y: "22%", delay: 0.2 },
  { code: "return await model(x)", x: "72%", y: "18%", delay: 0.5 },
  { code: "@app.get('/health')", x: "15%", y: "68%", delay: 0.8 },
  { code: "pipeline.run(batch)", x: "68%", y: "72%", delay: 1.1 },
];

export function FloatingCode() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {snippets.map((s) => (
        <motion.div
          key={s.code}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.45, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: s.delay, duration: 1.2 },
            y: { delay: s.delay, duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          className="font-mono absolute hidden rounded-lg border border-border bg-bg-card/60 px-3 py-2 text-[11px] text-text-muted backdrop-blur-sm md:block"
          style={{ left: s.x, top: s.y }}
        >
          {s.code}
        </motion.div>
      ))}
    </div>
  );
}
