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
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
    optimizeServerReact: true,
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  }
};

module.exports = nextConfig;