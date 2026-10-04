import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // GitHubのアイコン画像を next/image で表示できるように許可する
    remotePatterns: [new URL("https://avatars.githubusercontent.com/**")],
  },
};

export default nextConfig;
