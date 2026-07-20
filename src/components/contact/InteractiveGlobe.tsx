"use client";

import { useEffect, useRef, useState } from "react";

export function InteractiveGlobe({ city }: { city: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: ny * -18, y: nx * 22 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        ref={ref}
        viewBox="0 0 320 320"
        className="h-64 w-64 touch-none md:h-80 md:w-80"
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.2s ease-out",
        }}
        aria-label={`Interactive globe centered near ${city}`}
      >
        <defs>
          <radialGradient id="globeGlow" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(245,240,232,0.18)" />
            <stop offset="55%" stopColor="rgba(245,240,232,0.04)" />
            <stop offset="100%" stopColor="rgba(9,9,9,0)" />
          </radialGradient>
          <clipPath id="globeClip">
            <circle cx="160" cy="160" r="118" />
          </clipPath>
        </defs>
        <circle cx="160" cy="160" r="130" fill="url(#globeGlow)" />
        <circle
          cx="160"
          cy="160"
          r="118"
          fill="#111"
          stroke="rgba(245,240,232,0.22)"
          strokeWidth="1"
        />
        <g clipPath="url(#globeClip)" stroke="rgba(245,240,232,0.12)" fill="none">
          {[-60, -30, 0, 30, 60].map((lat) => (
            <ellipse
              key={lat}
              cx="160"
              cy="160"
              rx={118 * Math.cos((lat * Math.PI) / 180)}
              ry={28}
              transform={`translate(0 ${lat * 1.35})`}
            />
          ))}
          {[-90, -45, 0, 45, 90].map((lon) => (
            <ellipse
              key={lon}
              cx="160"
              cy="160"
              rx={28 + Math.abs(lon) * 0.15}
              ry="118"
              transform={`rotate(${lon * 0.35} 160 160)`}
            />
          ))}
          <path
            d="M70 140 C100 110, 130 100, 160 120 C190 140, 220 130, 250 110"
            stroke="rgba(245,240,232,0.28)"
            strokeWidth="1.2"
          />
          <path
            d="M55 180 C95 170, 130 190, 165 175 C200 160, 235 170, 265 185"
            stroke="rgba(245,240,232,0.2)"
            strokeWidth="1"
          />
        </g>
        <circle cx="198" cy="148" r="4" fill="var(--accent)" />
        <circle cx="198" cy="148" r="10" fill="none" stroke="rgba(245,240,232,0.35)" />
        <text
          x="198"
          y="178"
          textAnchor="middle"
          fill="rgba(250,250,250,0.7)"
          fontSize="11"
          fontFamily="var(--font-jetbrains), monospace"
        >
          {city}
        </text>
      </svg>
    </div>
  );
}
