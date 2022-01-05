
import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import  env  from '@/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {

 const signature = await cloudinary.v2.utils.api_sign_request( {key:env.CLOUDINARY_API_KEY}, env.CLOUDINARY_API_SECRET)
   return res.status(200).json({
      success: true,
      signature,
    })
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || error || 'Server side error',
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
