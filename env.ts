import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  APP_SECRET: process.env.APP_SECRET,
  HOST: publicRuntimeConfig.HOST || process.env.HOST,
  CLOUDINARY_NAME:
    publicRuntimeConfig.CLOUDINARY_NAME || process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY:
    publicRuntimeConfig.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET:
    publicRuntimeConfig.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_API_SECRET,
};
export default env;
