import {
  objectType,
  extendType,
  stringArg,
  intArg,
  idArg,
  list,
  nonNull,
  floatArg,
  booleanArg,
} from 'nexus';
import { prisma } from '../../lib/prisma';
import type { NextApiRequest } from 'next';

import { getAdminInfo, verifyIsHotelAdmin } from '../utils';
export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.id('hotelId');
    t.string('holeAddress');
    t.string('country');
    t.string('administrativeArea');
    t.string('postalCode');
    t.string('city');
    t.string('street');
  },
});
export const Administrator = objectType({
  name: 'Administrator',
  definition(t) {
    t.id('id');
    t.int('userId');
    t.field('user', {
      type: 'User',
      resolve: (root) => {
        return prisma.user.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });
    t.field('hotels', {
      type: list('Hotel'),
      resolve: (root) => {
        return prisma.hotel.findMany({
          where: {
            administratorId: root.id,
          },
        });
      },
    });
  },
});
export const Activity = objectType({
  name: 'Activity',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});
export const Language = objectType({
  name: 'Language',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});
export const Hotel = objectType({
  name: 'Hotel',
  definition(t) {
    t.nonNull.id('id');
    t.int('administratorId');
    t.field('adminstrator', {
      type: 'Administrator',
      resolve: (root) => {
        return prisma.administrator.findUnique({
          where: {
            id: root.administratorId,
          },
        });
      },
    });
    t.string('name');
    t.string('brand');
    t.string('category');
    t.string('telephone');
    t.string('email');
    t.string('description');
    t.string('frameImage');
    t.string('interiorImage');
    t.string('checkInHour');
    t.string('checkOutHour');
    t.string('policiesAndRules');
    t.float('lowestPrice');
    t.boolean('public');
    t.list.field('facilities', {
      type: 'Facility',
    });
    t.list.field('services', { type: 'Service' });
    t.list.field('activities', { type: 'Activity' });
    t.list.field('languages', { type: 'Langueage' });
    t.list.field('roomModels', {
      type: 'RoomModel',
      resolve: (root) => {
        return prisma.roomModel.findMany({
          where: {
            hotelId: root.id,
          },
          include: {
            amenities: true,
            services: true,
          },
        });
      },
    });
    t.list.field('images', {
      type: 'Image',
      resolve: (root) => {
        return prisma.image.findMany({
          where: {
            hotelId: root.id,
          },
        });
      },
    });
    t.list.field('comments', {
      type: 'Comment',
      resolve: (root) => {
        return prisma.comment.findMany({
          where: {
            hotelId: root.id,
          },
        });
      },
    });
    t.field('address', {
      type: 'Address',
      resolve(root, args, ctx) {
        return prisma.address.findUnique({
          where: {
            hotelId: root.id,
          },
        });
      },
    });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('hotels', {
      type: 'Hotel',
      resolve(root, args, ctx) {
        return prisma.hotel.findMany();
      },
    });
    t.field('getHotelById', {
      type: 'Hotel',
      args: {
        id: nonNull(idArg()),
      },
      resolve(_, args, ctx) {
        return prisma.hotel.findUnique({
          where: {
            id: args.id * 1,
          },
          include: {
            facilities: true,
            services: true,
            activities: true,
            languages: true,
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createHotel', {
      type: 'Hotel',
      args: {
        name: nonNull(stringArg()),
        brand: stringArg(),
        category: stringArg(),
        email: stringArg(),
        telephone: nonNull(stringArg()),
        lowestPrice: nonNull(floatArg()),
        frameImage: nonNull(stringArg()),
        InteriorImage: nonNull(stringArg()),
        checkInHour: nonNull(stringArg()),
        checkOutHour: nonNull(stringArg()),
        policiesAndRules: nonNull(stringArg()),
        description: nonNull(stringArg()),
        facilities: nonNull(list(stringArg())),
        services: nonNull(list(stringArg())),
        activities: nonNull(list(stringArg())),
        languages: nonNull(list(stringArg())),
      },
      resolve(_, args, ctx) {
        const createHotel = async (req: NextApiRequest, args: any) => {
          const admin = await getAdminInfo(req);
          return await prisma.hotel.create({
            data: {
              administratorId: admin.id,
              name: args.name,
              category: args.category,
              brand: args.brand,
              email: args.email,
              telephone: args.telephone,
              lowestPrice: args.lowestPrice,
              frameImage: args.mainImage,
              interiorImage: args.interiorImage,
              description: args.description,
              checkInHour: args.checkInHour,
              checkOutHour: args.checkOutHour,
              policiesAndRules: args.policiesAndRules,

              facilities: {
                connect: args.facilities.map((facility: string) => ({
                  name: facility,
                })),
              },
              services: {
                connect: args.services.map((service: string) => ({
                  name: service,
                })),
              },
              activities: {
                connect: args.activities.map((activity: string) => ({
                  name: activity,
                })),
              },
              languages: {
                connect: args.languages.map((language: string) => ({
                  name: language,
                })),
              },
            },
          });
        };
        return createHotel(ctx.req, args);
      },
    });
    t.field('addHotelAddress', {
      type: 'Address',
      args: {
        hotelId: nonNull(idArg()),
        holeAddress: nonNull(stringArg()),
        country: nonNull(stringArg()),
        postalCode: nonNull(stringArg()),
        administrativeArea: nonNull(stringArg()),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(root, args, ctx) {
        const addHotelAddress = async (req: NextApiRequest, args: any) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.address.upgrade({
            where: {
              hotelId: args.hotelId,
            },
            create: {
              hotelId: args.root.id,
              holeAddress: args.holeAddress,
              country: args.country,
              postalCode: args.postalCode,
              administrativeArea: args.administrativeArea,
              city: args.city,
              street: args.street,
            },
            update: {
              country: args.country,
              holeAddress: args.holeAddress,
              stateOrRegion: args.stateOrRegion,
              city: args.city,
              street1: args.street1,
              street2: args.street2,
            },
          });
        };
        return addHotelAddress(ctx.req, args);
      },
    });
    t.field('addHotelFeatures', {
      type: 'Features',
      args: {
        hotelId: nonNull(idArg()),
        cancelationFree: nonNull(booleanArg()),
        accesible: nonNull(booleanArg()),
        familyFriendly: nonNull(booleanArg()),
        petFriendly: nonNull(booleanArg()),
        smokerFriendly: nonNull(booleanArg()),
        ecoFriendly: nonNull(booleanArg()),
      },
      resolve(root, args, ctx) {
        const addHotelFeatures = async (req: NextApiRequest, args: any) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.features.upgrade({
            where: {
              hotelId: args.hotelId,
            },
            create: {
              hotelId: root.id,
              cancelationFree: args.cancelationFree,
              accesible: args.accesible,
              familyFriendly: args.familyFriendly,
              petFriendly: args.petFriendly,
              smokerFriendly: args.smokerFriendly,
              ecoFriendly: args.ecoFriendly,
            },
            update: {
              cancelationFree: args.cancelationFree,
              accesible: args.accesible,
              familyFriendly: args.familyFriendly,
              petFriendly: args.petFriendly,
              smokerFriendly: args.smokerFriendly,
              ecoFriendly: args.ecoFriendly,
            },
          });
        };
        return addHotelFeatures(ctx.req, args);
      },
    });

    t.field('updateHotelLowestPrice', {
      type: 'Hotel',
      args: {
        hotelId: nonNull(idArg()),
        lowestPrice: nonNull(floatArg()),
      },
      resolve(_, args, ctx) {
        const changeHotelPrice = async (req: NextApiRequest, args: any) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.hotel.update({
            where: {
              id: args.hotelId,
            },
            data: {
              lowestPrice: args.lowestPrice,
            },
          });
        };
        return changeHotelPrice(ctx.req, args);
      },
    });
  },
});
