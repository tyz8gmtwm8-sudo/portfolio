import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // GitHubのアイコン画像を next/image で表示できるように許可する
    // 画像URLの末尾に付く「?v=4」も許可するため、search を指定している
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
        search: "?v=4",
      },
    ],
  },
};

export default nextConfig;
