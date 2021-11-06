import {
  objectType,
  extendType,
  intArg,
  stringArg,
  idArg,
  nonNull,
} from 'nexus';
import { prisma } from '../../lib/prisma';

export const Client = objectType({
  name: 'Prospect',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('lastName');
    t.string('email');
    t.int('telephone');
  },
});
export const Consult = objectType({
  name: 'Consult',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.field('hotel', {
      type: 'Hotel',
      resolve(root) {
        return prisma.hotel.findUnique({
          where: {
            id: root.hotelId,
          },
        });
      },
    });
    t.int('roomId');
    t.field('room', {
      type: 'Room',
      resolve(root) {
        return prisma.consult.findUnique({
          where: {
            id: root.roomId,
          },
        });
      },
    });
    t.int('userId');
    t.field('prospect', {
      type: 'User',
      resolve(root) {
        return prisma.prospect.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });
    t.int('childrens');
    t.int('adults');
    t.int('rooms');
    t.int('checkInDate');
    t.int('checkOutDate');
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('getOrderById', {
      type: 'Order',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        return prisma.consult.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createConsult', {
      type: 'Consult',
      args: {
        hotelId: nonNull(idArg()),
        roomld: nonNull(idArg()),
        childrens: nonNull(intArg()),
        adults: nonNull(intArg()),
        nights: nonNull(intArg()),
        rooms: nonNull(intArg()),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
      },
      async resolve(root, args, ctx) {
        return prisma.consult.create({
          data: {
            prospectId: root.id,
            hotelId: args.hotelId,
            roomld: args.roomld,
            childrens: args.childrens,
            adults: args.adults,
            nights: args.nights,
            checkInDate: new Date(args.checkInDate),
            checkOutDate: new Date(args.checkOutDate),
          },
        });
      },
    });
  },
});
