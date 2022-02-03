export type Quality = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;
export type AutoQuality = 'low' | 'eco' | 'good' | 'best';
export type Crop = 'pad' | 'lpad' | 'mpad' | 'fill_pad' | 'fill' | 'scale';
export interface TransformationParams {
  width?: number;
  height?: number;
  quality?: Quality;
  auto_quality?: AutoQuality;
  background?: string;
  aspect_ratio?: { width: number; height: number };
  crop?: Crop;
}

const generateTransformationTag = ({
  width,
  height,
  quality,
  auto_quality,
  background,
  aspect_ratio,
  crop,
}: TransformationParams) => {
  const params: string[] = ['f_auto'];
  quality
    ? params.push(`q_${quality}`)
    : auto_quality
    ? `q_auto_${auto_quality}`
    : params.push(`q_auto`);
  aspect_ratio &&
    params.push(
      `ac_${aspect_ratio.width}:${aspect_ratio.height},c_${crop || 'fill'}`
    );
  !aspect_ratio && params.push(`c_${crop || 'fill'}`);
  width ? params.push(`w_${width}`) : params.push(`w_auto`);
  height && params.push(`h_${height}`);
  background && params.push(`b_${background}`);
  return params.join(',');
};
const validateUrl = (url: string): boolean => {
  const CLOUDINARY_REGEX =
    /^.+\.cloudinary\.com\/(?:[^\/]+\/)(?:(image|video)\/)?(?:(upload|fetch)\/)?(?:(?:[^_/]+_[^,/]+,?)*\/)?(?:v(\d+|\w{1,2})\/)?([^\.^\s]+)(?:\.(.+))?$/;
  const matches = CLOUDINARY_REGEX.exec(url);
  return matches ? true : false;
};
export const generateImageUrl = (
  url: string,
  params?: TransformationParams
) => {
  if (!validateUrl(url)) return url;
  const transformationTag = generateTransformationTag(params || {});
  const urlArray = url.split('/');
  urlArray.splice(urlArray.indexOf('upload') + 1, 0, transformationTag);

  return urlArray.join('/');
};
