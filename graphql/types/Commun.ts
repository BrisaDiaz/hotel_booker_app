import { extendType, objectType, list } from 'nexus';
import { prisma } from '../../lib/prisma';
import { Activity } from './Hotel';
export const Service = objectType({
  name: 'Service',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const Facility = objectType({
  name: 'Facility',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});
export const Features = objectType({
  name: 'Features',
  definition(t) {
    t.boolean('cancelationFree');
    t.boolean('accesible');
    t.boolean('familyFriendly');
    t.boolean('petFriendly');
    t.boolean('smokerFriendly');
    t.boolean('ecoFriendly');
  },
});
export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('src');
    t.int('hotelId');
    t.int('roomId');
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('servicesList', {
      type: list('Service'),
      resolve: () => {
        return prisma.service.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('activitiesList', {
      type: list('Activity'),
      resolve: () =>
        prisma.activity.findMany({
          orderBy: {
            name: 'asc',
          },
        }),
    });
    t.list.field('languagesList', {
      type: 'Language',
      resolve: () => {
        return prisma.language.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('facilitiesList', {
      type: list('Facility'),
      resolve: () => {
        return prisma.facility.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('amenitiesList', {
      type: list('Amenity'),
      resolve: () => {
        return prisma.amenity.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('hotelCategoriesList', {
      type: list('HotelCategory'),
      resolve: () => {
        return prisma.hotelCategory.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('roomCategoriesList', {
      type: list('RoomCategory'),
      resolve: () => {
        return prisma.roomCategory.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
  },
});
