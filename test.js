function getHourFormated(toFormate) {
  const date = new Date(toFormate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  `${hours}:${minutes}:${seconds}`;
  const hour = date.toLocaleTimeString();
  return date.toLocaleDateString();
}
console.log(getHourFormated(Date.now()));
