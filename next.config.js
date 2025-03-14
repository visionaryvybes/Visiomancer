/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.printify.com',
      'printify.com',
      'cdn.printify.com',
      'images-cdn.printify.com',
      'images.unsplash.com',
      'res.cloudinary.com'
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 