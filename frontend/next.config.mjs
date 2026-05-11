/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/hanzi-data/[char]": ["./node_modules/hanzi-writer-data/*.json"],
  },
}

export default nextConfig
