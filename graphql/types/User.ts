import { objectType, enumType, extendType, stringArg } from 'nexus';

import { AuthenticationError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../utils/index';

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
  type: 'Mutation',
  definition(t) {
    t.field('updateMyAccount', {
      type: 'User',
      args: {
        firstName: stringArg(),
        lastName: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve(_, args, ctx): any {
        async function updateAccount(
          user: {
            id: number;
          } | null,
          args: any
        ) {
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
