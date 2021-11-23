import { objectType, stringArg, extendType, nonNull } from 'nexus';
import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';
import {
  hashPassword,
  compirePassword,
  signToken,
  setCookie,
  deleteCookie,
  getUser,
} from '../utils/index';
import { NextApiRequest, NextApiResponse } from 'next';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
  },
});
export const PlainResponse = objectType({
  name: 'PlainResponse',
  definition(t) {
    t.string('message');
  },
});
export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('signin', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve(root, args, ctx) {
        async function signIn(args) {
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
          const isValidPassword = await compirePassword({
            plain: args.password,
            hash: user.password,
          });

          if (!isValidPassword) {
            throw new UserInputError('Invalid password');
          }
          const token = await signToken(user.id, user.role);
          setCookie(ctx.req, ctx.res, token);
          return {
            user,
            token,
          };
        }
        return signIn(args);
      },
    });
    t.field('signup', {
      type: 'User',
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve(_, args) {
        async function signup(args: {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        }) {
          const userFound = await prisma.user.findUnique({
            where: {
              email: args.email,
            },
          });

          if (userFound)
            throw new UserInputError(
              'Already exist an account with that email'
            );
          const encryptedPassword = await hashPassword(args.password);

          return prisma.user.create({
            data: {
              firstName: args.firstName,
              lastName: args.lastName,
              email: args.email,
              password: encryptedPassword,
            },
          });
        }
        return signup(args);
      },
    });

    t.field('signout', {
      type: 'PlainResponse',
      args: {
        date: stringArg(),
      },
      resolve(_, args, ctx) {
        deleteCookie(ctx.req, ctx.res);
        return { message: `User logout successfully at ${args.date}` };
      },
    });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('authenticate', {
      type: 'User',
      resolve(root, args, ctx) {
        const getUserSession = async (
          req: NextApiRequest,
          res: NextApiResponse
        ) => {
          const tokenPayload = await getUser(req, res);
          const user = await prisma.user.findUnique({
            where: {
              id: tokenPayload.id,
            },
          });
          if (!user) return {};
          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
        };
        return getUserSession(ctx.req, ctx.res);
      },
    });
  },
});
