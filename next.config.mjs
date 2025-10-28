/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'static.vecteezy.com',
            port: '',
          },
        ],
        dangerouslyAllowSVG: true,
      },
};

export default nextConfig;
