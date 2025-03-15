/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.printify.com',
      'images-api.printify.com',
      'cdn.printify.com'
    ],
  },
  env: {
    PRINTIFY_API_TOKEN: process.env.PRINTIFY_API_TOKEN,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  // Optimize for Vercel deployment
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // Reduce memory usage during build
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

module.exports = nextConfig 