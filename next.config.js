/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lovable.dev',
      },
    ],
  },
};

export default nextConfig;
