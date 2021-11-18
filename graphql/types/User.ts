import { objectType, enumType, extendType, stringArg } from 'nexus';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { getUser, hashPassword } from '../utils/index';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('firstname');
    t.string('lastname');
    t.string('email');
    t.string('password');
    t.field('role', { type: Role });
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve(root, args, ctx) {
        async function getMyProfile(req: NextApiRequest, res: NextApiResponse) {
          const user: { id: number } = await getUser(req, res);

          return await prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });
        }
        return getMyProfile(ctx.req, ctx.res);
      },
    });
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
        async function updateAccount(
          req: NextApiRequest,
          res: NextApiResponse,
          args
        ) {
          const user = await getUser(req, res);

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
        return updateAccount(ctx.req, ctx.res, args);
      },
    });
  },
});
export const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
});
