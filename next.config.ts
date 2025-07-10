import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_BASE_PATH || "",
  assetPrefix: process.env.NEXT_BASE_PATH || "",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    //testing
    optimizePackageImports: [
      "@radix-ui/react-*",
      "@progress/kendo-react-*",
      "lucide-react",
    ],
  },
  images: {
    // domains: [process.env?.IKON_DOMAIN || ""],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    IKON_DOMAIN: process.env.IKON_DOMAIN,
    IKON_BASE_URL: process.env.IKON_BASE_URL,
    NEXT_PORT: process.env.NEXT_PORT,
    NEXT_BASE_PATH_URL: process.env.NEXT_BASE_PATH_URL,
    NEXT_BASE_PATH: process.env.NEXT_BASE_PATH,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/workflows",
  //       destination:
  //         "https://ikoncloud-dev.keross.com/aiagent/api/v1/workflows",
  //     },
  //   ];
  // },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
