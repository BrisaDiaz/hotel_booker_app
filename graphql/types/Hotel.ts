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
    t.list.field('rooms', {
      type: 'Room',
      resolve: (root) => {
        return prisma.room.findMany({
          where: {
            hotelId: root.id,
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
            globalServices: true,
          },
        });
      },
    });

    t.list.field('hotelImages', {
      type: 'Image',
      args: {
        hotelId: intArg(),
      },
      resolve(root, args, ctx) {
        const images = prisma.image.findMany({
          where: {
            hotelId: args.hotelId,
          },
        });
        return { images };
      },
    });
    t.list.field('allFacilities', {
      type: 'Facility',
      resolve(root, _args, ctx) {
        return prisma.facility.findMany();
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
        public: booleanArg(),
      },
      resolve(_, args) {
        return prisma.hotel.create({
          data: {
            name: args.name,
            category: args.category,
            brand: args.brand,
            email: args.email,
            telephone: args.telephone,
            lowestPrice: args.lowestPrice,
            frameImage: args.mainImage,
            InteriorImage: args.secondaryImage,
            description: args.description,
            checkInHour: args.checkInHour,
            checkOutHour: args.checkOutHour,
            policiesAndRules: args.policies,
            public: args.public,
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
      },
    });

    t.field('addHotelAddress', {
      type: 'Address',
      args: {
        holeAddress: nonNull(stringArg()),
        country: nonNull(stringArg()),
        postalCode: nonNull(stringArg()),
        administrativeArea: nonNull(stringArg()),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(root, args) {
        return prisma.address.upgrade({
          where: {
            hotelId: root.id,
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
      },
    });
    t.field('addHotelFeatures', {
      type: 'Features',
      args: {
        cancelationFree: nonNull(booleanArg()),
        accesible: nonNull(booleanArg()),
        familyFriendly: nonNull(booleanArg()),
        petFriendly: nonNull(booleanArg()),
        smokerFriendly: nonNull(booleanArg()),
        ecoFriendly: nonNull(booleanArg()),
      },
      resolve(root, args) {
        return prisma.feature.upgrate({
          where: {
            hotelId: root.id,
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
      },
    });
    t.field('ocultHotel', {
      type: 'Hotel',
      args: {
        id: nonNull(idArg()),
      },
      resolve(_, args) {
        return prisma.hotel.update({
          where: {
            id: args.id * 1,
          },
          data: {
            public: false,
          },
        });
      },
    });

    t.field('updateHotelLowestPrice', {
      type: 'Hotel',
      args: {
        id: nonNull(idArg()),
        lowestPrice: nonNull(intArg()),
      },
      resolve(_, args) {
        return prisma.hotel.update({
          where: {
            id: args.id,
          },
          data: {
            lowestPrice: args.lowestPrice,
          },
        });
      },
    });
  },
});
