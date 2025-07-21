import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  /* config for gh-pages deployment */
  output: 'export',
  // comment for custom domain
  // basePath: '/rStatoin',
  // assetPrefix: '/rStatoin',
  // trailingSlash: true,
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
};

export default nextConfig;
