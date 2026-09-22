/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tekshiruv build'ini alohida papkaga yozish uchun:
  //   NEXT_DIST_DIR=.next-check npm run build
  // Aks holda build ishlab turgan `npm run dev` ning .next papkasini
  // ustidan yozadi va dev server hamma narsani qayta kompilyatsiya qiladi.
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
