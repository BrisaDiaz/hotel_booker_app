export function toDateAndHourFormat(toFormate: number): string {
  const date = new Date(toFormate);
  const hour = date.toLocaleTimeString();
  const fullDate = date.toLocaleDateString();
  return `${fullDate} ${hour}`;
}
