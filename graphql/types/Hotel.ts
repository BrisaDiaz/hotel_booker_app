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

import {
  getAdminInfo,
  verifyIsHotelAdmin,
  hotelQueryConstructor,
  deleteImage,
  getHotelFieldsToEdit,
  HotelQueryArgs,
} from '../utils/index';

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
      resolve(root: any): any {
        return prisma.user.findUnique({
          where: {
            id: root.userId,
          },
        });
      },
    });
    t.field('hotels', {
      type: list('Hotel'),
      resolve(root: any): any {
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
    t.int('hotelsCount', {
      resolve(root: any): any {
        return prisma.hotel.count({
          where: {
            activities: {
              some: {
                id: root.id,
              },
            },
          },
        });
      },
    });
  },
});
export const Language = objectType({
  name: 'Language',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return prisma.hotel.count({
          where: {
            languages: {
              some: {
                id: root.id,
              },
            },
          },
        });
      },
    });
  },
});
export const HotelCategory = objectType({
  name: 'HotelCategory',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('hotelsCount', {
      resolve(root: any): any {
        return prisma.hotel.count({
          where: {
            category: {
              equals: root.name,
            },
          },
        });
      },
    });
  },
});

export const Hotel = objectType({
  name: 'Hotel',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.int('administratorId');
    t.field('adminstrator', {
      type: 'Administrator',

      resolve(root: any): any {
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
        return prisma.features.findUnique({
          where: {
            hotelId: root.id * 1,
          },
        });
      },
    });
    t.list.field('roomModels', {
      type: 'RoomModel',
      resolve(root: any): any {
        return prisma.roomModel.findMany({
          where: {
            hotelId: root.id * 1,
          },
        });
      },
    });
    t.list.field('albums', {
      type: 'Album',
      resolve(root: any): any {
        return prisma.album.findMany({
          where: {
            hotelId: root.id,
          },
        });
      },
    });

    t.field('address', {
      type: 'Address',
      resolve(root: any): any {
        return prisma.address.findUnique({
          where: {
            hotelId: root.id,
          },
        });
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
        const query = hotelQueryConstructor(args as HotelQueryArgs);
        const searchHotels = async (query: { where: any; take: number }) => {
          const hotels = await prisma.hotel.findMany(query);
          const totalResults: number = await prisma.hotel.count({
            where: query.where,
          });
          const pageCount: number = Math.floor(totalResults / query.take);
          return { hotels, totalResults, pageCount };
        };
        return searchHotels(query);
      },
    });
    t.field('hotelById', {
      type: 'Hotel',
      args: {
        hotelId: nonNull(idArg()),
      },
      resolve(root, args): any {
        const searchHotel = async (hotelId: number) => {
          const hotel = await prisma.hotel.findUnique({
            where: {
              id: hotelId,
            },
            include: {
              facilities: true,
              services: true,
              activities: true,
              languages: true,
            },
          });
          return hotel;
        };
        return searchHotel(parseInt(args.hotelId));
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
        userId: nonNull(idArg()),
        name: nonNull(stringArg()),
        brand: stringArg(),
        category: stringArg(),
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
        facilities: nonNull(list(stringArg())),
        services: nonNull(list(stringArg())),
        activities: nonNull(list(stringArg())),
        languages: nonNull(list(stringArg())),
        freeCancelation: nonNull(booleanArg()),
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
      resolve(_, args, ctx): any {
        const createHotel = async (userId: number, args: any) => {
          const admin = await getAdminInfo(userId);

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
              hotelId: hotel.id * 1,
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
              hotelId: hotel.id * 1,
              freeCancelation: args.freeCancelation,
              accessible: args.accessible,
              familyFriendly: args.familyFriendly,
              petFriendly: args.petFriendly,
              smokerFriendly: args.smokerFriendly,
              ecoFriendly: args.ecoFriendly,
            },
          });
          return hotel;
        };

        return createHotel(parseInt(args.userId), args);
      },
    });
    t.field('updateHotel', {
      type: 'Hotel',
      args: {
        userId: nonNull(idArg()),
        hotelId: nonNull(idArg()),
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
        freeCancelation: booleanArg(),
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
        const update = async (userId: number, hotelId: number, args: any) => {
          verifyIsHotelAdmin(userId, hotelId);
          const toEditFields = getHotelFieldsToEdit(args);
          let hotelUpdated;
          console.log(toEditFields);
          if (toEditFields.includes('address')) {
            await updateAddress(hotelId, args);
          }
          if (toEditFields.includes('staticFeatures')) {
            await updateStaticFeatures(hotelId, args);
          }
          if (toEditFields.includes('dinamicFeatures')) {
            hotelUpdated = await updateDinamicFeatures(hotelId, args);
          }
          if (toEditFields.includes('genericData')) {
            hotelUpdated = await updateGenericData(hotelId, args);
          }
          if (toEditFields.includes('aspect')) {
            hotelUpdated = await updateAspect(hotelId, args);
          }
          if (!hotelUpdated) {
            hotelUpdated = await prisma.hotel.findUnique({
              where: {
                id: hotelId,
              },
              include:{
                features:true,
                address:true
              }
            });
          }
          return hotelUpdated;
        };
        const updateAddress = async (hotelId: number, args: any) => {
          await prisma.address.update({
            where: {
              hotelId: hotelId,
            },
            data: {
              country: args.country,
              holeAddress: args.holeAddress,
              administrativeArea: args.administrativeArea,
              city: args.city,
              postalCode: args.postalCode,
              street: args.street,
            },
          });
        };
        const updateStaticFeatures = async (hotelId: number, args: any) => {
          await prisma.features.update({
            where: {
              id: hotelId,
            },
            data: {
              freeCancelation: args.freeCancelation,
              accessible: args.accessible,
              familyFriendly: args.familyFriendly,
              petFriendly: args.petFriendly,
              smokerFriendly: args.smokerFriendly,
              ecoFriendly: args.ecoFriendly,
            },
          });
          await prisma.hotel.update({
            where: {
              id: hotelId,
            },
            data: {
              facilities: args.facilities.length
                ? {
                    connect: args.facilities.map((facility: string) => ({
                      name: facility,
                    })),
                  }
                : undefined,
              services: args.services.length
                ? {
                    connect: args.services.map((service: string) => ({
                      name: service,
                    })),
                  }
                : undefined,
              activities: args.activities.length
                ? {
                    connect: args.activities.map((activity: string) => ({
                      name: activity,
                    })),
                  }
                : undefined,
              languages: args.languages.length
                ? {
                    connect: args.languages.map((language: string) => ({
                      name: language,
                    })),
                  }
                : undefined,
            },
          });
        };
        const updateDinamicFeatures = async (hotelId: number, args: any) => {
          return await prisma.hotel.update({
            where: {
              id: hotelId,
            },
            data: {
              facilities: args.facilities
                ? {
                    connect: args.facilities.map((facility: string) => ({
                      name: facility,
                    })),
                  }
                : undefined,
              services: args.services
                ? {
                    connect: args.services.map((service: string) => ({
                      name: service,
                    })),
                  }
                : undefined,
              activities: args.activities
                ? {
                    connect: args.activities.map((activity: string) => ({
                      name: activity,
                    })),
                  }
                : undefined,
              languages: args.languages
                ? {
                    connect: args.languages.map((language: string) => ({
                      name: language,
                    })),
                  }
                : undefined,
            },
            include:{
              services:true,
              languages:true,
              activities:true,
              facilities:true
            }
          });
        };
        const updateGenericData = async (hotelId: number, args: any) => {
          return await prisma.hotel.update({
            where: {
              id: hotelId,
            },
            data: {
              name: args.name,
              hotelCategory: args.category
                ? { connect: { name: args.category } }
                : undefined,
              brand: args.brand,
              website: args.website,
              email: args.email,
              telephone: args.telephone,
              lowestPrice: args.lowestPrice,
              taxesAndCharges: args.taxesAndCharges,
              description: args.description,
              checkInHour: args.checkInHour,
              checkOutHour: args.checkOutHour,
              policiesAndRules: args.policiesAndRules,
            },
          });
        };
        const updateAspect = async (hotelId: number, args: any) => {
          const hotelData = await prisma.hotel.findUnique({
            where: {
              id: hotelId,
            },
          });
          if (!hotelData) return;
          //// delete change images from the cloud
          if (args.frameImage) {
            await deleteImage(hotelData.frameImage);
          }
          if (args.interiorImage) {
            await deleteImage(hotelData.interiorImage);
          }
          return await prisma.hotel.update({
            where: {
              id: hotelId,
            },
            data: {
              frameImage: args.frameImage,
              interiorImage: args.interiorImage,
            },
          });
        };
        return update(parseInt(args.userId), parseInt(args.hotelId), args);
      },
    });
  },
});
