"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="border-t border-border">
      {projects.map((project, i) => {
        const active = hovered === project.id;
        return (
          <Reveal key={project.id} delay={i * 0.05}>
            <div
              className="border-b border-border"
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(project.id)}
              onBlur={() => setHovered(null)}
            >
              <Link
                href={`/projects/${project.slug}/`}
                className="group block py-10 md:py-14"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between md:gap-8">
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="font-mono text-[11px] text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className={cn(
                        "font-display text-[clamp(1.75rem,4vw,3rem)] leading-none transition-colors duration-500",
                        active ? "text-accent" : "text-text",
                      )}
                    >
                      {project.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-8 md:pl-0">
                    <span className="font-mono text-xs text-text-muted">
                      {project.year}
                    </span>
                    <span className="text-sm text-text-muted">{project.role}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 pl-8 md:pl-12">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Always visible on small screens; hover-reveal from md up */}
                <p className="mt-5 max-w-xl pl-8 text-base leading-relaxed text-text-muted md:hidden">
                  {project.summary}
                  <span className="mt-3 block text-sm text-accent">
                    Read case study →
                  </span>
                </p>

                <AnimatePresence>
                  {active && (
                    <motion.p
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden overflow-hidden pl-12 md:block"
                    >
                      <span className="mt-5 block max-w-xl text-base leading-relaxed text-text-muted">
                        {project.summary}
                      </span>
                      <span className="mt-3 inline-block text-sm text-accent">
                        Read case study →
                      </span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
