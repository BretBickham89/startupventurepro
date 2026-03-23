import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['ui-avatars.com', 'randomuser.me', 'images.unsplash.com'],
    unoptimized: false,
  },
}

export default nextConfig
