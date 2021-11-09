import { verify, sign } from 'jsonwebtoken';
import { compare, hash, genSalt } from 'bcryptjs';
import type { NextApiRequest } from 'next';
import getConfig from 'next/config';
import {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from 'apollo-server-micro';
import { prisma } from '../lib/prisma';

const { publicRuntimeConfig } = getConfig();

const APP_SECRET = publicRuntimeConfig.APP_SECRET || process.env.APP_SECRET

export interface User {
  id: Number;
  role: Role;
}
enum Role {
  ADMIN,
  USER,
}
export async function getUser(
  req: NextApiRequest
): Promise<User | ApolloError> {
  const token = await verifyToken(req);
  return token.user;
}
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashPassword = await hash(password, salt);
  return hashPassword;
}
export async function compirePassword(
  storePassword: string,
  inputPassword: string
) {
  const match = await compare(inputPassword, storePassword);
  return match;
}
type Token = {
  user: User;
};
async function verifyToken(req: NextApiRequest): Promise<Token | ApolloError> {
  const Authorization = req.headers.authorization;
  if (!Authorization) throw new AuthenticationError('Unauthenticated');
  const token = Authorization.replace('Bearer ', '');
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
  req: NextApiRequest
): Promise<AdminPayload | ApolloError> {
  const user = await getUser(req);
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
export async function verifyIsHotelAdmin(req: NextApiRequest, hotelId: number) {
  const admin = await getAdminInfo(req);
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

export async function signToken(id: number, role: string) {
  const token = await sign({ user: { id: id, role: role } }, APP_SECRET);

  return token;
}
