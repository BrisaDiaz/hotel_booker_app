import { objectType, enumType, extendType, stringArg } from 'nexus';
import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthenticationError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';
import { getUser, hashPassword } from '../utils/index';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('password');
    t.field('role', { type: 'Role' });
  },
});

export const Mutation = extendType({
  type: 'Mutetion',
  definition(t) {
    t.field('updateMyAccount', {
      type: 'User',
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve(_, args, ctx) {
        async function updateAccount(user: User | null, args) {
          if (!user) throw new AuthenticationError('Unauthenticated');

          const encryptedPasswod = args.password
            ? await hashPassword(args.password)
            : null;
          return await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              firstName: args.firstName,
              secondName: args.secondName,
              email: args.email,
              password: encryptedPasswod,
            },
          });
        }
        return updateAccount(ctx.user, args);
      },
    });
  },
});
export const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
});
