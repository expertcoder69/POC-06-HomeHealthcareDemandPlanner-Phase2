/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Note the added /api/:path* at the very end of the string
        destination: 'https://poc-06-homehealthcaredemandplanner-phase2.onrender.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;