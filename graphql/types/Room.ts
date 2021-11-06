import {
  objectType,
  extendType,
  idArg,
  list,
  intArg,
  inputObjectType,
  stringArg,
  nonNull,
  booleanArg,
} from 'nexus';

import { prisma } from '../../lib/prisma';

export const Equipament = objectType({
  name: 'Equipament',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('roomId');
  },
});

export const RoomBed = objectType({
  name: 'RoomBed',
  definition(t) {
    t.int('roomId');
    t.string('type');
    t.int('quantity');
  },
});

export const Room = objectType({
  name: 'Room',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.int('mts2');
    t.string('category');
    t.boolean('canselationFree');
    t.float('lowestPrice');
    t.string('description');
    t.string('mainImage');
    t.int('maximunGuest');
    t.int('minimunNights');
    t.int('maximunNights');
    t.list.field('beds', {
      type: 'RoomBed',
      resolve: (root) => {
        return prisma.roonBed.findMany({
          where: {
            roomId: root.id,
          },
        });
      },
    });
    t.list.field('images', {
      type: 'Image',
      resolve: (root) => {
        return prisma.image.findMany({
          where: {
            roomId: root.id,
          },
        });
      },
    });
    t.list.field('services', { type: 'Service' });
    t.list.field('equipament', { type: 'Equipament' });
    t.list.field('consults', {
      type: 'Consult',
      resolve: (root) => {
        return prisma.consult.findMany({
          where: {
            roomId: root.id,
          },
        });
      },
    });
  },
});

export const RoomById = extendType({
  type: 'Query',
  definition(t) {
    t.field('roomById', {
      type: 'Room',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        return prisma.room.findUnique({
          where: {
            id: args.id * 1,
          },
          include: {
            equipament: true,
            services: true,
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('creatHotelRoom', {
      type: 'Room',
      args: {
        hotelId: nonNull(idArg()),
        lowestPrice: nonNull(intArg()),
        mts2: nonNull(intArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
        maximunNights: intArg(),
        minimunNights: nonNull(intArg()),
        maximunGuest: nonNull(intArg()),
        mainImage: nonNull(stringArg()),
        services: nonNull(list(stringArg())),
        equipament: nonNull(list(stringArg())),
        public: booleanArg(),
      },
      resolve(root, args, ctx) {
        return prisma.room.create({
          data: {
            hotelId: args.hotelId,
            mts2: args.mts2,
            category: args.category,
            lowestPrice: args.lowestPrice,
            description: args.description,
            maximunNights: args.maximunNights,
            minimunNights: args.minimunNights,
            maximunGuest: args.maximunGuest,
            mainImage: args.mainImage,
            public: args.public,
            services: {
              connect: args.services.map((service: string) => ({
                name: service,
              })),
            },
            equipament: {
              connect: args.equipament.map((item: string) => ({
                name: item,
              })),
            },
          },
        });
      },
    });

    t.field('ocultRooms', {
      type: 'Room',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        return prisma.room.update({
          where: {
            id: args.id,
          },
          data: {
            public: false,
          },
        });
      },
    });
    t.field('updateRoomLowestPrice', {
      type: 'Room',
      args: {
        id: nonNull(idArg()),
        lowestPrice: nonNull(intArg()),
      },
      resolve(root, args, ctx) {
        return prisma.room.update({
          where: {
            id: args.id,
          },
          data: {
            price: args.lowestPrice,
          },
        });
      },
    });
  },
});
