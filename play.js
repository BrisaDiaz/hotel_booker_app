function inBetweenDates(range) {
  const [startDate, endDate] = range;
  const startDateInMiliseconds = new Date(startDate).getTime();
  const endDateInMiliseconds = new Date(endDate).getTime();
  const inBetweenPeriod = endDateInMiliseconds - startDateInMiliseconds;
  const aDayInMiliseconds = 24 * 60 * 60 * 1000;
  const InbetweenNumberOfDays = inBetweenPeriod / aDayInMiliseconds;

  const dates = new Array(InbetweenNumberOfDays)
    .fill(0)
    .map(
      (_, index) => new Date(startDateInMiliseconds + index * aDayInMiliseconds)
    );
  return dates;
}

function getDaysRequiredFilter(consult) {
  const datesBetween = inBetweenDates([
    consult.checkInDate,
    consult.checkOutDate,
  ]);
  let filter = [];

  datesBetween.forEach((date) => {
    filter.push({ bookings: { checkInDate: new Date(date) } });
    filter.push({ bookings: { checkOutDate: new Date(date) } });
  });

  return filter;
}

console.log(
  getDaysRequiredFilter({
    checkInDate: '2021/10/05',
    checkOutDate: '2021/11/15',
  })
);
