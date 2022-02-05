import { objectType, stringArg, extendType, nonNull, enumType } from 'nexus';

import {
  getUserSession,
  signup,
  signIn,
  signOut,
  updateAccount,
} from '../services/Auth';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('password');
    t.field('role', { type: 'Role' });
  },
});

export const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
});

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
    t.boolean('success');
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
      resolve(root, args, ctx): any {
        return signIn(args, ctx.req, ctx.res);
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
      resolve(_, args: any): any {
        return signup(args);
      },
    });
    t.field('updateUserAccount', {
      type: 'User',
      args: {
        toke: nonNull(stringArg()),
        firstName: stringArg(),
        lastName: stringArg(),
        email: stringArg(),
        password: stringArg(),
      },
      resolve(_, args, ctx): any {
        return updateAccount(args.token, args);
      },
    });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('authentication', {
      type: 'AuthPayload',
      resolve(root, args, ctx): any {
        return getUserSession(ctx.req, ctx.res);
      },
    });
    t.field('signout', {
      type: 'PlainResponse',
      resolve(_, args, ctx) {
        return signOut(ctx.req, ctx.res);
      },
    });
  },
});
