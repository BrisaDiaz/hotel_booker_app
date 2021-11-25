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
import { checkRoomsAvailable } from '../utils/index';

import { UserInputError, ValidationError } from 'apollo-server-micro';

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
  members: ['ACTIVE', 'CANCELED', 'FINISH'],
});
export const BookingRequestStatus = enumType({
  name: 'BookingRequestStatus',
  members: ['PENDING', 'DECLINED'],
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
    t.int('children');
    t.int('adults');
    t.int('rooms');
    t.int('checkInDate');
    t.int('checkOutDate');
    t.string('specifications');
    t.field('guestsDistribution', { type: GuestsDistribution });
    t.field('status', { type: 'BookingStatus' });
    t.float('totalCost');
    t.field('paymentMethod', { type: 'PaymentMethod' });
  },
});
export const BookingRequest = objectType({
  name: 'BookingRequest',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.int('userId');
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
    t.field('user', {
      type: 'User',
      resolve(root) {
        return prisma.user.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });
    t.field('guestsDistribution', { type: GuestsDistribution });
    t.int('telephone');
    t.string('email');
    t.int('children');
    t.int('adults');
    t.int('checkInDate');
    t.int('checkOutDate');
    t.string('specifications');
    t.field('status', { type: BookingRequestStatus });
  },
});
export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('makeBookingRequest', {
      type: BookingRequest,
      args: {
        roomModelId: nonNull(idArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        cellularNumber: nonNull(stringArg()),
        homePhoneNumber: nonNull(stringArg()),
        guestsDistribution: nonNull(list(roomSpecifications)),

        children: nonNull(intArg()),
        adults: nonNull(intArg()),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        specifications: nonNull(stringArg()),
      },
      resolve(root, args, ctx) {
        async function makeRequest(args) {
          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: args.roomModelId,
            },
          });
          if (!roomModel) throw new UserInputError('Room type dose not exist.');

          const client = await await prisma.client.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              cellularNumber: args.cellularNumber,
              homePhoneNumber: args.homePhoneNumber,
            },
          });
          const request = await prisma.bookingRequest.create({
            data: {
              clientId: client.id,
              roomModelId: roomModel.id,
              hotelId: roomModel.hotelId,
              checkInDate: new Date(args.checkInDate).toISOString(),
              checkOutDate: new Date(args.checkOutDate).toISOString(),
              specifications: args.specifications,
            },
          });
          await prisma.guestsDistribution.createMany({
            data: args.guestsDistribution.map(
              (room: { children: number; adults: number }) => ({
                children: room.children,
                adults: room.adults,
                bookingRequest: { connect: { id: request.id } },
              })
            ),
          });
        }
        return makeRequest();
      },
    });
  },
});
