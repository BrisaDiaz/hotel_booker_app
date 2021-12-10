import cloudinary from '@/lib/cloudinary';

function extractPublicIdFromUrl(imageUrl: string): string {
  const splitUrl = imageUrl.split('.')[0].split('/');
  const publicId = splitUrl[splitUrl.length - 1];
  return publicId;
}
export async function deleteImage(imageUrl: string) {
  const publicId = extractPublicIdFromUrl(imageUrl);
  try {
    await cloudinary.v2.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.log(error);
  }
}
