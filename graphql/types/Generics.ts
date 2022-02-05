import { extendType, objectType, list, inputObjectType } from 'nexus';

import {
  getHotelCategories,
  getLanguages,
  getActivities,
  getServices,
  getFacilities,
  getRoomCategories,
  getBedTypes,
  getAmenities,
  getFeatures,
  getHotelsWithFacilityCount,
  getHotelsWithActivityCount,
  getHotelsWithServiceCount,
  getHotelsWithLanguageCount,
  getHotelsOfCategoryCount,
  getHotelsWithFeatureCount,
} from '../services/Generics';

export const Feature = objectType({
  name: 'Feature',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return getHotelsWithFeatureCount(root.name);
      },
    });
  },
});
export const Activity = objectType({
  name: 'Activity',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return getHotelsWithActivityCount(root.id);
      },
    });
  },
});
export const Language = objectType({
  name: 'Language',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return getHotelsWithLanguageCount(root.id);
      },
    });
  },
});
export const HotelCategory = objectType({
  name: 'HotelCategory',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return getHotelsOfCategoryCount(root.name);
      },
    });
  },
});
export const Service = objectType({
  name: 'Service',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any) {
        return getHotelsWithServiceCount(root.id);
      },
    });
  },
});

export const Facility = objectType({
  name: 'Facility',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.int('hotelsCount', {
      resolve(root: any) {
        return getHotelsWithFacilityCount(root.id);
      },
    });
  },
});
export const Features = objectType({
  name: 'Features',
  definition(t) {
    t.boolean('freeCancellation');
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
    t.field('featuresList', {
      type: list('Feature'),
      resolve: (): any => {
        return getFeatures();
      },
    });
    t.field('servicesList', {
      type: list('Service'),
      resolve: (): any => {
        return getServices();
      },
    });
    t.field('activitiesList', {
      type: list('Activity'),
      resolve: (): any => getActivities(),
    });
    t.list.field('languagesList', {
      type: 'Language',
      resolve: (): any => {
        return getLanguages();
      },
    });
    t.field('facilitiesList', {
      type: list('Facility'),
      resolve: (): any => {
        return getFacilities();
      },
    });
    t.field('amenitiesList', {
      type: list('Amenity'),
      resolve: (): any => {
        return getAmenities();
      },
    });
    t.field('hotelCategoriesList', {
      type: list('HotelCategory'),
      resolve: (): any => {
        return getHotelCategories();
      },
    });
    t.field('roomCategoriesList', {
      type: list('RoomCategory'),
      resolve: (): any => {
        return getRoomCategories();
      },
    });
    t.field('bedTypesList', {
      type: list('BedType'),
      resolve: (): any => {
        return getBedTypes();
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
