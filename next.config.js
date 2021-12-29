/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  publicRuntimeConfig: {
    env: {
      HOST: process.env.HOST,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    },
  },
};
