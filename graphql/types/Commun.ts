import { extendType, objectType, list, inputObjectType } from 'nexus';
import { prisma } from '../../lib/prisma';

export const Service = objectType({
  name: 'Service',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any) {
        return prisma.hotel.count({
          where: {
            services: {
              some: { id: root.id },
            },
          },
        });
      },
    });
  },
});

export const Facility = objectType({
  name: 'Facility',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.int('hotelsCount', {
      resolve(root: any) {
        return prisma.hotel.count({
          where: {
            facilities: {
              some: { id: root.id },
            },
          },
        });
      },
    });
  },
});
export const Features = objectType({
  name: 'Features',
  definition(t) {
    t.boolean('freeCancelation');
    t.boolean('accessible');
    t.boolean('familyFriendly');
    t.boolean('petFriendly');
    t.boolean('smokerFriendly');
    t.boolean('ecoFriendly');
  },
});


export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('servicesList', {
      type: list('Service'),
      resolve: (): any => {
        return prisma.service.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('activitiesList', {
      type: list('Activity'),
      resolve: (): any =>
        prisma.activity.findMany({
          orderBy: {
            name: 'asc',
          },
        }),
    });
    t.list.field('languagesList', {
      type: 'Language',
      resolve: (): any => {
        return prisma.language.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('facilitiesList', {
      type: list('Facility'),
      resolve: (): any => {
        return prisma.facility.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('amenitiesList', {
      type: list('Amenity'),
      resolve: (): any => {
        return prisma.amenity.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('hotelCategoriesList', {
      type: list('HotelCategory'),
      resolve: (): any => {
        return prisma.hotelCategory.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('roomCategoriesList', {
      type: list('RoomCategory'),
      resolve: (): any => {
        return prisma.roomCategory.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
    t.field('bedTypesList', {
      type: list('BedType'),
      resolve: (): any => {
        return prisma.bedType.findMany({
          orderBy: {
            name: 'asc',
          },
        });
      },
    });
  },
});
export const searchFilter = inputObjectType({
  name: 'searchFilter',
  definition(t) {
    t.string('field');
    t.string('value');
  },
});
