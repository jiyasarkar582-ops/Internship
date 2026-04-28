import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for sqlite3 native bindings on Node.js runtime
  serverExternalPackages: ["sqlite3", "sqlite", "bcryptjs"],
  // Ensures API routes run on Node.js (not Edge) so sqlite3 works
  experimental: {},
};

export default nextConfig;
