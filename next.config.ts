import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/IkonApps",
  assetPrefix: "/IkonApps",
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
    domains: ["images.unsplash.com"],
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
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "ssh2"];
    }
    return config;
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
