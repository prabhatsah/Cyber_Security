/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },*/
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, "ssh2"];
    }
    return config;
  },
  env: {
    IKON_DOMAIN: process.env.IKON_DOMAIN,
    IKON_BASE_URL: process.env.IKON_BASE_URL,
    NEXT_PORT: process.env.NEXT_PORT,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
    NEXT_BASE_PATH: process.env.NEXT_BASE_PATH,
  },
  basePath: "/cyber-security",
  assetPrefix: "/cyber-security",
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
