const withSvgr = require('next-plugin-svgr');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Bạn có thể thêm các config khác ở đây nếu cần
};

module.exports = withSvgr(nextConfig); 
