/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  env: {
    PRINTIFY_API_TOKEN: process.env.PRINTIFY_API_TOKEN,
    NEXT_PUBLIC_PRINTIFY_SHOP_ID: process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 