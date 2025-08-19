/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',  // ✅ Added this line for standalone build
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nabeel.a2hosted.com',
      },
      {
        protocol: 'https',
        hostname: 'staging.portalteam.org',
      },
      {
        protocol: 'https',
        hostname: 'portalteam.org',
      },
      { protocol: 'https', hostname: 'portalteam.orgnabeel.a2hosted.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        // Required for OneSignal Service Worker
        source: '/OneSignalSDKWorker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        // Required for OneSignal Service Worker updater
        source: '/OneSignalSDKUpdaterWorker.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
