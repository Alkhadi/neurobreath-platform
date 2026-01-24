const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  outputFileTracingRoot: path.join(__dirname, '../'),
  // Force cache invalidation - build timestamp
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
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
    // Next emits server chunks under `.next/server/chunks/*`.
    // Under some Node/webpack combinations the runtime can incorrectly try
    // to load `./<id>.js` from `.next/server/` instead of `./chunks/<id>.js`.
    //
    // We apply this when the output path is the server bundle directory.
    const outputPath = config?.output?.path;
    const isServerOutputPath =
      typeof outputPath === 'string' && (outputPath.endsWith(`${path.sep}server`) || outputPath.includes(`${path.sep}server${path.sep}`));

    if (isServerOutputPath && config?.output) {
      config.output.chunkFilename = 'chunks/[id].js';
    }

    return config;
  },
};

module.exports = nextConfig;
