import {
  objectType,
  extendType,
  stringArg,
  intArg,
  idArg,
  list,
  nonNull,
  floatArg,
} from 'nexus';
import { prisma } from '@/lib/prisma';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';
import {
  getAdminInfo,
  verifyIsHotelAdmin,
  checkRoomsAvailable,
  checkIsValidRoomRequest,
  clientQueryConstructor,
  MultipleClientQuery,
  SingleClientQuery,
  bookingRequestQueryConstructor,
  schechuleBookingStatusUpdate,
  bookingQueryConstructor,
  BookingRequestQueryArgs,
  SingleBookingRequestQuery,
  MultipleBookingRequestQuery,
  BookingQueryArgs,
} from '../utils/index';
import { roomSpecifications, Client } from './Booking';
import { searchFilter } from './Commun';

export const AdminHotels = objectType({
  name: 'AdminHotels',
  definition(t) {
    t.list.field('hotels', {
      type: 'Hotel',
    });
    t.int('hotelsCount');
  },
});
export const GuestSearch = objectType({
  name: 'GuestSearch',
  definition(t) {
    t.list.field('guests', {
      type: 'Client',
    });
    t.int('totalResults');
  },
});
export const RequestSearch = objectType({
  name: 'RequestSearch',
  definition(t) {
    t.list.field('requests', {
      type: 'BookingRequest',
    });
    t.int('totalResults');
    t.int('pageCount');
  },
});
export const HotelData = objectType({
  name: 'HotelData',
  definition(t) {
    t.id('id');
    t.int('roomModelsCount');
    t.int('requestsCount');
    t.int('bookingsCount');
    t.int('guestsCount');
    t.list.field('roomModels', {
      type: 'RoomModel',
      resolve(root: any, args, ctx): any {
        return prisma.roomModel.findMany({
          where: {
            hotelId: root.id,
          },
        });
      },
    });
    t.list.field('requests', {
      type: 'BookingRequest',
      resolve(root: any, args, ctx): any {
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
      resolve(root: any): any {
        return prisma.booking.findMany({
          where: {
            hotelId: root.id,
            OR: [{ status: 'ACTIVE' }, { status: 'FINISHED' }],
          },
          include: {
            client: true,
            guestsDistribution: true,
          },
        });
      },
    });
    t.list.field('guests', {
      type: list(Client),
      resolve(root: any): any {
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
export const GuestsSearchResult = objectType({
  name: 'GuestsSearchResult',
  definition(t) {
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
      resolve(root, args, ctx): any {
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
      resolve(root, args, ctx): any {
        const getAdimHotel = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

          const bookingsCount = await prisma.booking.count({
            where: {
              hotelId: hotelId,
            },
          });
          const roomModelsCount = await prisma.roomModel.count({
            where: {
              hotelId: hotelId,
            },
          });
          const guestsCount = await prisma.client.count({
            where: {
              bookings: {
                some: {
                  hotelId: hotelId,
                  status: 'ACTIVE',
                },
              },
            },
          });
          const requestsCount = await prisma.bookingRequest.count({
            where: {
              hotelId: hotelId,
              status: 'PENDING',
            },
          });
          return {
            id: hotelId,
            roomModelsCount,
            requestsCount,
            bookingsCount,
            guestsCount,
          };
        };
        return getAdimHotel(parseInt(args.userId), parseInt(args.hotelId));
      },
    });
    t.field('hotelRoomModels', {
      type: list('RoomModel'),
      args: {
        userId: nonNull(idArg()),
        hotelId: nonNull(idArg()),
      },
      resolve(root, args, ctx): any {
        const getAdimHotel = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);
          return prisma.roomModel.findMany({
            where: {
              hotelId: hotelId,
            },
          });
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
      resolve(root, args, ctx): any {
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

          const guests = bookings.map((booking: any) => booking.client);

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

    t.field('getRoomModelAvailableRooms', {
      type: list('Room'),
      args: {
        roomModelId: nonNull(idArg()),
        checkOutDate: nonNull(stringArg()),
        checkInDate: nonNull(stringArg()),
        rooms: nonNull(list(nonNull(roomSpecifications))),
      },
      resolve: (root, args: any, ctx): any => {
        return checkRoomsAvailable({
          roomModelId: parseInt(args.roomModelId),
          roomsRequired: args.rooms.length,
          checkOutDate: args.checkOutDate,
          checkInDate: args.checkInDate,
        });
      },
    });

    t.field('bookingById', {
      type: 'Booking',
      args: {
        bookingId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx): any {
        const getBooking = async (userId: number, bookingId: number) => {
          const admin = await getAdminInfo(userId);
          const booking = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
            include: {
              guestsDistribution: true,
              client: true,
            },
          });
          if (!booking) throw new UserInputError('Booking dose not exist');

          if (
            !admin.hotels.some(
              (hotel: { id: number }) => hotel.id === booking.hotelId
            )
          )
            throw new ForbiddenError('Forbidden');

          return booking;
        };
        return getBooking(parseInt(args.userId), parseInt(args.bookingId));
      },
    });
    t.field('hotelRequests', {
      type: RequestSearch,
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
        sort: stringArg(),
        search: searchFilter,
        take: intArg({ default: 8 }),
        skip: intArg({ default: 0 }),
      },
      resolve(root, args, ctx): any {
        const getRequests = async (
          userId: number,
          hotelId: number,
          args: any
        ) => {
          await verifyIsHotelAdmin(userId, hotelId);
          const query = bookingRequestQueryConstructor(
            hotelId,
            args as BookingRequestQueryArgs
          );

          if ('id' in query.where) {
            const request = await prisma.bookingRequest.findUnique(
              query as SingleBookingRequestQuery
            );
            if (
              request &&
              request.status === 'PENDING' &&
              request.hotelId === hotelId
            ) {
              return {
                requests: [request],
                totalResults: request ? 1 : 0,
                pageCount: 1,
              };
            }
            return {
              requests: [],
              totalResults: 0,
              pageCount: 1,
            };
          }

          const totalResults = await prisma.bookingRequest.count({
            where: query.where,
          });
          const requests = await prisma.bookingRequest.findMany(
            query as MultipleBookingRequestQuery
          );

          const pageCount: number =
            'take' in query ? Math.floor(totalResults / query.take) : 1;
          return { requests, totalResults, pageCount };
        };

        return getRequests(parseInt(args.userId), parseInt(args.hotelId), args);
      },
    });

    t.field('hotelBookings', {
      type: list('Booking'),

      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
        status: stringArg(),
        from: stringArg(),
        until: stringArg(),
      },
      resolve(root, args, ctx): any {
        const getBookings = async (
          userId: number,
          hotelId: number,
          args: any
        ) => {
          await verifyIsHotelAdmin(userId, hotelId);

          const query = bookingQueryConstructor(
            hotelId,
            args as BookingQueryArgs
          );

          return prisma.booking.findMany(query);
        };
        return getBookings(parseInt(args.userId), parseInt(args.hotelId), args);
      },
    });

    t.field('hotelGuests', {
      type: GuestSearch,
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
        sort: stringArg(),
        search: searchFilter,
        take: intArg({ default: 6 }),
        skip: intArg({ default: 0 }),
      },
      resolve(root, args, ctx): any {
        const getGuests = async (
          userId: number,
          hotelId: number,
          args: any
        ) => {
          await verifyIsHotelAdmin(userId, hotelId);
          const query = clientQueryConstructor(hotelId, args);
          if ('clientId' in query.where.bookings.some) {
            const guests = await prisma.client.findMany(
              query as SingleClientQuery
            );
            return { guests, totalResults: 1 };
          }
          const totalResults = await prisma.client.count({
            where: query?.where,
          });

          const guests = await prisma.client.findMany(
            query as MultipleClientQuery
          );

          return { guests, totalResults };
        };

        return getGuests(parseInt(args.userId), parseInt(args.hotelId), args);
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
        roomModelId: nonNull(idArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
        specifications: stringArg(),
        guestsDistribution: list(roomSpecifications),
        roomsIds: nonNull(list(nonNull(intArg()))),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx): any {
        const makeBooking = async (
          userId: number,
          roomModelId: number,
          args: any
        ) => {
          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: roomModelId,
            },
          });
          if (!roomModel) throw new UserInputError('Room type dose not exist.');
          const hotelId = roomModel.hotelId;
          const admin = await verifyIsHotelAdmin(userId, hotelId);
          const availabilityResponce = await checkIsValidRoomRequest({
            roomDetails: roomModel,
            rooms: args.guestsDistribution,
            checkOutDate: args.checkOutDate,
            checkInDate: args.checkInDate,
          });

          if (!availabilityResponce.isAvailable)
            throw new UserInputError('There is not enought rooms available.');

          const { children, adults, nights, guestsDistribution } =
            availabilityResponce.requestData;

          const client = await prisma.client.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              mobileNumber: args.mobileNumber,
              landlineNumber: args.landlineNumber,
            },
          });
          const booking = await prisma.booking.create({
            data: {
              clientId: client.id,
              hotelId: hotelId,
              roomModelId: roomModelId,
              administratorId: admin.id,
              specifications: args.specifications,
              children,
              adults,
              nights,
              checkInDate: new Date(args.checkInDate),
              checkOutDate: new Date(args.checkOutDate),
              paymentMethod: args.paymentMethod,
              totalCost: args.totalCost,
              status: 'ACTIVE',
            },
          });
          const roomPromises = args.roomsIds.map((id: number) =>
            prisma.room.update({
              where: {
                id: id,
              },
              data: {
                bookings: {
                  connect: { id: booking.id },
                },
              },
            })
          );
          await Promise.all(roomPromises);
          await prisma.guestsDistribution.createMany({
            data: guestsDistribution.map(
              (room: { children: number; adults: number }) => ({
                children: room.children,
                adults: room.adults,
                bookingId: booking.id,
              })
            ),
          });
          schechuleBookingStatusUpdate(
            booking.id,
            'FINISHED',
            booking.checkOutDate
          );
          return booking;
        };
        return makeBooking(
          parseInt(args.userId),
          parseInt(args.roomModelId),
          args
        );
      },
    });
    t.field('confirmBookingRequest', {
      type: 'Booking',
      args: {
        userId: nonNull(idArg()),
        bookingRequestId: nonNull(idArg()),
        roomsIds: nonNull(list(nonNull(intArg()))),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx): any {
        const makeBooking = async (
          userId: number,
          bookingRequestId: number,
          args: any
        ) => {
          const bookingRequest = await prisma.bookingRequest.findUnique({
            where: {
              id: bookingRequestId,
            },
            include: {
              guestsDistribution: true,
            },
          });
          if (!bookingRequest)
            throw new UserInputError('Invalid booking request identifyer.');
          const admin = await verifyIsHotelAdmin(
            userId,
            bookingRequest.hotelId
          );

          const roomsAvailables = await checkRoomsAvailable({
            roomModelId: bookingRequest.roomModelId,
            checkInDate: bookingRequest.checkInDate.toString(),
            checkOutDate: bookingRequest.checkOutDate.toString(),
            roomsRequired: bookingRequest.guestsDistribution.length,
          });

          if (!roomsAvailables.length)
            throw new UserInputError('There is not enought rooms available.');

          const roomsAvailablesIds = roomsAvailables.map(
            (room: { id: number }) => room.id
          );
          const matchRoomsRequestedWithAvailablesOnes = args.roomsIds.every(
            (id: number) => roomsAvailablesIds.includes(id)
          );

          if (!matchRoomsRequestedWithAvailablesOnes)
            throw new UserInputError(
              'Some of the requested rooms is not available.'
            );

          const booking = await prisma.booking.create({
            data: {
              client: {
                connect: { id: bookingRequest.clientId },
              },
              hotelId: bookingRequest.hotelId,
              roomModelId: bookingRequest.roomModelId,
              administratorId: admin.id,
              specifications: bookingRequest.specifications,
              children: bookingRequest.children,
              adults: bookingRequest.adults,
              nights: bookingRequest.nights,
              checkInDate: new Date(bookingRequest.checkInDate),
              checkOutDate: new Date(bookingRequest.checkOutDate),
              paymentMethod: args.paymentMethod,
              totalCost: args.totalCost,
              status: 'ACTIVE',
            },
          });
          const roomPromises = args.roomsIds.map((id: number) =>
            prisma.room.update({
              where: {
                id: id,
              },
              data: {
                bookings: {
                  connect: { id: booking.id },
                },
              },
            })
          );
          await Promise.all(roomPromises);
          await prisma.guestsDistribution.updateMany({
            where: {
              bookingRequestId: bookingRequest.id,
            },
            data: {
              bookingId: booking.id,
            },
          });
          const createdBooking = await prisma.bookingRequest.update({
            where: {
              id: bookingRequestId,
            },
            data: {
              status: 'ACCEPTED',
            },
          });
          schechuleBookingStatusUpdate(
            createdBooking.id,
            'FINISHED',
            createdBooking.checkOutDate
          );
          return createdBooking;
        };
        return makeBooking(
          parseInt(args.userId),
          parseInt(args.bookingRequestId),
          args
        );
      },
    });
    t.field('declineBookingRequest', {
      type: 'BookingRequest',
      args: {
        userId: nonNull(idArg()),
        bookingRequestId: nonNull(idArg()),
      },
      resolve(root, args, ctx): any {
        const declineRequest = async (userId: number, requestId: number) => {
          const request = await prisma.bookingRequest.findUnique({
            where: {
              id: requestId,
            },
          });
          if (!request)
            throw new UserInputError('Invalid booking request identifyer.');

          await verifyIsHotelAdmin(userId, request.hotelId);
          return prisma.bookingRequest.update({
            where: {
              id: requestId,
            },
            data: {
              status: 'DECLINED',
            },
          });
        };
        return declineRequest(
          parseInt(args.userId),
          parseInt(args.bookingRequestId)
        );
      },
    });
    t.field('cancelBooking', {
      type: 'CancelationDetails',
      args: {
        userId: nonNull(idArg()),
        bookingId: nonNull(idArg()),
        message: nonNull(stringArg()),
        cancelationFee: nonNull(floatArg()),
      },
      resolve(root, args, ctx): any {
        const declineRequest = async (
          userId: number,
          bookingId: number,
          args: any
        ) => {
          const booking = await prisma.booking.findUnique({
            where: {
              id: bookingId,
            },
          });
          const cancelationDetails = await prisma.cancelationDetails.create({
            data: {
              bookingId: bookingId,
              cancelationFee: args.cancelationFee,
              message: args.message,
            },
          });
          if (!booking) throw new UserInputError('Invalid booking identifyer.');
          if (booking.status !== 'ACTIVE')
            throw new UserInputError(
              'The operation can`t be made over a not active booking.'
            );
          await verifyIsHotelAdmin(userId, booking.hotelId);
          await prisma.booking.update({
            where: {
              id: bookingId,
            },
            data: {
              status: 'CANCELED',
            },
          });
          return cancelationDetails;
        };
        return declineRequest(
          parseInt(args.userId),
          parseInt(args.bookingId),
          args
        );
      },
    });
  },
});
