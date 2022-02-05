export function getFeaturesTags(features: { [key: string]: boolean | string }) {
  const kyes: string[] = Object.keys(features);
  const includedFeatures: string[] = kyes.filter(
    (featureName) =>
      features[featureName] === true && featureName !== '__typename'
  );

  const formattedAdditionalFeatures: string[] = includedFeatures.map(
    (featureName) => formatTagsToReadableString(featureName)
  );
  return formattedAdditionalFeatures;
}

export function formatTagsToReadableString(tag: string) {
  return tag
    .split(/(?=[A-Z])/)
    .join(' ')
    .toLowerCase();
}
