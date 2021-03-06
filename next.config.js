/** @type {import('next').NextConfig} */
module.exports = {
    swcMinify: true,
   async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },

      serverRuntimeConfig: {
       DATABASE_URL:
    process.env.DATABASE_URL,
         APP_SECRET: process.env.APP_SECRET,
   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
      NODE_ENV:process.env.NODE_ENV,
  },
  publicRuntimeConfig: {
NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
 
};
