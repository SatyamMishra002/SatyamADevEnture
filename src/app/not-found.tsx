import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
        404
      </p>
      <h1 className="font-display mt-6 text-5xl text-text md:text-7xl">
        Lost on the ridge
      </h1>
      <p className="mt-4 max-w-md text-text-muted">
        This path doesn&apos;t exist — or it was renamed. Head back to known ground.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-accent px-6 py-3 text-sm text-bg"
      >
        Return home
      </Link>
    </div>
  );
}
