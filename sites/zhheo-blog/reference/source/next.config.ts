import type { NextConfig } from "next";

const repoName = "zhheo-blog-clone";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages 项目站点部署在 https://weepwood.github.io/zhheo-blog-clone/
  basePath: `/page-mirror/sites/zhheo-blog`,
  assetPrefix: `/page-mirror/sites/zhheo-blog/`,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: `/page-mirror/sites/zhheo-blog`,
  },
};

export default nextConfig;
