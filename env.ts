import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const env: { [key: string]: string } = {
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/hotelBooker',
  APP_SECRET: process.env.APP_SECRET || 'auth_json_web_token_secret_key',
    BACKEND_URL: publicRuntimeConfig.BACKEND_URL || process.env.BACKEND_URL,
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
