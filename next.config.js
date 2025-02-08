/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disable Next.js image optimization to use original Printify CDN images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.printify.com',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig 