/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@ai-marketplace/shared-types'],
}

module.exports = nextConfig
