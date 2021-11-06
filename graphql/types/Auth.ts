import { objectType, stringArg, extendType, nonNull } from 'nexus';
import { AuthenticationError, UserInputError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';
import { hashPassword, compirePassword, signToken } from '../utils';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token');
    t.field('user', { type: 'User' });
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
        async function singIn() {
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
          const isValidPassword = await compirePassword(
            args.password,
            user.password
          );

          if (!isValidPassword) {
            throw new UserInputError('Invalid password');
          }
          const token = await signToken(user.id, user.role);
          return {
            user,
            token,
          };
        }
        return singIn();
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
          try {
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

            const user = await prisma.user.create({
              data: {
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
                password: encryptedPassword,
              },
            });
            return user;
          } catch (error) {
            console.log(error);
          }
        }
        return signup(args);
      },
    });
  },
});
