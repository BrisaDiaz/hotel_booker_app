import {
  objectType,
  extendType,
  stringArg,
  intArg,
  list,
  nonNull,
  floatArg,
  booleanArg,
} from 'nexus';

import {
  createHotel,
  updateHotel,
  getHotel,
  searchHotels,
  getHotelRoomModels,
  getHotelFeatures,
  getHotelAddress,
} from '../services/Hotel';
import { getAdministrator } from '../services/Admin';

import {
  getHotelAlbums,
  getHotelImages,
  getHotelImagesCount,
} from '../services/Album';
import { HotelQueryArgs } from '../utils/index';

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('hotelId');
    t.string('holeAddress');
    t.string('country');
    t.string('administrativeArea');
    t.string('postalCode');
    t.string('city');
    t.string('street');
  },
});

export const Hotel = objectType({
  name: 'Hotel',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('administratorId');
    t.field('administrator', {
      type: 'Administrator',
      resolve(root: any): any {
        return getAdministrator(root.administratorId);
      },
    });
    t.string('name');
    t.string('brand');
    t.string('category');
    t.string('telephone');
    t.string('email');
    t.string('website');
    t.string('description');
    t.string('frameImage');
    t.string('interiorImage');
    t.string('checkInHour');
    t.string('checkOutHour');
    t.string('policiesAndRules');
    t.float('lowestPrice');
    t.float('taxesAndCharges');
    t.boolean('public');
    t.list.field('facilities', {
      type: 'Facility',
    });
    t.list.field('services', { type: 'Service' });
    t.list.field('activities', { type: 'Activity' });
    t.list.field('languages', { type: 'Language' });
    t.field('features', {
      type: 'Features',
      resolve(root: any): any {
        return getHotelFeatures(root.id);
      },
    });
    t.list.field('roomModels', {
      type: 'RoomModel',
      resolve(root: any): any {
        return getHotelRoomModels(root.id);
      },
    });
    t.list.field('albums', {
      type: 'Album',
      resolve(root: any): any {
        return getHotelAlbums(root.id);
      },
    });
    t.int('imagesCount', {
      resolve(root: any): any {
        return getHotelImagesCount(root.id);
      },
    }),
      t.list.field('miniatures', {
        type: 'Image',
        resolve(root: any): any {
          return getHotelImages(root.id, { take: 6 });
        },
      });
    t.field('address', {
      type: 'Address',
      resolve(root: any): any {
        return getHotelAddress(root.id);
      },
    });
  },
});
export const HotelSearch = objectType({
  name: 'HotelSearch',
  definition(t) {
    t.list.field('hotels', {
      type: 'Hotel',
    });
    t.int('totalResults');
    t.int('pageCount');
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('hotelSearch', {
      type: 'HotelSearch',
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
      resolve(root: any, args): any {
        return searchHotels(args as HotelQueryArgs);
      },
    });
    t.field('hotelById', {
      type: 'Hotel',
      args: {
        hotelId: nonNull(intArg()),
      },
      resolve(root, args): any {
        return getHotel(args.hotelId);
      },
    });
    t.field('hotelRoomModels', {
      type: list('RoomModel'),
      args: {
        hotelId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return getHotelRoomModels(args.hotelId);
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
        token: nonNull(stringArg()),
        name: nonNull(stringArg()),
        brand: stringArg(),
        category: nonNull(stringArg()),
        email: stringArg(),
        website: stringArg(),
        telephone: nonNull(stringArg()),
        lowestPrice: nonNull(floatArg()),
        taxesAndCharges: nonNull(floatArg()),
        frameImage: nonNull(stringArg()),
        interiorImage: nonNull(stringArg()),
        checkInHour: nonNull(stringArg()),
        checkOutHour: nonNull(stringArg()),
        policiesAndRules: nonNull(stringArg()),
        description: nonNull(stringArg()),
        facilities: nonNull(list(nonNull(stringArg()))),
        services: nonNull(list(nonNull(stringArg()))),
        activities: nonNull(list(nonNull(stringArg()))),
        languages: nonNull(list(nonNull(stringArg()))),
        freeCancellation: nonNull(booleanArg()),
        accessible: nonNull(booleanArg()),
        familyFriendly: nonNull(booleanArg()),
        petFriendly: nonNull(booleanArg()),
        smokerFriendly: nonNull(booleanArg()),
        ecoFriendly: nonNull(booleanArg()),
        holeAddress: nonNull(stringArg()),
        country: nonNull(stringArg()),
        postalCode: nonNull(stringArg()),
        administrativeArea: nonNull(stringArg()),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(_, args, ctx): any {
        return createHotel(args.token, args);
      },
    });
    t.field('updateHotel', {
      type: 'Hotel',
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(intArg()),
        name: stringArg(),
        brand: stringArg(),
        category: stringArg(),
        email: stringArg(),
        website: stringArg(),
        telephone: stringArg(),
        lowestPrice: floatArg(),
        taxesAndCharges: floatArg(),
        frameImage: stringArg(),
        interiorImage: stringArg(),
        checkInHour: stringArg(),
        checkOutHour: stringArg(),
        policiesAndRules: stringArg(),
        description: stringArg(),
        facilities: list(stringArg()),
        services: list(stringArg()),
        activities: list(stringArg()),
        languages: list(stringArg()),
        freeCancellation: booleanArg(),
        accessible: booleanArg(),
        familyFriendly: booleanArg(),
        petFriendly: booleanArg(),
        smokerFriendly: booleanArg(),
        ecoFriendly: booleanArg(),
        holeAddress: stringArg(),
        country: stringArg(),
        postalCode: stringArg(),
        administrativeArea: stringArg(),
        city: stringArg(),
        street: stringArg(),
      },
      resolve(_, args, ctx): any {
        return updateHotel(args.token, args.hotelId, args);
      },
    });
  },
});
