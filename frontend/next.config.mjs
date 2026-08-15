/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          // Proxies requests to the Docker Service Name 'backend'
          destination: 'https://poc-06-homehealthcaredemandplanner-phase2.onrender.com', 
        },
      ];
    },
  };
  
  export default nextConfig;