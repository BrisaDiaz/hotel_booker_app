import { verify, sign } from 'jsonwebtoken';
import Cookies from 'cookies';
import { compare, hash, genSalt } from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import env from '@/env';
import {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} from 'apollo-server-micro';
import { prisma } from '@/lib/prisma';
const APP_AUTH_COOKIE_NAME = 'bookingApp-token';
export interface User {
  id: number;
  role: 'ADMIN' | 'USER';
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
type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export function setCookie(
  req: NextApiRequest,
  res: NextApiResponse,
  token: string
) {
  const cookies = new Cookies(req, res);
  const expireDate = new Date(Date.now() + 60 * 60 * 24 * 31);
  cookies.set(APP_AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    expires: expireDate,
  });
}
export function getCookie(req: NextApiRequest) {
  if (APP_AUTH_COOKIE_NAME in req.cookies && req.cookies[APP_AUTH_COOKIE_NAME])
    return req.cookies[APP_AUTH_COOKIE_NAME];
  return null;
}
export function deleteCookie(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res);
  cookies.set(APP_AUTH_COOKIE_NAME, null, { expires: new Date(Date.now()) });
}
async function verifyToken(token: string): Promise<Token | ApolloError> {
  const verifiedToken: any = await verify(token, env.APP_SECRET);

  if (!verifiedToken || !verifiedToken?.user)
    throw new ForbiddenError('Forbidden');
  return verifiedToken;
}

export async function getUserIdentity(
  token: string
): Promise<User | ApolloError> {
  const tokenPayload = await verifyToken(token);

  return tokenPayload.user;
}

export async function getAdminInfo(
  userId: number
): Promise<AdminPayload | ApolloError> {
  if (!userId) throw new AuthenticationError('Unauthenticated');
  const admin = await prisma.administrator.findUnique({
    where: {
      userId: userId,
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

  if (!admin) throw new ForbiddenError('Forbidden');
  return admin;
}
export async function getUserProfile(
  userId: number
): Promise<UserProfile | null> {
  const userProfile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });
  if (!userProfile) return null;
  return userProfile;
}
export async function verifyIsHotelAdmin(userId: number, hotelId: number) {
  const admin = await getAdminInfo(userId);

  const isHotelAdmin = admin.hotels.find(
    (hotel: { id: number }) => hotel.id === hotelId
  );

  if (!isHotelAdmin) throw new ForbiddenError('Forbidden');
  return admin;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const salt = await genSalt(saltRounds);
  const hashPassword = await hash(password, salt);
  return hashPassword;
}

export async function comparePassword({
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
  const token = await sign({ user: { id: id, role: role } }, env.APP_SECRET);

  return token;
}
