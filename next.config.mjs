/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cards/bio',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
