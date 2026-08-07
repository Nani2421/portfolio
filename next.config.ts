import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Turbopack guess the
  // wrong workspace root; pin it to this project.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
