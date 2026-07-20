"use client";

import { motion } from "framer-motion";

function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ContributionGraph({ weeks = 52 }: { weeks?: number }) {
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = hash(i + 7);
    const level = v > 0.85 ? 4 : v > 0.65 ? 3 : v > 0.45 ? 2 : v > 0.25 ? 1 : 0;
    return level;
  });

  const colors = [
    "bg-bg-card",
    "bg-accent/15",
    "bg-accent/30",
    "bg-accent/50",
    "bg-accent/75",
  ];

  return (
    <div className="overflow-x-auto">
      <div
        className="grid w-max gap-1"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="grid grid-rows-7 gap-1">
            {Array.from({ length: 7 }, (_, d) => {
              const level = cells[w * 7 + d];
              return (
                <motion.div
                  key={`${w}-${d}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (w * 7 + d) * 0.002, duration: 0.3 }}
                  className={`h-2.5 w-2.5 rounded-[2px] ${colors[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] tracking-widest text-text-muted uppercase">
        Contribution rhythm · illustrative
      </p>
    </div>
  );
}
