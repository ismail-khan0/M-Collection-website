/** @type {import('next').NextConfig} */
module.exports = {
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
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/socket.io/:path*',
        destination: '/api/socket', // Make sure this matches your API route
      }
    ]
  }
};