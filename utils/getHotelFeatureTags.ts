export function getFeaturesTags(features: { [key: string]: boolean | string }) {
  const kyes: string[] = Object.keys(features);
  const includedFeatures: string[] = kyes.filter(
    (featureName) =>
      features[featureName] !== true && featureName !== '__typename'
  );

  const formattedAdditonalFeatures: string[] = includedFeatures.map(
    (featureName) =>
      featureName
        .split(/(?=[A-Z])/)
        .join(' ')
        .toLowerCase()
  );
  return formattedAdditonalFeatures;
}
