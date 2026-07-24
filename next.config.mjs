import { imageHosts } from './image-hosts.config.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,

  // Ensure the committed data/*.json seed files are bundled into the API route
  // functions so Netlify Blobs can seed from them on first read in production.
  outputFileTracingIncludes: {
    '/api/**': ['./data/**'],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: imageHosts,
    minimumCacheTTL: 60,
    unoptimized: true,
  }
};
export default nextConfig;