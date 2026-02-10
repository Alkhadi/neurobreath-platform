const path = require('path');

const nextOutputMode = process.env.NEXT_OUTPUT_MODE;

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Only allow known-safe output modes. This app uses server features like
  // `headers()` in layouts/metadata, so `output: 'export'` would break routes.
  output: nextOutputMode === 'standalone' ? 'standalone' : undefined,
  outputFileTracingRoot: path.join(__dirname, '../'),
  // Keep dev asset URLs stable; if you need cache-busting in production,
  // rely on the deployment platform or opt-in here.
  generateBuildId: process.env.NODE_ENV === 'production'
    ? async () => `build-${Date.now()}`
    : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  compress: true,
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
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
    // Under some Node/webpack combinations the runtime can incorrectly try
    // to load `./<id>.js` from `.next/server/`.
    // To keep the runtime and emitted chunk paths in sync, we emit server
    // chunks at the server output root.
    //
    const outputPath = config?.output?.path;
    const isNextServerOutputPath =
      isServer &&
      typeof outputPath === 'string' &&
      outputPath.includes(`${path.sep}.next${path.sep}server`);

    if (isNextServerOutputPath && config?.output) {
      config.output.chunkFilename = '[id].js';
    }

    return config;
  },
};

module.exports = nextConfig;
