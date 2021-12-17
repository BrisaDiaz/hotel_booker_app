import cloudinary from '@/lib/cloudinary';

function extractPublicIdFromUrl(imageUrl: string): string {
  const pathOnly = imageUrl.slice(0, imageUrl.lastIndexOf('.'));
  const splitUrl = pathOnly.split('/');
  const imageName = splitUrl[splitUrl.length - 1];
  return imageName;
}
export async function deleteImage(imageUrl: string) {
  const publicId = extractPublicIdFromUrl(imageUrl);
  try {
    await cloudinary.v2.uploader.destroy(publicId, function (result) {
      console.log(result);
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}
