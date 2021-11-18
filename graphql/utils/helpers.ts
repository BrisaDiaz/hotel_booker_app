import { prisma } from '../../lib/prisma';

export async function checkIfClientExist(clientEmail: string) {
  return await prisma.client.findUnique({
    where: {
      email: clientEmail,
    },
  });
}

export async function checkRoomsAvailable({
  roomModelId,
  checkInDate,
  checkOutDate,
  roomsRequired,
}: {
  roomModelId: number;
  checkInDate: string;
  checkOutDate: string;
  roomsRequired: number;
}) {
  const requiredDates = inBetweenDates([checkInDate, checkOutDate]);

  const roomOfTheType = await prisma.room.findMany({
    where: {
      roomModelId: roomModelId,
    },
    include: {
      bookings: true,
    },
  });
  /// filter rooms who's dates required are already reserved

  const roomsWithRequiredDatesAvailables = roomOfTheType.filter((room) =>
    room.bookings.some((booking) =>
      requiredDates.includes(
        new Date(booking.checkInDate) ||
          requiredDates.includes(new Date(booking.checkOutDate))
      )
    )
  );
  /// check if there is the number of rooms required
  if (roomsWithRequiredDatesAvailables.length < roomsRequired) return false;

  return true;
}

function inBetweenDates(range: string[]): Date[] {
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
interface HotelQueryArgs {
  facilities?: string[];
  activities?: string[];
  services?: string[];
  languages?: string[];
  categories?: string[];
  features?: string[];
  search?: string;
  sort?: string;
  skip?: number;
  take?: number;
}
export function hotelQueryConstructor(args: HotelQueryArgs) {
  interface ArrayFilter {
    [key: string]: {
      some: { name: string };
    };
  }

  interface PropietyFilter {
    [key: string]: { [key: string]: { equeals: string } };
  }
  interface searchFilter {
    [key: string]: {
      contains: string;
      mode: 'insensitive';
    };
  }
  interface BooleanFilter {
    [key: string]: { [key: string]: boolean };
  }

  interface sortField {
    [key: string]: 'desc' | 'asc';
  }

  type OR = (PropietyFilter | searchFilter | { [key: string]: searchFilter })[];
  type AND = (ArrayFilter | BooleanFilter)[];

  interface Query {
    orderBy: sortField[];
    where: {
      AND?: AND;
      OR?: OR;
    };
    take: number;
    skip?: number;
  }

  let ANDconditionals: AND = [];

  args.facilities?.length &&
    ANDconditionals.push(
      ...args.facilities.map((facility: string) => ({
        facilities: { some: { name: facility } },
      }))
    );
  args.activities?.length &&
    ANDconditionals.push(
      ...args.activities.map((activity: string) => ({
        activities: { some: { name: activity } },
      }))
    );

  args.services?.length &&
    ANDconditionals.push(
      ...args.services.map((service: string) => ({
        services: { some: { name: service } },
      }))
    );

  args.languages?.length &&
    ANDconditionals.push(
      ...args.languages.map((language: string) => ({
        languages: { some: { name: language } },
      }))
    );
  args.features?.length &&
    ANDconditionals.push(
      ...args.features.map((feature: string) => ({
        Features: { [feature]: true },
      }))
    );
  let ORconditionals: OR = [];

  args.categories?.length &&
    ORconditionals.push(
      ...args.categories.map((category: string) => ({
        category: { equals: category },
      }))
    );
  args.search &&
    ORconditionals.push({
      name: { contains: args.search, mode: 'insensitive' },
    }) &&
    ORconditionals.push({
      description: { contains: args.search, mode: 'insensitive' },
    }) &&
    ORconditionals.push({
      Address: { holeAddress: { contains: args.search, mode: 'insensitive' } },
    });

  let orderBy: sortField[] = [
    {
      lowestPrice: args?.sort === '-price' ? 'desc' : 'asc',
    },
  ];
  let query: Query = {
    orderBy: orderBy,
    where: {},
    take: args.take || 6,
    skip: args.skip || 0,
  };
  if (ANDconditionals.length) {
    query.where['AND'] = ANDconditionals;
  }
  if (ORconditionals.length) {
    query.where['OR'] = ORconditionals;
  }

  console.log(query);
  return query;
}
