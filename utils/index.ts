export function getFormatedDate(toFormate: number): string {
  const date = new Date(toFormate);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = date.getFullYear();

  const formatedDate = yyyy + '/' + mm + '/' + dd;
  return formatedDate;
}
