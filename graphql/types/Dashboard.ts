import {
  objectType,
  extendType,
  stringArg,
  intArg,
  idArg,
  list,
  nonNull,
  floatArg,
  booleanArg,
} from 'nexus';
import { prisma } from '../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from 'apollo-server-micro';
import {
  getAdminInfo,
  verifyIsHotelAdmin,
  checkIfClientExist,
} from '../utils/index';
import { roomSpecifications } from './Booking';

export const AdminHotels = objectType({
  name: 'AdminHotels',
  definition(t) {
    t.list.field('hotels', {
      type: 'Hotel',
    });
    t.int('hotelsCount');
  },
});

export const HotelData = objectType({
  name: 'HotelData',
  definition(t) {
    t.int('roomModelsCount');
    t.int('requestsCount');
    t.int('bookingCount');
    t.int('guestsCount');
    t.field('hotel', { type: 'Hotel' });
    t.list.field('roomModels', { type: 'RoomModel' });
    t.list.field('requests', { type: 'Booking' });
    t.list.field('bookings', { type: 'Booking' });
    t.list.field('guests', { type: 'Client' });
  },
});
export const RoomModelData = objectType({
  name: 'RoomModelData',
  definition(t) {
    t.int('roomsCount');
    t.field('rooms', { type: 'Room' });
    t.int('bookingsCount');
    t.list.field('bookings', { type: 'Booking' });
    t.int('guestsCount');
    t.list.field('guests', { type: 'Client' });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('adminHotels', {
      type: AdminHotels,
      resolve(root, args, ctx) {
        const getAdimHotels = async (
          req: NextApiRequest,
          res: NextApiResponse
        ) => {
          const admin = await getAdminInfo(req, res);
          const hotels = await prisma.hotel.findMany({
            where: {
              administratorId: admin.id,
            },
          });
          return { hotels, hotelsCount: hotels.length };
        };
        return getAdimHotels(ctx.req, ctx.res);
      },
    });
    t.field('hotelData', {
      type: HotelData,
      args: {
        hotelId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getAdimHotel = async (
          hotelId: number,
          req: NextApiRequest,
          res: NextApiResponse
        ) => {
          await verifyIsHotelAdmin(req, res, hotelId);

          const hotel = await prisma.hotel.findUnique({
            where: {
              id: hotelId,
            },
            include: {
              facilities: true,
              services: true,
              activities: true,
              languages: true,
              roomModels: true,
            },
          });
          if (!hotel)
            throw new UserInputError(
              'The hotel dose not exist or not belong to this account.'
            );
          const bookings = await prisma.booking.findMany({
            where: {
              hotelId: hotelId,
              OR: [{ status: 'ACTIVE' }, { status: 'FINISH' }],
            },
            include: {
              client: true,
            },
          });
          const guests = bookings.map((booking) => booking.client);
          const requests = await prisma.bookingRequest.findMany({
            where: {
              hotelId: hotelId,
              status: 'PENDING',
            },
            include: {
              roomModel: true,
              guestsDistribution: true,
            },
          });
          return {
            hotel,
            roomModels: hotel.roomModels,
            roomModelsCount: hotel.roomModels.length,
            requests,
            requestCount: requests.length,
            bookings,
            bookingsCount: bookings.length,
            guests,
            guestsCount: guests.length,
          };
        };
        return getAdimHotel(parseInt(args.hotelId), ctx.req, ctx.res);
      },
    });
    t.field('roomModelData', {
      type: RoomModelData,
      args: {
        roomModelId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getData = async (
          roomModelId: number,
          req: NextApiRequest,
          res: NextApiResponse
        ) => {
          const admin = await getAdminInfo(req, res);

          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: roomModelId,
            },
            include: {
              rooms: true,
              services: true,
              amenities: true,
            },
          });

          if (!roomModel)
            throw new UserInputError('The room type dose not exist .');
          const roomBelongsToAminHotel = admin.hotels.find(
            (hotel: { id: number }) => hotel.id === roomModel.hotelId
          );
          if (!roomBelongsToAminHotel)
            throw new UserInputError(
              'The room type dose not belong to this account.'
            );

          const bookings = await prisma.booking.findMany({
            where: {
              roomModelId: roomModel.id,
              status: 'ACTIVE',
            },
            include: {
              client: true,
            },
          });

          const guests = bookings.map((booking) => booking.client);

          return {
            roomModel,
            bookings,
            bookingsCount: bookings.length,
            rooms: roomModel.rooms,
            roomsCount: roomModel.rooms.length,
            guests,
            guestsCount: guests.length,
          };
        };
        return getData(parseInt(args.roomModelId), ctx.req, ctx.res);
      },
    });
    t.field('bookingById', {
      type: 'Booking',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getBooking = async (
          req: NextApiRequest,
          res: NextApiResponse,
          bookingId: number
        ) => {
          const booking = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
            include: {
              guestDistribution: true,
              rooms: true,
              client: true,
            },
          });
          if (!booking) throw new UserInputError('Booking dose not exist');
          const admin = await getAdminInfo(req, res);

          if (!admin.hotels.includes(booking.hotelId))
            throw new ForbiddenError('Forbidden');
          return booking;
        };
        return getBooking(ctx.req, ctx.res, args.id);
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
        children: nonNull(intArg()),
        guestsDistribution: list(roomSpecifications),
        adults: nonNull(intArg()),
        nights: nonNull(intArg()),
        rooms: nonNull(intArg()),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx) {
        const makeBooking = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          const admin = await verifyIsHotelAdmin(req, res, args.hotelId);
          return await prisma.booking.create({
            data: {
              clientId: args.clientId,
              hotelId: args.hotelId,
              roomId: args.roomId,
              roomModelId: args.roomModelId,
              administratorId: admin.id,
              specifications: args.specifications,
              children: args.children,
              adults: args.adults,
              nights: args.nights,
              guestsDistribution: args.guestsDistribution,
              checkInDate: new Date(args.checkInDate).toISOString(),
              checkOutDate: new Date(args.checkOutDate).toISOString(),
              paymentMethod: args.paymentMethod,
              totalCost: args.totalCost,
              status: 'ACTIVE',
            },
          });
        };
        return makeBooking(ctx.req, ctx.res, args);
      },
    });
    t.field('addNewClient', {
      type: 'Client',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        cellularNumber: nonNull(stringArg()),
        homePhoneNumber: nonNull(stringArg()),
      },
      resolve: (root, args, ctx) => {
        const createNewClient = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);

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
        return createNewClient(ctx.req, ctx.res, args);
      },
    });
  },
});
