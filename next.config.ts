import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // add cors
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, x-user-id, Accept",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  // Add this section:
  allowedDevOrigins: [
    "http://localhost:3000",
    `${process.env.NEXT_PUBLIC_API_URL}`,
    "https://ahlan-hnu.vercel.app/"
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
};

export default withNextIntl(nextConfig);
