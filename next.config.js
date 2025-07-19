const withSvgr = require('next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS loading
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/cms/plugins/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_FILE_API_URL}/static_files/tours/tour01/Con_Dao/plugins/:path*`,
  //     },
  //   ];
  // },
};

module.exports = withSvgr(nextConfig); 
