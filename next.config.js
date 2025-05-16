/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'via.placeholder.com',
      'placekitten.com',
      'images.unsplash.com',
      'jsonplaceholder.typicode.com',
      'fakestoreapi.com',
      'img.freepik.com',
    ],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'socket.io-client': 'socket.io-client/dist/socket.io.js',
    };
    
    // Add support for top-level await
    config.experiments = { 
      ...config.experiments, 
      topLevelAwait: true 
    };
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/socket.io/:path*',
        destination: '/api/socket',
      }
    ];
  },
  typescript: {
    // Enable this during development if you want to bypass TS errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable this during development if you want to bypass ESLint errors
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;