import { verify, sign } from 'jsonwebtoken';
import Cookies from 'cookies';
import { compare, hash, genSalt } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from 'apollo-server-micro';
import { prisma } from '../lib/prisma';

const { publicRuntimeConfig } = getConfig();

const APP_SECRET = publicRuntimeConfig.APP_SECRET || process.env.APP_SECRET;

export interface User {
  id: Number;
  role: Role;
}
enum Role {
  ADMIN,
  USER,
}
export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | ApolloError> {
  const token = await verifyToken(req, res);
  return token.user;
}

type Token = {
  user: User;
};
export function setCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) {
  const cookies = new Cookies(req, res);
  cookies.set('bookingApp-token', token, {
    httpOnly: true, // true by default
  });
}
export function getCookie(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  return cookies.get('bookingApp-token');
}
export function deleteCookie(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  cookies.set('bookingApp-token');
}
async function verifyToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Token | ApolloError> {
  const token = getCookie(req, res);
  const verifiedToken: any = await verify(token, APP_SECRET);
  if (!verifiedToken || !verifiedToken?.user)
    throw new ForbiddenError('Forbidden');
  return verifiedToken;
}
type HotelId = {
  id: number;
};
type AdminPayload = {
  id: number;
  hotels: HotelId[];
};
export async function getAdminInfo(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AdminPayload | ApolloError> {
  const user = await getUser(req, res);
  if (!user || user?.role !== 'ADMIN') throw new ForbiddenError('Forbiden');
  const admin = await prisma.administrator.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      hotels: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!admin) throw new ForbiddenError('Forbiden');
  return admin;
}
export async function verifyIsHotelAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
  hotelId: number
) {
  const admin = await getAdminInfo(req, res);
  const isHotelAdmin = admin.hotels.includes({
    id: hotelId,
  });
  if (!isHotelAdmin) throw new ForbiddenError('Forbiden');
  return admin;
}
export async function checkIfClientExist(clientEmail: string) {
  return await prisma.client.findUnique({
    where: {
      email: clientEmail,
    },
  });
}

export async function checkRoomsAvailable({
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

  const roomOfTheType = await prisma.room.findMany({
    where: {
      roomModelId: roomModelId,
    },
    include: {
      bookings: true,
    },
  });
  /// filter rooms who's dates required are already reserved

  const roomsWithRequiredDatesAvailables = roomOfTheType.filter((room) =>
    room.bookings.some((booking) =>
      requiredDates.includes(
        new Date(booking.checkInDate) ||
          requiredDates.includes(new Date(booking.checkOutDate))
      )
    )
  );
  /// check if there is the number of rooms required
  if (roomsWithRequiredDatesAvailables.length < roomsRequired) return false;

  return true;
}

function inBetweenDates(range: string[]): Date[] {
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
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashPassword = await hash(password, salt);
  return hashPassword;
}
export async function compirePassword({
  hash,
  plain,
}: {
  hash: string;
  plain: string;
}) {
  const match = await compare(plain, hash);
  return match;
}
export async function signToken(id: number, role: string) {
  const token = await sign({ user: { id: id, role: role } }, APP_SECRET);

  return token;
}
