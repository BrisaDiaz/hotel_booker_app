import { prisma } from '@/lib/prisma';
import {
  checkIsValidRoomRequest,
  checkRoomsAvailable,
  getUserIdentity,
  verifyIsHotelAdmin,
  scheduleBookingStatusUpdate,
  getAdminInfo,
} from '../utils/index';

import {
  ValidationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-micro';

export const makeBookingRequest = async (roomModelId: number, args: any) => {
  const roomModel = await prisma.roomModel.findUnique({
    where: {
      id: roomModelId,
    },
  });
  if (!roomModel) throw new ValidationError('Not Found');
  const result = await checkIsValidRoomRequest({
    roomDetails: roomModel,
    rooms: args.guestsDistribution,
    checkOutDate: args.checkOutDate,
    checkInDate: args.checkInDate,
  });
  if (!result.isAvailable)
    return { isAvailable: false, message: result.message };

  const client = await await prisma.client.create({
    data: {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      mobileNumber: args.mobileNumber,
      landlineNumber: args.landlineNumber,
    },
  });
  const { children, adults, nights, guestsDistribution } = result.requestData;

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
};
export const makeBooking = async (
  token: string,
  roomModelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  const roomModel = await prisma.roomModel.findUnique({
    where: {
      id: roomModelId,
    },
  });
  if (!roomModel) throw new ValidationError('Not Found');
  const hotelId = roomModel.hotelId;
  const admin = await verifyIsHotelAdmin(user.id, hotelId);
  const availabilityResponse = await checkIsValidRoomRequest({
    roomDetails: roomModel,
    rooms: args.guestsDistribution,
    checkOutDate: args.checkOutDate,
    checkInDate: args.checkInDate,
  });

  if (!availabilityResponse.isAvailable)
    throw new UserInputError('There is not enoughs rooms available.');

  const { children, adults, nights, guestsDistribution } =
    availabilityResponse.requestData;

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
  scheduleBookingStatusUpdate(booking.id, 'FINISHED', booking.checkOutDate);
  return booking;
};

export const cancelBooking = async (
  token: string,
  bookingId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
  const cancellationDetails = await prisma.cancellationDetails.create({
    data: {
      bookingId: bookingId,
      cancellationFee: args.cancellationFee,
      message: args.message,
    },
  });
  if (!booking) throw new ValidationError('Not Found');
  if (booking.status !== 'ACTIVE')
    throw new UserInputError(
      'The operation can`t be made over a not active booking.'
    );
  await verifyIsHotelAdmin(user.id, booking.hotelId);
  await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: 'CANCELED',
    },
  });
  return cancellationDetails;
};
export const confirmBooking = async (
  token: string,
  bookingRequestId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  const bookingRequest = await prisma.bookingRequest.findUnique({
    where: {
      id: bookingRequestId,
    },
    include: {
      guestsDistribution: true,
    },
  });
  if (!bookingRequest) throw new UserInputError('Not Found.');
  const admin = await verifyIsHotelAdmin(user.id, bookingRequest.hotelId);

  const roomsAvailable = await checkRoomsAvailable({
    roomModelId: bookingRequest.roomModelId,
    checkInDate: bookingRequest.checkInDate.toString(),
    checkOutDate: bookingRequest.checkOutDate.toString(),
    roomsRequired: bookingRequest.guestsDistribution.length,
  });

  if (!roomsAvailable.length)
    throw new UserInputError('There is not enoughs rooms available.');

  const roomsAvailableIds = roomsAvailable.map(
    (room: { id: number }) => room.id
  );
  const matchRoomsRequestedWithAvailableOnes = args.roomsIds.every(
    (id: number) => roomsAvailableIds.includes(id)
  );

  if (!matchRoomsRequestedWithAvailableOnes)
    throw new UserInputError('Some of the requested rooms is not available.');

  const booking = await prisma.booking.create({
    data: {
      client: {
        connect: { id: bookingRequest.clientId },
      },
      hotelId: bookingRequest.hotelId,
      roomModelId: bookingRequest.roomModelId,
      administratorId: admin.id,
      specifications: bookingRequest.specifications,
      children: bookingRequest.children || 0,
      adults: bookingRequest.adults || 1,
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
  scheduleBookingStatusUpdate(
    createdBooking.id,
    'FINISHED',
    createdBooking.checkOutDate
  );
  return createdBooking;
};
export const declineBookingRequest = async (
  token: string,
  requestId: number
) => {
  const request = await prisma.bookingRequest.findUnique({
    where: {
      id: requestId,
    },
  });
  if (!request) throw new UserInputError('Not Found');
  const user = await getUserIdentity(token);
  await verifyIsHotelAdmin(user.id, request.hotelId);
  return prisma.bookingRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: 'DECLINED',
    },
  });
};
export const getCancellationDetails = async (
  token: string,
  bookingId: number
) => {
  const user = await getUserIdentity(token);
  const admin = await getAdminInfo(user.id);
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
    !admin.hotels.some((hotel: { id: number }) => hotel.id === booking.hotelId)
  )
    throw new ForbiddenError('Forbidden');

  return booking;
};
export const getBooking = async (token: string, bookingId: number) => {
  const user = await getUserIdentity(token);
  const admin = await getAdminInfo(user.id);
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
    !admin.hotels.some((hotel: { id: number }) => hotel.id === booking.hotelId)
  )
    throw new ForbiddenError('Forbidden');

  return booking;
};
export const getBookingReserveRooms = async (bookingId: number) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: { rooms: true },
  });
  return booking ? booking.rooms : booking;
};
export const getBookingClient = (clientId: number) => {
  return prisma.client.findUnique({
    where: {
      id: clientId,
    },
  });
};
export const getBookingGuestsDistribution = async (bookingId: number) => {
  return prisma.guestsDistribution.findMany({
    where: {
      bookingId,
    },
  });
};
