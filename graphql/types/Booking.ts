import {
  objectType,
  extendType,
  intArg,
  stringArg,
  idArg,
  nonNull,
  enumType,
  list,
  inputObjectType,
} from 'nexus';
import { prisma } from '../../lib/prisma';
import { checkIsValidRoomRequest, checkRoomsAvailable } from '../utils/index';

import { UserInputError, ValidationError } from 'apollo-server-micro';

export const Client = objectType({
  name: 'Client',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('mobileNumber');
    t.string('landlineNumber');
    t.list.field('bookings', { type: 'Booking' });
  },
});
export const RoomConsultResponce = objectType({
  name: 'RoomConsultResponceResponce',
  definition(t) {
    t.string('message');
    t.boolean('isAvailable');
  },
});
export const roomSpecifications = inputObjectType({
  name: 'roomSpecifications',
  definition(t) {
    t.int('adults');
    t.int('children');
  },
});
export const GuestsDistribution = objectType({
  name: 'GuestsDistribution',
  definition(t) {
    t.id('id');
    t.int('adults');
    t.int('children');
  },
});

export const BookingStatus = enumType({
  name: 'BookingStatus',
  members: ['ACTIVE', 'CANCELED', 'FINISH'],
});
export const BookingRequestStatus = enumType({
  name: 'BookingRequestStatus',
  members: ['PENDING', 'DECLINED', 'ACCEPTED'],
});
export const PaymentMethod = enumType({
  name: 'PaymentMethod',
  members: [
    'CREDIT_CARD',
    'BILL_TO_ACCOUNT',
    'CASH',
    'DEBIT_CARD',
    'TRAVELER_CHECK',
  ],
});

export const Booking = objectType({
  name: 'Booking',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.field('hotel', {
      type: 'Hotel',
      resolve(root: { hotelId: number }) {
        return prisma.hotel.findUnique({
          where: {
            id: root.hotelId,
          },
        });
      },
    });

    t.int('roomModelId');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve(root) {
        return prisma.roomModel.findUnique({
          where: {
            id: root.roomModelId,
          },
        });
      },
    });
    t.field('reservedRooms', {
      type: list('Room'),
      resolve(root: { id: number }) {
        async function getRooms(bookingId: number) {
          const booking = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
            include: { rooms: true },
          });
          return booking ? booking.rooms : booking;
        }
        return getRooms(root.id);
      },
    });
    t.int('clientId');
    t.field('client', {
      type: 'Client',
      resolve(root: { clientId: number }) {
        return prisma.client.findUnique({
          where: {
            id: root.clientId,
          },
        });
      },
    });
    t.int('children');
    t.int('adults');
    t.string('checkInDate');
    t.string('checkOutDate');
    t.int('nights');
    t.string('specifications');
    t.list.field('guestsDistribution', {
      type: GuestsDistribution,
      resolve(root: { id: number }) {
        return prisma.guestsDistribution.findMany({
          where: {
            bookingId: root.id,
          },
        });
      },
    });
    t.field('status', { type: 'BookingStatus' });
    t.float('totalCost');
    t.field('paymentMethod', { type: 'PaymentMethod' });
    t.string('createdAt');
  },
});
export const BookingRequest = objectType({
  name: 'BookingRequest',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.int('clientId');
    t.int('roomModelId');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve(root) {
        return prisma.roomModel.findUnique({
          where: {
            id: root.roomModelId,
          },
        });
      },
    });
    t.field('client', {
      type: 'Client',
      resolve(root: { clientId: number }) {
        return prisma.client.findUnique({
          where: {
            id: root.clientId,
          },
        });
      },
    });
    t.list.field('guestsDistribution', {
      type: GuestsDistribution,
    });
    t.string('telephone');
    t.string('email');
    t.int('children');
    t.int('adults');
    t.string('checkInDate');
    t.string('checkOutDate');
    t.int('nights');
    t.string('specifications');
    t.field('status', { type: BookingRequestStatus });
    t.field('availableRooms', {
      type: list('Room'),
      resolve(root: {
        roomModelId: number;
        checkInDate: string;
        checkOutDate: string;
        guestsDistribution: Array<{ children: number; adults: number }>;
      }) {
        return checkRoomsAvailable({
          roomModelId: root.roomModelId,
          checkInDate: root.checkInDate,
          checkOutDate: root.checkOutDate,
          roomsRequired: root.guestsDistribution.length,
        });
      },
    });
    t.string('createdAt');
  },
});
export const ConsultQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('checkRoomAvailability', {
      type: RoomConsultResponce,
      args: {
        roomModelId: nonNull(idArg()),
        checkOutDate: nonNull(stringArg()),
        checkInDate: nonNull(stringArg()),
        rooms: nonNull(list(roomSpecifications)),
      },
      resolve: (root, args, ctx) => {
        type RoomSpecifications = {
          adults: number;
          children: number;
        };
        const makeConsult = async (
          roomModelId: number,
          args: {
            rooms: RoomSpecifications[];
            checkOutDate: string;
            checkInDate: string;
          }
        ) => {
          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: roomModelId,
            },
          });
          if (!roomModel)
            throw new ValidationError('Invalid room type identifier');
          const result = await checkIsValidRoomRequest({
            roomDetails: roomModel,
            rooms: args.rooms,
            checkOutDate: args.checkOutDate,
            checkInDate: args.checkInDate,
          });

          return { isAvailable: result.isAvailable, message: result.message };
        };
        return makeConsult(parseInt(args.roomModelId), args);
      },
    });
  },
});
export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('makeBookingRequest', {
      type: RoomConsultResponce,
      args: {
        roomModelId: nonNull(idArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
        guestsDistribution: nonNull(list(roomSpecifications)),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        specifications: stringArg(),
      },
      resolve(root, args, ctx) {
        async function makeRequest(roomModelId: number, args) {
          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: roomModelId,
            },
          });
          if (!roomModel) throw new UserInputError('Room type dose not exist.');
          const result = await checkIsValidRoomRequest({
            roomDetails: roomModel,
            rooms: args.guestsDistribution,
            checkOutDate: args.checkOutDate,
            checkInDate: args.checkInDate,
          });
          if (!result.isAvailable)
            return { isAvailtable: false, message: result.message };

          const client = await await prisma.client.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              mobileNumber: args.mobileNumber,
              landlineNumber: args.landlineNumber,
            },
          });
          const { children, adults, nights, guestsDistribution } =
            result.requestData;

          const booking = await prisma.bookingRequest.create({
            data: {
              clientId: client.id,
              roomModelId: roomModel.id,
              hotelId: roomModel.hotelId,
              checkInDate: new Date(args.checkInDate).toISOString(),
              checkOutDate: new Date(args.checkOutDate).toISOString(),
              specifications: args.specifications,
              nights,
              children,
              adults,
            },
          });
          await prisma.guestsDistribution.createMany({
            data: guestsDistribution.map(
              (room: { children: number; adults: number }) => ({
                children: room.children,
                adults: room.adults,
                bookingRequestId: booking.id,
              })
            ),
          });
          return {
            isAvailable: true,
            message: 'Your reservation request was sent successfully.',
          };
        }
        return makeRequest(parseInt(args.roomModelId), args);
      },
    });
  },
});
