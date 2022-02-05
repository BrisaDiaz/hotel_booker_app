export function toCamelCase(string: string) {
  const toCamelCaseString = string
    .split(' ')
    .map((word, index) => {
      if (index > 0) {
        return word.charAt(0).toUpperCase() + word.substr(1);
      }
      return word;
    })
    .join('');
  return toCamelCaseString;
}
