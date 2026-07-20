import type { NextConfig } from "next";

const repoName = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: repoName || undefined,
  assetPrefix: repoName || undefined,
};

export default nextConfig;
