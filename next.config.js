/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.printify.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig 