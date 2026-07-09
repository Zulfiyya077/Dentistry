import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/doctors/:slug",
        destination: "/dentists/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;