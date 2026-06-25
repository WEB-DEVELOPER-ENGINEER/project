/** @type {import('next').NextConfig} */

const nextConfig = {
  // Remove 'output: export' to enable server-side functionality
  // output: 'export', // This conflicts with NextAuth and dynamic API routes
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint errors during build
  },
  images: { 
    unoptimized: false, // Enable optimization for better performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'localhost',
      'img.youtube.com',
      'i.vimeocdn.com', 
      'vumbnail.com',
      'fast.wistia.net',
      'players.brightcove.net'
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true, // Now enabled with critters dependency
  },
  // Disable SWC minify to avoid potential issues minifying template literals
  // from certain third-party libraries (e.g., Radix UI) during server builds.
  swcMinify: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/uploads/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'video/mp4',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://tagmanager.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "script-src-elem 'self' 'unsafe-inline' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://tagmanager.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://fonts.googleapis.com https://www.gstatic.com https://translate.google.com https://tagmanager.google.com https://fonts.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://translate.googleapis.com https://fonts.googleapis.com https://www.gstatic.com https://translate.google.com https://tagmanager.google.com https://fonts.googleapis.com",
              "img-src 'self' data: https: blob: https://www.gstatic.com https://ssl.gstatic.com https://translate.google.com http://translate.google.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com",
              "media-src 'self' data: https: blob:",
              "connect-src 'self' https://translate.googleapis.com https://translate.google.com https://translate-pa.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://www.google.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net",
              "frame-src 'self' https://translate.google.com https://translate.googleapis.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://fast.wistia.net https://players.brightcove.net https://bid.g.doubleclick.net",
              "font-src 'self' data: https: https://fonts.gstatic.com https://www.gstatic.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "worker-src 'self' blob:"
            ].join('; ')
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ],
      },
    ];
  },
  
  // Webpack optimizations for video handling and performance
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks.cacheGroups,
            video: {
              test: /[\\/]components[\\/]ui[\\/].*video.*\.tsx?$/,
              name: 'video-components',
              chunks: 'all',
              priority: 10,
            },
            heroSection: {
              test: /[\\/]components[\\/]sections[\\/]hero.*\.tsx?$/,
              name: 'hero-components',
              chunks: 'all',
              priority: 9,
            },
          },
        },
      };
    }

    // Add video file handling with optimization
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi|mov)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[contenthash].[ext]',
        },
      },
    });

    // Optimize bundle size
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/components/ui/enhanced-video': '@/components/ui/optimized-video-v2',
      };
    }

    return config;
  },
};

module.exports = nextConfig;