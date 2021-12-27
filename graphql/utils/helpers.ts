import { prisma } from '../../lib/prisma';

async function checkRoomsAvailable({
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

  const roomsWithRequiredDatesAvailables = await prisma.room.findMany({
    where: {
      roomModelId: roomModelId,
      NOT: [
        {
          bookings: {
            some: {
              checkInDate: { in: requiredDates },
              status: { equals: 'ACTIVE' },
            },
          },
        },
        {
          bookings: {
            some: {
              checkOutDate: { in: requiredDates },
              status: { equals: 'ACTIVE' },
            },
          },
        },
      ],
    },
  });

  /// check if there is the number of rooms required
  if (roomsWithRequiredDatesAvailables.length < roomsRequired) return [];

  return roomsWithRequiredDatesAvailables;
}
async function checkIsValidRoomRequest({
  roomDetails,
  rooms,
  checkOutDate,
  checkInDate,
}: {
  roomDetails: any;
  rooms: Array<{
    children: number;
    adults: number;
  }>;
  checkOutDate: string;
  checkInDate: string;
}) {
  const totalNights = inBetweenDates([checkInDate, checkOutDate]).length;

  const totalChildren = rooms.reduce(
    (acum, room) => (acum += room.children),
    0
  );
  const totalAdults = rooms.reduce((acum, room) => (acum += room.adults), 0);
  const guestPerRoom = rooms.map((room) => room.adults + room.children);

  if (roomDetails.maximunNights > 0 && totalNights > roomDetails.maximunNights)
    return {
      isAvailable: false,
      message: `The limit of nights to reserve the room is ${roomDetails.maximunNights}.`,
      requestData: {
        nights: totalNights,
        totalRooms: rooms.length,
        guestsDistribution: rooms,
        adults: totalAdults,
        children: totalChildren,
      },
    };

  if (guestPerRoom.some((guests: number) => guests > roomDetails.maximunGuests))
    return {
      isAvailable: false,
      message: `The number of guest in a room most be equeal or inferior to ${roomDetails.maximunGuests}.`,
      requestData: {
        nights: totalNights,
        checkInDate,
        checkOutDate,
        totalRooms: rooms.length,
        guestsDistribution: rooms,
        adults: totalAdults,
        children: totalChildren,
      },
    };

  const availableRooms = await checkRoomsAvailable({
    roomModelId: roomDetails.id,
    checkOutDate,
    checkInDate,
    roomsRequired: rooms.length,
  });

  if (!availableRooms.length)
    return {
      isAvailable: false,
      rooms: availableRooms,
      message: 'The number of rooms availables dose not match the required.',
      requestData: {
        nights: totalNights,
        checkInDate,
        checkOutDate,
        totalRooms: rooms.length,
        guestsDistribution: rooms,
        adults: totalAdults,
        children: totalChildren,
      },
    };

  return {
    isAvailable: true,
    message: 'The rooms requests are available.',
    requestData: {
      nights: totalNights,
      checkInDate,
      checkOutDate,
      totalRooms: rooms.length,
      guestsDistribution: rooms,
      adults: totalAdults,
      children: totalChildren,
    },
  };
}
function inBetweenDates(range: string[] | Date[]) {
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
function hotelQueryConstructor(args: HotelQueryArgs) {
  interface ArrayFilter {
    [key: string]: {
      some: { name: string };
    };
  }

  interface PropietyFilter {
    [key: string]: { equals: string };
  }

  type searchFilter = OneLevelSearch | TwoLevelsSearch;
  interface OneLevelSearch {
    [key: string]: {
      contains: string;
      mode: 'insensitive';
    };
  }
  interface TwoLevelsSearch {
    [key: string]: {
      [key: string]: {
        contains: string;
        mode: 'insensitive';
      };
    };
  }
  interface BooleanFilter {
    [key: string]: { [key: string]: boolean };
  }

  interface sortField {
    [key: string]: 'desc' | 'asc';
  }

  type OR = (PropietyFilter | searchFilter)[];
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
        ['category']: { equals: category },
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

  return query;
}
type ToEditHotelField =
  | 'address'
  | 'aspect'
  | 'staticFeatures'
  | 'dinamicFeatures'
  | 'genericData';

function getHotelFieldsToEdit(args: any): ToEditHotelField[] {
  let fields: ToEditHotelField[] = [];
  if (
    args.holeAddress ||
    args.postalCode ||
    args.holeAddress ||
    args.country ||
    args.administrativeArea ||
    args.city ||
    args.street
  ) {
    fields.push('address');
  }
  if (args.frameImage || args.interiorImage) {
    fields.push('aspect');
  }
  if (
    args.freeCancelation ||
    args.accessible ||
    args.familyFriendly ||
    args.petFriendly ||
    args.smokerFriendly
  ) {
    fields.push('staticFeatures');
  }
  if (args.facilities || args.services || args.activities || args.languages) {
    fields.push('dinamicFeatures');
  }
  if (
    args.name ||
    args.brand ||
    args.category ||
    args.email ||
    args.website ||
    args.toUpdateFields ||
    args.telephone ||
    args.lowestPrice ||
    args.taxesAndCharges ||
    args.checkInHour ||
    args.checkOutHour ||
    args.policiesAndRules ||
    args.description
  ) {
    fields.push('genericData');
  }
  return fields;
}

type ClientWhere = {
  bookings: {
    some: {
      hotelId: number;
      status: 'ACTIVE';
    };
  };
  AND?:
    | [
        | { email?: string }
        | { mobileNumber?: string }
        | { landlineNumber?: string }
        | {
            lastName?: {
              contains: string;
              mode: 'insensitive';
            };
          }
        | {
            firstName?: {
              contains: string;
              mode: 'insensitive';
            };
          }
      ];
};

type ClientField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'mobileNumber'
  | 'landlineNumber'
  | 'id';
type ClientQuery =
  | {
      orderBy: { [key: string]: string };
      take: number;
      skip: number;
      where: ClientWhere;
      include: {
        bookings: {
          where: {
            hotelId: number;
            status: string;
          };
        };
      };
    }
  | {
      where: {
        bookings: {
          some: {
            hotelId: number;
            status: string;
            clientId: number;
          };
        };
      };
      include: {
        bookings: {
          where: {
            hotelId: number;
            status: string;
          };
        };
      };
    };
function clientQueryConstructor(
  hotelId: number,
  args: {
    skip: number;
    take: number;
    search?: {
      field: ClientField;
      value: string;
    };
  }
): ClientQuery {
  let orderBy = { createdAt: 'desc' };
  let where: ClientWhere = {
    bookings: {
      some: {
        hotelId: hotelId,
        status: 'ACTIVE',
      },
    },
  };
  if (args.search) {
    if (args.search.field === 'id') {
      const query = {
        where: {
          bookings: {
            some: {
              hotelId: hotelId,
              status: 'ACTIVE',
              clientId: parseInt(args.search.value),
            },
          },
        },
        include: {
          bookings: {
            where: {
              hotelId: hotelId,
              status: 'ACTIVE',
            },
          },
        },
      };

      return query;
    }
    aplayDinamicFilters(args.search.field, args.search.value);
  }

  function aplayDinamicFilters(field: ClientField, value: string) {
    if (field === 'firstName' || field === 'lastName') {
      return (where['AND'] = [
        {
          [field]: {
            contains: value,
            mode: 'insensitive',
          },
        },
      ]);
    }
    return (where['AND'] = [
      {
        [field]: value,
      },
    ]);
  }

  const query = {
    orderBy: orderBy,
    take: args.take,
    skip: args.skip,
    where: where,
    include: {
      bookings: {
        where: {
          hotelId: hotelId,
          status: 'ACTIVE',
        },
      },
    },
  };
  console.log(query);
  return query;
}
type BookingRequestWhere = {
  hotelId: number;
  status: string;
  some?:
    | {
        client?: { email: string };
      }
    | {
        client?: {
          firstName?: string;
          lastName?: string;
        };
      }
    | {
        roomModel: {
          name: string;
        };
      };
  createdAt?: Date;
  checkInDate?: Date;
  checkOutDate?: Date;
};
type BookingRequestField =
  | 'checkInDate'
  | 'checkOutDate'
  | 'createdAt'
  | 'clientName'
  | 'clientEmail'
  | 'roomModel'
  | 'id';
type BookingRequestQuery =
  | {
      orderBy: { [key: string]: string };
      take: number;
      skip: number;
      where: BookingRequestWhere;
      include: {
        roomModel: boolean;
        guestsDistribution: boolean;
      };
    }
  | {
      where: {
        id: number;
      };
      include: {
        roomModel: boolean;
        guestsDistribution: boolean;
      };
    };
function bookingRequestQueryConstructor(
  hotelId: number,
  args: {
    skip: number;
    take: number;
    search?: {
      field: BookingRequestField;
      value: string;
    };
  }
): BookingRequestQuery {
  let where: BookingRequestWhere = {
    hotelId: hotelId,
    status: 'PENDING',
  };
  if (args.search) {
    if (args.search.field === 'id') {
      const query = {
        where: {
          id: parseInt(args.search.value),
        },
        include: {
          roomModel: true,
          guestsDistribution: true,
        },
      };
      return query;
    }
    aplayDinamicFilters(args.search.field, args.search.value);
  }

  function aplayDinamicFilters(field: BookingRequestField, value: string) {
    if (field === 'clientName') {
      const [firstName, lastName] = value.trim().split(' ');
      return (where['some'] = {
        client: {
          ['firstName']: firstName,
          ['lastName']: lastName,
        },
      });
    }
    if (field === 'clientEmail') {
      return (where['some'] = {
        client: {
          ['email']: value,
        },
      });
    }
    if (field === 'roomModel') {
      return (where['some'] = {
        roomModel: {
          ['name']: value,
        },
      });
    }
    if (
      field === 'createdAt' ||
      field === 'checkInDate' ||
      field === 'checkOutDate'
    ) {
      return (where[field] = new Date(value));
    }
  }
  const query = {
    take: args.take | 8,
    skip: args.skip | 0,
    orderBy: {
      createdAt: 'desc',
    },
    where: where,
    include: {
      roomModel: true,
      guestsDistribution: true,
    },
  };
  console.log(query);
  return query;
}

function schechuleBookingStatusUpdate(
  bookingId: number,
  newStatus: 'FINISHED' | 'CANCELED',
  date: Date
) {
  const currentDate = new Date();
  const schechuleDate = new Date(date);
  const timeToDate = schechuleDate.getTime() - currentDate.getTime();
  setTimeout(async () => {
    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: { status: newStatus },
    });
  }, timeToDate);
}
type BookingStatus = 'FINISHED' | 'CANCELED' | 'ACTIVE';
type BookingWhere = {
  hotelId: number;
  status?: BookingStatus;
  checkInDate?: {
    gte: Date;
  };
  checkOutDate?: {
    lte: Date;
  };
};
function bookingQueryConstructor(
  hotelId: number,
  args: {
    from?: string;
    until?: string;
    status: string;
  }
): {
  where: BookingWhere;
} {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  let where: BookingWhere = {
    hotelId: hotelId,
    checkInDate: {
      gte: firstDayOfMonth,
    },
    checkOutDate: {
      lte: lastDayOfMonth,
    },
  };

  if (args.status === 'finished') {
    where['status'] = 'FINISHED';
  }
  if (args.status === 'canceled') {
    where['status'] = 'CANCELED';
  }
  if (args.status === 'active') {
    where['status'] = 'ACTIVE';
  }

  if (args.from) {
    where['checkInDate'] = {
      gte: new Date(args.from),
    };
  }
  if (args.until) {
    where['checkOutDate'] = {
      lte: new Date(args.until),
    };
  }

  const query = {
    where,
  };
  return query;
}
export {
  checkRoomsAvailable,
  checkIsValidRoomRequest,
  getHotelFieldsToEdit,
  hotelQueryConstructor,
  clientQueryConstructor,
  bookingRequestQueryConstructor,
  schechuleBookingStatusUpdate,
  bookingQueryConstructor,
};
