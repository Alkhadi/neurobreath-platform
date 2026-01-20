const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  outputFileTracingRoot: path.join(__dirname, '../'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compress: true,
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Suppress React DevTools suggestion in development
  reactStrictMode: true,
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  webpack: (config, { isServer }) => {
    // Ensure the Node.js server runtime can locate emitted chunks.
    // Next normally emits server chunks under `.next/server/chunks/*`.
    // Under some Node/webpack combinations the runtime can incorrectly try
    // to load `./<id>.js` from `.next/server/` instead of `./chunks/<id>.js`.
    if (isServer && config?.output) {
      config.output.chunkFilename = 'chunks/[id].js';
    }
    return config;
  },
};

module.exports = nextConfig;
