import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/forum-app",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your-nextauth-secret-key-must-be-at-least-32-chars",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000"
  }
};

export default nextConfig;
