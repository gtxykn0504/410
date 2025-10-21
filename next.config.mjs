/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/log',
        destination: '/log/begin',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
