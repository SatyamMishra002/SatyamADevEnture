"use client";

import Link from "next/link";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

const ASSET_EXT = /\.(pdf|png|jpe?g|gif|svg|webp|zip|mp4|webm)$/i;

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classNames = cn(
    "group inline-flex items-center gap-2 text-sm text-accent transition",
    className,
  );
  const content = (
    <>
      <span className="border-b border-accent/30 pb-0.5 transition group-hover:border-accent">
        {children}
      </span>
      <span aria-hidden className="transition group-hover:translate-x-0.5">
        →
      </span>
    </>
  );

  // Static assets need withBasePath; Next.js Link already applies basePath for routes.
  if (ASSET_EXT.test(href)) {
    return (
      <a href={withBasePath(href)} className={classNames} download>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classNames}>
      {content}
    </Link>
  );
}
