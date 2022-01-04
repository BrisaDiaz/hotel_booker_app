import getConfig from 'next/config'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()


const env: { [key: string]: string } = {
   HOST: publicRuntimeConfig.NEXT_PUBLIC_HOST|| 'http://localhost:3000',
  BACKEND_URL: publicRuntimeConfig.NEXT_PUBLIC_BACKEND_URL|| 'http://localhost:3000/api/graphql',
    NODE_ENV: publicRuntimeConfig.NODE_ENV|| 'development',
  DATABASE_URL:
   serverRuntimeConfig.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/hotelBooker',
  APP_SECRET: serverRuntimeConfig.APP_SECRET || 'auth_json_web_token_secret_key',
  CLOUDINARY_NAME:serverRuntimeConfig.CLOUDINARY_NAME||'',
  CLOUDINARY_API_KEY: serverRuntimeConfig.CLOUDINARY_API_KEY||'',
  CLOUDINARY_API_SECRET: serverRuntimeConfig.CLOUDINARY_API_SECRET||'',
};
export default env;
