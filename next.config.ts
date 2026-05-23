import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["@mastra/core", "@mastra/memory", "@mastra/libsql", "@mastra/loggers"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
