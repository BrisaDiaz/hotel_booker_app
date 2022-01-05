import type { NextApiRequest, NextApiResponse } from 'next';
import cloudinary from '@/lib/cloudinary';
import {UploadApiResponse} from 'cloudinary'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const formidable = require('formidable-serverless');
import fs from 'fs';
import env from '@/env'
const form = formidable({
  keepExtensions: true,
  multiples: true,
  filter: function ({ mimetype }: { mimetype: string }) {
    return mimetype && mimetype.includes('image');
  },
});

interface FormidableFile {
  [key: string]: {
    name: string;
    path: string;
    type: string;
  };
}
async function deleteLocalFiles(paths: string[]) {
  paths.forEach((path) => fs.unlinkSync(path));
}
async function upload(paths: string[]) {
  const imgePromices = paths.map((path) => cloudinary.v2.uploader.upload(path));
  const imagesUploaded:UploadApiResponse[] =[]
await Promise.all(imgePromices).then((img:any )=> {
  imagesUploaded.push(img)
}, error => {
  throw new Error(error.message);
});
  return imagesUploaded;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    //// store images inside ./temp_media_storage folder and return the path

    const filesPaths: string[] = await new Promise(function (resolve, reject) {
      form.parse(req, async (err: any, fields: any, files: FormidableFile) => {
        if (err) reject(err?.message || err);
        const filesKeys = Object.keys(files);
        const pahts: string[] = filesKeys.map((key) => files[key].path);
        resolve(pahts);
      });
    });
    //// upload to cloudinary
if(!filesPaths.length)   return res.status(400).json({
      success: false,
      message: 'No image was provided.',
    });
    const images = await upload(filesPaths);
    /// delete images from ./public/uploads folder

    if (images.length && env.NODE_ENV!=='production') await deleteLocalFiles(filesPaths);

    return res.status(200).json({
      success: true,
      images,
    });
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
