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
import { prisma } from '../../lib/prisma';

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
type Token = {
  user: User;
};
type HotelId = {
  id: number;
};
type AdminPayload = {
  id: number;
  hotels: HotelId[];
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
   if (!token)
    throw new AuthenticationError('Unauthenticated');
  const verifiedToken: any = await verify(token, APP_SECRET);
  if (!verifiedToken || !verifiedToken?.user)
    throw new ForbiddenError('Forbidden');
  return verifiedToken;
}
export async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<User | ApolloError> {
  const token = await verifyToken(req, res);
  return token.user;
}

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

  const isHotelAdmin = admin.hotels.find(
    (hotel: { id: number }) => hotel.id === hotelId
  );

  if (!isHotelAdmin) throw new ForbiddenError('Forbiden');
  return admin;
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
