"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-sm text-accent transition",
        className,
      )}
    >
      <span className="border-b border-accent/30 pb-0.5 transition group-hover:border-accent">
        {children}
      </span>
      <span aria-hidden className="transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
