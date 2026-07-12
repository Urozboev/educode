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
  // Qisqa /blog URL — kontent /explore/blog dan (explore navbar bilan)
  async rewrites() {
    return [
      { source: '/blog', destination: '/explore/blog' },
      { source: '/blog/:slug', destination: '/explore/blog/:slug' },
    ];
  },
  // Sahifalar tezligi
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

module.exports = nextConfig;
