"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    document.documentElement.classList.add("custom-cursor-none");

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHovering(!!t?.closest("a, button, [data-magnetic], [data-cursor]"));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.documentElement.classList.remove("custom-cursor-none");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden h-2 w-2 rounded-full bg-accent mix-blend-difference md:block"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.2 }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99] hidden rounded-full border border-accent/40 md:block"
        animate={{
          x: pos.x - (hovering ? 22 : 16),
          y: pos.y - (hovering ? 22 : 16),
          width: hovering ? 44 : 32,
          height: hovering ? 44 : 32,
          opacity: 0.7,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.4 }}
      />
    </>
  );
}
