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
import { prisma } from '../../lib/prisma';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';
import {
  getAdminInfo,
  verifyIsHotelAdmin,
  checkRoomsAvailable,
  checkIsValidRoomRequest,
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
            guestsDistribution: true,
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
      type: list('BookingRequest'),
      args: {
        hotelId: nonNull(idArg()),
        userId: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        const getRequests = async (userId: number, hotelId: number) => {
          await verifyIsHotelAdmin(userId, hotelId);

          const requests = await prisma.bookingRequest.findMany({
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              hotelId: hotelId,
              status: 'PENDING',
            },
            include: {
              roomModel: true,
              guestsDistribution: true,
            },
          });

          return requests;
        };
        return getRequests(parseInt(args.userId), parseInt(args.hotelId));
      },
    });
    t.field('hotelBookingsById', {
      type: list('Booking'),
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
      type: list('Booking'),
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
        roomModelId: nonNull(idArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
        guestsDistribution: list(roomSpecifications),
        roomsIds: nonNull(list(nonNull(intArg()))),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx) {
        const makeBooking = async (
          userId: number,
          hotelId: number,
          roomModelId: number,
          args: any
        ) => {
          const admin = await verifyIsHotelAdmin(userId, hotelId);
          const roomModel = await prisma.roomModel.findUnique({
            where: {
              id: roomModelId,
            },
          });
          if (!roomModel) throw new UserInputError('Room type dose not exist.');

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
              rooms: {
                connect: args.roomsIds.map((roomId: number) => ({
                  id: roomId,
                })),
              },
              status: 'ACTIVE',
            },
          });
          await prisma.guestsDistribution.createMany({
            data: guestsDistribution.map(
              (room: { children: number; adults: number }) => ({
                children: room.children,
                adults: room.adults,
                bookingId: booking.id,
              })
            ),
          });
          return booking;
        };
        return makeBooking(
          parseInt(args.userId),
          parseInt(args.hotelId),
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
      resolve(root, args, ctx) {
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
            checkInDate: bookingRequest.checkInDate,
            checkOutDate: bookingRequest.checkOutDate,
            roomsRequired: bookingRequest.guestsDistribution.length,
          });

          if (!roomsAvailables.length)
            throw new UserInputError('There is not enought rooms available.');

          const roomsAvailablesIds = roomsAvailables.map((room) => room.id);
          const matchRoomsRequestedWithAvailablesOnes = args.roomsIds.every(
            (id) => roomsAvailablesIds.includes(id)
          );

          if (!matchRoomsRequestedWithAvailablesOnes)
            throw new UserInputError(
              'Some of the requested rooms is not available.'
            );

          const booking = await prisma.booking.create({
            data: {
              clientId: bookingRequest.clientId,
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
              rooms: {
                connect: args.roomsIds.map((roomId: number) => ({
                  id: roomId,
                })),
              },
              status: 'ACTIVE',
            },
          });

          await prisma.guestsDistribution.updateMany({
            where: {
              bookingRequestId: bookingRequest.id,
            },
            data: {
              bookingId: booking.id,
            },
          });
          return booking;
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
      resolve(root, args, ctx) {
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
  },
});
// Invalid `prisma.booking.create()` invocation: { data: { clientId: 8, hotelId: 1, roomModelId: 1, administratorId: 1, specifications: 'It would seem like a no-brainer that you should be getting WIFI internet in today\'s world, but unless you ask for the password, chances are you won\'t be connected. Hotels don\'t have their WIFI open because if they did, people who are not guests would be able to connect and slow down the connection. So just ask when checking in what the password is, and you\'ll be hooked for the entire time you\'re at the hotel. Check and see if your hotel has free WIFI, as some want to charge for the service.', children: 1, adults: 2, nights: 8, checkInDate: new Date('2021-12-01T00:00:00.000Z'), checkOutDate: new Date('2021-12-09T00:00:00.000Z'), paymentMethod: 'CASH', totalCost: 0, rooms: { ~~~~~ connect: [ { id: 6 }, { id: 1 } ] }, status: 'ACTIVE' } } Unknown arg `rooms` in data.rooms for type BookingUncheckedCreateInput. Did you mean `roomId`? Available args: type BookingUncheckedCreateInput { id?: Int createdAt?: DateTime updatedAt?: DateTime clientId: Int hotelId: Int roomModelId: Int administratorId: Int children: Int adults: Int nights: Int checkInDate: DateTime checkOutDate: DateTime specifications: String totalCost: Int paymentMethod?: PaymentMethod status?: BookingStatus roomId?: Int | Null guestsDistribution?: GuestsDistributionUncheckedCreateNestedManyWithoutBookingInput }
