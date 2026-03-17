/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tydufbtkbkefqcxxajdk.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  // Sahifalar tezligi
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
