import { extendType, objectType, list } from 'nexus';
import { prisma } from '../../lib/prisma';
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

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('allServices', {
      type: list('Service'),
      resolve: () => {
        return prisma.service.findMany({});
      },
    });
    t.field('allActivities', {
      type: list('Activity'),
      resolve: () => {
        return prisma.activity.findMany({});
      },
    });
    t.field('allLanguages', {
      type: list('Language'),
      resolve: () => {
        return prisma.language.findMany({});
      },
    });
    t.field('allFacilities', {
      type: list('Facility'),
      resolve: () => {
        return prisma.facility.findMany({});
      },
    });
    t.field('allAmenities', {
      type: list('Amenity'),
      resolve: () => {
        return prisma.amenty.findMany({});
      },
    });
  },
});
