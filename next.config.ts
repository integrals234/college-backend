import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dangerously allow production builds to successfully complete even if
  // your project has ESLint errors or type errors.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;