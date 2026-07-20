"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export function MountainHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const skyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const farY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] overflow-hidden px-6"
      aria-label="Adventure hero"
    >
      <motion.div
        style={{ y: skyY }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(216,226,208,0.14),transparent_60%)]" />
        <div className="absolute top-[12%] left-[18%] h-1.5 w-1.5 rounded-full bg-accent/40" />
        <div className="absolute top-[22%] right-[28%] h-1 w-1 rounded-full bg-accent/30" />
        <div className="absolute top-[18%] right-[18%] h-0.5 w-0.5 rounded-full bg-accent/50" />
      </motion.div>

      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] w-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <motion.g style={{ y: farY }}>
          <path
            d="M0 420 L180 260 L320 360 L480 180 L640 300 L820 140 L980 280 L1140 200 L1300 300 L1440 240 L1440 640 L0 640 Z"
            fill="rgba(24, 36, 28, 0.9)"
          />
        </motion.g>
        <motion.g style={{ y: midY }}>
          <path
            d="M0 480 L220 300 L400 420 L560 250 L760 380 L960 220 L1180 360 L1440 280 L1440 640 L0 640 Z"
            fill="rgba(36, 52, 40, 0.95)"
          />
        </motion.g>
        <motion.g style={{ y: nearY }}>
          <path
            d="M0 540 L160 400 L340 500 L520 360 L700 480 L900 340 L1100 460 L1280 380 L1440 440 L1440 640 L0 640 Z"
            fill="rgba(18, 28, 22, 1)"
          />
          <path
            d="M0 560 Q360 500 720 560 T1440 540 L1440 640 L0 640 Z"
            fill="rgba(10, 16, 12, 0.85)"
          />
        </motion.g>
      </svg>

      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center pb-32 pt-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-text"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28 }}
          className="mt-6 max-w-xl text-lg text-text-muted"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
