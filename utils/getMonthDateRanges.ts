export function getMonthDateRanges(monthDate?: Date) {
  const date = monthDate || new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return [firstDayOfMonth, lastDayOfMonth];
}
