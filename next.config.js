// import type { NextConfig } from "next"; Commenting out the type import

const nextConfig = { // Removed the : NextConfig type annotation
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public-files.gumroad.com',
        // port: '', // Optional
        // pathname: '/account123/**', // Optional path restriction
      },
      {
        protocol: 'https',
        hostname: 'files.printful.com', // Add Printful host too
      },
      {
        protocol: 'https',
        hostname: 'files.cdn.printful.com', // Add the actual CDN hostname
      },
      // Add any other hostnames you might need later
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  // TypeScript errors are now fixed, safe to enable checking
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig; // Changed export default to module.exports
