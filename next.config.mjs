/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: Cloudflare Pages serves the ./out directory directly.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
