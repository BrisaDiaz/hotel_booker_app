/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/signin',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/signin',
        permanent: false,
      },
    ];
  },
  publicRuntimeConfig: {
    env: {
      APP_SECRET: process.env.APP_SECRET,
    },
  },
};
