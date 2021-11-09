import { objectType, enumType, extendType, stringArg } from 'nexus';
import type { NextApiRequest } from 'next';

import { getUser, hashPassword } from '../utils';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
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
        async function getMyProfile(req: NextApiRequest) {
          const user: { id: number } = await getUser(req);

          return await prisma.user.findUnique({
            where: {
              id: user.id,
            },
          });
        }
        return getMyProfile(ctx.req);
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
        secondName: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve(_, args, ctx) {
        async function updateAccount(args: {
          firstName?: string;
          secondName?: string;
          email?: string;
          password?: string;
        }) {
          const user = await getUser(ctx.req);

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
        return updateAccount(args);
      },
    });
  },
});
export const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
});
