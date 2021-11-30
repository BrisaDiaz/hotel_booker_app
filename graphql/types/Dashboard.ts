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
import { UserInputError, ForbiddenError } from 'apollo-server-micro';
import { getAdminInfo, verifyIsHotelAdmin } from '../utils/index';
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
    t.int('bookingsCount');
    t.int('guestsCount');
    t.field('hotel', { type: 'Hotel' });
    t.list.field('roomModels', { type: 'RoomModel' });
    t.list.field('requests', {
      type: 'BookingRequest',
      resolve(root: { id: number }, args, ctx) {
        return prisma.bookingRequest.findMany({
          where: {
            hotelId: root.id,
            status: 'PENDING',
          },
          include: {
            roomModel: true,
            guestsDistribution: true,
          },
        });
      },
    });
    t.list.field('bookings', {
      type: 'Booking',
      resolve(root: { id: number }) {
        return prisma.booking.findMany({
          where: {
            hotelId: root.id,
            OR: [{ status: 'ACTIVE' }, { status: 'FINISH' }],
          },
          include: {
            client: true,
          },
        });
      },
    });
    t.list.field('guests', {
      type: 'Client',
      resolve(root: { id: number }) {
        return prisma.client.findMany({
          where: {
            bookings: {
              some: {
                hotelId: root.id,
                status: 'ACTIVE',
              },
            },
          },
        });
      },
    });
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
      args: {
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getAdimHotels = async (userId: number) => {
          const admin = await getAdminInfo(userId);
          const hotels = await prisma.hotel.findMany({
            where: {
              administratorId: admin.id,
            },
          });
          return { hotels, hotelsCount: hotels.length };
        };
        return getAdimHotels(parseInt(args.userId));
      },
    });
    t.field('hotelData', {
      type: HotelData,
      args: {
        userId: nonNull(idArg()),
        hotelId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getAdimHotel = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

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
          const bookingsCount = await prisma.booking.count({
            where: {
              hotelId: hotelId,
              OR: [{ status: 'ACTIVE' }, { status: 'FINISH' }],
            },
          });

          const requestsCount = await prisma.bookingRequest.count({
            where: {
              hotelId: hotelId,
              status: 'PENDING',
            },
          });
          return {
            hotel,
            roomModels: hotel.roomModels,
            roomModelsCount: hotel.roomModels.length,
            requestsCount,
            bookingsCount,
            guestsCount: bookingsCount,
          };
        };
        return getAdimHotel(parseInt(args.userId), parseInt(args.hotelId));
      },
    });
    t.field('roomModelData', {
      type: RoomModelData,
      args: {
        userId: nonNull(idArg()),
        roomModelId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getData = async (userId: number, roomModelId: number) => {
          const admin = await getAdminInfo(userId);

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
        return getData(parseInt(args.userId), parseInt(args.roomModelId));
      },
    });
    t.field('bookingById', {
      type: 'Booking',
      args: {
        bookingId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getBooking = async (userId: number, bookingId: number) => {
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
          const admin = await getAdminInfo(userId);

          if (!admin.hotels.includes(booking.hotelId))
            throw new ForbiddenError('Forbidden');
          return booking;
        };
        return getBooking(parseInt(args.userId), parseInt(args.bookingId));
      },
    });
    t.field('hotelRequestsById', {
      type: 'Booking',
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getRequests = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

          return prisma.bookingRequest.findMany({
            where: {
              hotelId: hotelId,
              status: 'PENDING',
            },
            include: {
              roomModel: true,
              guestsDistribution: true,
            },
          });
        };
        return getRequests(parseInt(args.userId), parseInt(args.hotelId));
      },
    });
    t.field('hotelBookingsById', {
      type: 'Booking',
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getBookings = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

          return prisma.bookingRequest.findMany({
            where: {
              hotelId: hotelId,
              status: 'ACTIVE',
            },
            include: {
              roomModel: true,
              guestsDistribution: true,
            },
          });
        };
        return getBookings(parseInt(args.userId), parseInt(args.hotelId));
      },
    });
    t.field('hotelGuestsById', {
      type: 'Booking',
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getBookings = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

          return prisma.client.findMany({
            where: {
              bookings: {
                some: {
                  hotelId: root.id,
                  status: 'ACTIVE',
                },
              },
            },
          });
        };
        return getBookings(parseInt(args.userId), parseInt(args.hotelId));
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
        userId: nonNull(idArg()),
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
        const makeBooking = async (userId: number, args: any) => {
          const admin = await verifyIsHotelAdmin(
            userId,
            parseInt(args.hotelId)
          );
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
        return makeBooking(parseInt(args.userId), args);
      },
    });
    t.field('addNewClient', {
      type: 'Client',
      args: {
        userId: nonNull(idArg()),
        hotelId: nonNull(idArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
      },
      resolve: (root, args, ctx) => {
        const createNewClient = async (
          userId: number,
          hotelId: number,
          args: any
        ) => {
          await verifyIsHotelAdmin(userId, hotelId);

          return await prisma.client.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              mobileNumber: args.mobileNumber,
              landlineNumber: args.landlineNumber,
            },
          });
        };
        return createNewClient(
          parseInt(args.userId),
          parseInt(args.hotelId),
          args
        );
      },
    });
  },
});
