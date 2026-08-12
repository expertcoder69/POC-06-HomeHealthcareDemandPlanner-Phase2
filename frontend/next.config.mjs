/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          // Proxies requests to the Docker Service Name 'backend'
          destination: 'http://backend:8000/api/:path*', 
        },
      ];
    },
  };
  
  export default nextConfig;