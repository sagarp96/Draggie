import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Turbopack uses project root (silence inferred-root warning)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
