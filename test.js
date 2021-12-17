function extractPublicIdFromUrl(imageUrl) {
  const pathOnly = imageUrl.slice(0, imageUrl.lastIndexOf('.'));
  const splitUrl = pathOnly.split('/');
  const imageName = splitUrl[splitUrl.length - 1];
  return imageName;
}
const imageUrl =
  'https://res.cloudinary.com/myproyects/image/upload/v1639118189/bq2fmc0di8jd9ijcx5oj.jpg';
console.log(extractPublicIdFromUrl(imageUrl));
