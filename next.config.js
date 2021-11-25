/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,

  publicRuntimeConfig: {
    env: {
      APP_SECRET: process.env.APP_SECRET,
    },
  },
};
