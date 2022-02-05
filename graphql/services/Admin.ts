import {
  getAdminInfo,
  getUserIdentity,
  verifyIsHotelAdmin,
  clientQueryConstructor,
  MultipleClientQuery,
  SingleClientQuery,
  bookingRequestQueryConstructor,
  bookingQueryConstructor,
  BookingRequestQueryArgs,
  SingleBookingRequestQuery,
  MultipleBookingRequestQuery,
  BookingQueryArgs,
} from '../utils/index';
import { prisma } from '@/lib/prisma';
export const getAdministrator = async (adminId: number) => {
  return prisma.administrator.findUnique({
    where: {
      id: adminId,
    },
  });
};
export const getAdminHotels = async (token: string) => {
  const user = await getUserIdentity(token);
  const admin = await getAdminInfo(user.id);
  const hotels = await prisma.hotel.findMany({
    where: {
      administratorId: admin.id,
    },
  });
  return { hotels, hotelsCount: hotels.length };
};
export const getHotelRequest = async (
  token: string,
  hotelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  await verifyIsHotelAdmin(user.id, hotelId);
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
export const getHotelBookings = async (
  token: string,
  hotelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  await verifyIsHotelAdmin(user.id, hotelId);

  const query = bookingQueryConstructor(hotelId, args as BookingQueryArgs);

  return prisma.booking.findMany(query);
};
export const getHotelGuests = async (
  token: string,
  hotelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  await verifyIsHotelAdmin(user.id, hotelId);
  const query = clientQueryConstructor(hotelId, args);
  if ('clientId' in query.where.bookings.some) {
    const guests = await prisma.client.findMany(query as SingleClientQuery);
    return { guests, totalResults: 1 };
  }
  const totalResults = await prisma.client.count({
    where: query?.where,
  });

  const guests = await prisma.client.findMany(query as MultipleClientQuery);

  return { guests, totalResults };
};
