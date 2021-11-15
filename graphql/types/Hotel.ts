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
import type { NextApiRequest, NextApiResponse } from 'next';

import { getAdminInfo, verifyIsHotelAdmin } from '../utils';
import { Category } from '@mui/icons-material';
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
export const HotelCategory = objectType({
  name: 'HotelCategory',
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
    t.list.field('languages', { type: 'Language' });
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
    t.field('hotels', {
      type: list('Hotel'),
      args: {
        search: stringArg(),
        sort: stringArg(),
        skip: intArg(),
        take: intArg(),
        features: list(stringArg()),
        categories: list(stringArg()),
        facilities: list(stringArg()),
        activities: list(stringArg()),
        services: list(stringArg()),
        languages: list(stringArg()),
      },

      resolve(root, args: args, ctx) {
        interface args {
          facilities?: string[];
          activities?: string[];
          services?: string[];
          languages?: string[];
          categories?: string[];
          features?: string[];
          search?: string;
          sort?: string;
          skip?: number;
          take?: number;
        }

        interface ArrayFilter {
          [key: string]: {
            hasSome: String[];
          };
        }

        interface PropietyFilter {
          [key: string]: { equeals: string };
        }
        interface searchFilter {
          [key: string]: {
            contains: string;
          };
        }
        interface BooleanFilter {
          [key: string]: boolean;
        }
        interface sortField {
          [key: string]: 'desc' | 'asc';
        }
        type OR = (
          | PropietyFilter
          | searchFilter
          | { [key: string]: searchFilter }
        )[];
        type AND = (ArrayFilter | BooleanFilter)[];
        interface Query {
          orderBy: sortField[];
          where: {
            AND?: AND;
            OR?: OR;
          };
          take: number;
          skip?: number;
        }

        let ANDconditionals: AND = [];

        args.facilities?.length &&
          ANDconditionals.push({ facilities: { hasSome: args.facilities } });

        args.activities?.length &&
          ANDconditionals.push({ activities: { hasSome: args.activities } });

        args.services?.length &&
          ANDconditionals.push({ services: { hasSome: args.services } });

        args.languages?.length &&
          ANDconditionals.push({ languages: { hasSome: args.languages } });
        args.features?.length &&
          ANDconditionals.push(
            args.features.map((feature: string) => ({
              features: { [feature]: true },
            }))
          );
        let ORconditionals: OR = [];

        args.categories?.length &&
          ORconditionals.push(
            args.categories.map((category: string) => ({
              category: { equals: category },
            }))
          );
        args.search &&
          ORconditionals.push({ title: { contains: args.search } }) &&
          ORconditionals.push({ description: { contains: args.search } }) &&
          ORconditionals.push({
            address: { holeAddress: { contains: args.search } },
          });

        let orderBy: sortField[] = [
          {
            lowestPrice: args?.sort === '-price' ? 'desc' : 'asc',
          },
        ];
        let query: Query = {
          orderBy: orderBy,
          where: {},
          take: args.take || 6,
          skip: args.skip || 0,
        };
        if (ANDconditionals.length) {
          query.where['AND'] = ANDconditionals;
        }
        if (ORconditionals.length) {
          query.where['OR'] = ORconditionals;
        }

        const searchHotels = async (query: Query) => {
          return prisma.hotel.findMany(query);
        };
        return searchHotels(query);
      },
    });
    t.field('getHotelById', {
      type: 'Hotel',
      args: {
        id: nonNull(idArg()),
      },
      resolve(_, args: { id: number }, ctx) {
        return prisma.hotel.findUnique({
          where: {
            id: args.id,
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
        email: stringArg(),
        telephone: nonNull(stringArg()),
        lowestPrice: nonNull(floatArg()),
        taxesAndCharges: nonNull(floatArg()),
        frameImage: nonNull(stringArg()),
        interiorImage: nonNull(stringArg()),
        checkInHour: nonNull(stringArg()),
        checkOutHour: nonNull(stringArg()),
        policiesAndRules: nonNull(stringArg()),
        description: nonNull(stringArg()),
        facilities: nonNull(list(stringArg())),
        services: nonNull(list(stringArg())),
        activities: nonNull(list(stringArg())),
        languages: nonNull(list(stringArg())),
        cancelationFree: nonNull(booleanArg()),
        accessible: nonNull(booleanArg()),
        familyFriendly: nonNull(booleanArg()),
        petFriendly: nonNull(booleanArg()),
        smokerFriendly: nonNull(booleanArg()),
        ecoFriendly: nonNull(booleanArg()),
        holeAddress: nonNull(stringArg()),
        country: stringArg(),
        postalCode: nonNull(stringArg()),
        administrativeArea: nonNull(stringArg()),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(_, args, ctx) {
        const createHotel = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          const admin = await getAdminInfo(req, res);

          const hotel = await prisma.hotel.create({
            data: {
              administrator: { connect: { id: admin.id } },
              name: args.name,
              hotelCategory: { connect: { name: args.category } },
              brand: args.brand,
              website: args.website,
              email: args.email,
              telephone: args.telephone,
              lowestPrice: args.lowestPrice,
              taxesAndCharges: args.taxesAndCharges,
              frameImage: args.frameImage,
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
          await prisma.address.create({
            data: {
              hotelId: hotel.id,
              country: args.country,
              holeAddress: args.holeAddress,
              postalCode: args.postalCode,
              administrativeArea: args.administrativeArea,
              city: args.city,
              street: args.street,
            },
          });
          await prisma.features.create({
            data: {
              hotelId: hotel.id,
              cancelationFree: args.cancelationFree,
              accessible: args.accessible,
              familyFriendly: args.familyFriendly,
              petFriendly: args.petFriendly,
              smokerFriendly: args.smokerFriendly,
              ecoFriendly: args.ecoFriendly,
            },
          });
          return hotel;
        };

        return createHotel(ctx.req, ctx.res, args);
      },
    });
    t.field('updateHotelAddress', {
      type: 'Address',
      args: {
        hotelId: nonNull(idArg()),
        holeAddress: nonNull(stringArg()),
        country: stringArg(),
        postalCode: nonNull(stringArg()),
        administrativeArea: nonNull(stringArg()),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(root, args, ctx) {
        const addHotelAddress = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
          return await prisma.address.update({
            where: {
              hotelId: args.hotelId,
            },
            data: {
              country: args.country,
              holeAddress: args.holeAddress,
              stateOrRegion: args.stateOrRegion,
              city: args.city,
              street1: args.street1,
              street2: args.street2,
            },
          });
        };
        return addHotelAddress(ctx.req, ctx.res, args);
      },
    });

    t.field('updateHotelLowestPrice', {
      type: 'Hotel',
      args: {
        hotelId: nonNull(idArg()),
        lowestPrice: nonNull(floatArg()),
      },
      resolve(_, args, ctx) {
        const changeHotelPrice = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
          return await prisma.hotel.update({
            where: {
              id: args.hotelId,
            },
            data: {
              lowestPrice: args.lowestPrice,
            },
          });
        };
        return changeHotelPrice(ctx.req, ctx.res, args);
      },
    });
  },
});
