"use client";

import { useEffect, useState } from "react";

export function LiveContext({
  city,
  track,
  artist,
}: {
  city: string;
  track?: string;
  artist?: string;
}) {
  const [now, setNow] = useState<string>("");
  const [weather, setWeather] = useState("Clear · 26°");

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Soft placeholder weather — swap for a real API later without layout changes
    const options = ["Clear · 26°", "Haze · 28°", "Clouds · 24°", "Breeze · 25°"];
    setWeather(options[new Date().getHours() % options.length]);
  }, []);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "City", value: city },
        { label: "Local time", value: now || "—" },
        { label: "Weather", value: weather },
        {
          label: "Now playing",
          value: track && artist ? `${track} — ${artist}` : "Quiet mode",
        },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-bg-card/50 px-4 py-3"
        >
          <p className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
            {item.label}
          </p>
          <p className="mt-1 truncate text-sm text-text">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
