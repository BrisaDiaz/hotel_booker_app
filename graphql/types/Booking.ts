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
import {
  checkRoomsAvailable,
  verifyIsHotelAdmin,
  checkIfClientExist,
  getAdminInfo,
} from '../utils';
import type { NextApiRequest } from 'next';
import {
  ForbiddenError,
  UserInputError,
  ValidationError,
} from 'apollo-server-micro';

export const Client = objectType({
  name: 'Client',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('cellularNumber');
    t.string('homePhoneNumber');
    t.list.field('bookings', { type: 'Booking' });
  },
});
export const RoomConsult = objectType({
  name: 'RoomConsultResponse',
  definition(t) {
    t.string('message');
    t.boolean('isAvailable');
  },
});
export const roomSpecifications = inputObjectType({
  name: 'roomSpecifications',
  definition(t) {
    t.int('adults'), t.int('childrens');
  },
});
export const ConsultMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('checkRoomAvailability', {
      type: 'RoomConsultResponse',
      args: {
        roomModelId: stringArg(),
        checkOutDate: stringArg(),
        checkInDate: stringArg(),
        rooms: list(roomSpecifications),
      },
      resolve: (root, args, ctx) => {
        type RoomSpecifications = {
          adults: number;
          children: number;
        };
        const makeConsult = async (args: {
          rooms: RoomSpecifications[];
          roomModelId: number;
          checkOutDate: string;
          checkInDate: string;
        }) => {
          const maximunNumerOfAdultsInARoom = Math.max(
            ...args.rooms.map((room) => room.adults)
          );
          const roomDetails = await prisma.roomModel.findUnique({
            where: {
              id: args.roomModelId,
            },
          });
          if (!roomDetails)
            throw new ValidationError('Invalid room type identifier');

          if (maximunNumerOfAdultsInARoom > roomDetails.maximunGuests)
            return {
              isAvailable: false,
              message: `The number of adults in the room most be equeal or inferior to ${roomDetails.maximunGuests}`,
            };
          const areEnoughRooms = await checkRoomsAvailable({
            roomModelId: args.roomModelId,
            checkOutDate: args.checkOutDate,
            checkInDate: args.checkInDate,
            roomsRequired: args.rooms.length,
          });
          if (!areEnoughRooms)
            return {
              isAvailable: false,
              message:
                'The number of rooms availables dose not match with the required',
            };
        };
        return makeConsult(args);
      },
    });
  },
});
export const BookingStatus = enumType({
  name: 'BookingStatus',
  members: ['ACTIVE', 'REJECTED', 'CANCELED'],
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
      resolve(root) {
        return prisma.hotel.findUnique({
          where: {
            id: root.hotelId,
          },
        });
      },
    });
    t.int('roomId');
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
    t.field('room', {
      type: 'Room',
      resolve(root) {
        return prisma.room.findUnique({
          where: {
            id: root.roomId,
          },
        });
      },
    });
    t.int('clientId');
    t.field('client', {
      type: 'Client',
      resolve(root) {
        return prisma.client.findUnique({
          where: {
            id: root.clientId,
          },
        });
      },
    });
    t.int('childrens');
    t.int('adults');
    t.int('rooms');
    t.int('checkInDate');
    t.int('checkOutDate');
    t.string('specifications');
    t.field('status', { type: 'BookingStatus' });
    t.field('paymentMethod', { type: 'PaymentMethod' });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('getBookingById', {
      type: 'Booking',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getBooking = async (req: NextApiRequest, bookingId: number) => {
          const booking = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
          });
          if (!booking) throw new ValidationError('Invalid Booking Id');
          const admin = await getAdminInfo(req);

          if (!admin.hotels.includes(booking.hotelId))
            throw new ForbiddenError('Forbidden');
          return booking;
        };
        return getBooking(ctx.req, args.id);
      },
    });
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('makeBooking', {
      type: 'Booking',
      args: {
        hotelId: nonNull(idArg()),
        roomId: nonNull(idArg()),
        rooModelId: nonNull(idArg()),
        clientId: nonNull(idArg()),
        childrens: nonNull(intArg()),
        adults: nonNull(intArg()),
        nights: nonNull(intArg()),
        rooms: nonNull(intArg()),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx) {
        const makeBooking = async (req: NextApiRequest, args: any) => {
          const admin = await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.booking.create({
            data: {
              clientId: args.clientId,
              hotelId: args.hotelId,
              roomId: args.roomId,
              roomModelId: args.roomModelId,
              administratorId: admin.id,
              specifications: args.specifications,
              childrens: args.childrens,
              adults: args.adults,
              nights: args.nights,
              checkInDate: new Date(args.checkInDate),
              checkOutDate: new Date(args.checkOutDate),
              paymentMethod: args.paymentMethod,
              status: 'ACTIVE',
            },
          });
        };
        return makeBooking(ctx.req, args);
      },
    });
    t.field('createNewClient', {
      type: 'Client',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        cellularNumber: nonNull(stringArg()),
        homePhoneNumber: nonNull(stringArg()),
      },
      resolve: (root, args, ctx) => {
        const createNewClient = async (req: NextApiRequest, args: any) => {
          await verifyIsHotelAdmin(req, args.hotelId);

          const foundClient = await checkIfClientExist(args.email);
          if (foundClient)
            throw new UserInputError(
              'Already exist a client account with this email.'
            );

          return await prisma.client.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              cellularNumber: args.cellularNumber,
              homePhoneNumber: args.homePhoneNumber,
            },
          });
        };
        return createNewClient(ctx.req, args);
      },
    });
  },
});
