export function toDateAndHourFormat(toFormate: number): string {
  const date = new Date(toFormate * 1);
  const [hour, minutes] = date.toLocaleTimeString().split(':');
  const fullDate = date.toLocaleDateString();
  return `${fullDate}${'   '}${hour}:${minutes}hs`;
}
