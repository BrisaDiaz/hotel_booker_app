import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { prisma } from '@/lib/prisma';
import {
  hashPassword,
  comparePassword,
  signToken,
  setCookie,
  deleteCookie,
  getUserIdentity,
  getUserProfile,
  getCookie,
} from '../utils/index';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUserSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const cookie = await getCookie(req, res);
  if (!cookie)
    return {
      user: null,
      token: '',
    };
  const cookiePayload = await getUserIdentity(cookie);
  if (!cookiePayload)
    return {
      user: null,
      token: '',
    };
  const user = await getUserProfile(cookiePayload.id);
  if (!user)
    return {
      user: null,
      token: '',
    };

  const token = await signToken(cookiePayload.id, user.role);

  setCookie(req, res, token);
  return {
    user,
    token,
  };
};
export const signup = async (args: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const userFound = await prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });

  if (userFound)
    throw new UserInputError('Already exist an account with that email');
  const encryptedPassword = await hashPassword(args.password);

  return prisma.user.create({
    data: {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: encryptedPassword,
    },
  });
};
export const signIn = async (
  args: {
    email: string;
    password: string;
  },
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const user = await prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });

  if (!user) {
    throw new AuthenticationError(
      `No user was found with email: ${args.email}`
    );
  }
  const isValidPassword = await comparePassword({
    plain: args.password,
    hash: user.password,
  });

  if (!isValidPassword) {
    throw new UserInputError('Invalid password');
  }
  const token = await signToken(user.id, user.role);
  setCookie(req, res, token);
  return {
    user,
    token,
  };
};
export const signOut = async (req: NextApiRequest, res: NextApiResponse) => {
  deleteCookie(req, res);
  const currentTime = new Date(Date.now()).toLocaleString();
  return {
    success: true,
    message: `User logout successfully at ${currentTime}`,
  };
};
export const updateAccount = async (token: string, args: any) => {
  const user = await getUserIdentity(token);
  if (!user) throw new AuthenticationError('Unauthenticated');

  const encryptedPassword = args.password
    ? await hashPassword(args.password)
    : undefined;
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      password: encryptedPassword,
    },
  });
};
