/** @type {import('next').NextConfig} */
const nextConfig = {
  // весь сайт будет жить под путём /cards
  basePath: '/cards',
  reactStrictMode: true,
  trailingSlash: false,
  // если используешь next/image с внешними доменами — добавь сюда remotePatterns
  images: { remotePatterns: [] },
};

export default nextConfig;
