import { prisma } from '@/lib/prisma';

import {
  getAdminInfo,
  verifyIsHotelAdmin,
  hotelQueryConstructor,
  deleteImage,
  getHotelFieldsToEdit,
  HotelQueryArgs,
  getUserIdentity,
} from '../utils/index';

export const createHotel = async (token: string, args: any) => {
  const user = await getUserIdentity(token);
  const admin = await getAdminInfo(user.id);

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
      freeCancellation: args.freeCancellation,
      accessible: args.accessible,
      familyFriendly: args.familyFriendly,
      petFriendly: args.petFriendly,
      smokerFriendly: args.smokerFriendly,
      ecoFriendly: args.ecoFriendly,
    },
  });
  return hotel;
};
export const updateHotel = async (
  token: string,
  hotelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  verifyIsHotelAdmin(user.id, hotelId);
  const toEditFields = getHotelFieldsToEdit(args);

  let hotelUpdated;
  console.log(toEditFields);
  if (toEditFields.includes('address')) {
    await updateAddress(hotelId, args);
  }
  if (toEditFields.includes('staticFeatures')) {
    await updateStaticFeatures(hotelId, args);
  }
  if (toEditFields.includes('dynamicFeatures')) {
    hotelUpdated = await updateDynamicFeatures(hotelId, args);
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
      include: {
        features: true,
        address: true,
      },
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
      freeCancellation: args.freeCancellation,
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
const updateDynamicFeatures = async (hotelId: number, args: any) => {
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
    include: {
      services: true,
      languages: true,
      activities: true,
      facilities: true,
    },
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

export const searchHotels = async (args: HotelQueryArgs) => {
  const query = hotelQueryConstructor(args);
  const hotels = await prisma.hotel.findMany(query);
  const totalResults: number = await prisma.hotel.count({
    where: query.where,
  });
  const pageCount: number = Math.floor(totalResults / query.take);
  return { hotels, totalResults, pageCount };
};

export const getHotel = async (hotelId: number) => {
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

export const getHotelRoomModels = async (hotelId: number) => {
  return prisma.roomModel.findMany({
    where: {
      hotelId: hotelId,
    },
  });
};
export const getHotelSuggestions = async (args: {
  take: number | null;
  search: string;
}) => {
  const hotels = await prisma.hotel.findMany({
    take: args.take || 4,
    where: {
      OR: [
        { name: { contains: args.search, mode: 'insensitive' } },

        {
          address: {
            holeAddress: { contains: args.search, mode: 'insensitive' },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      address: {
        select: {
          holeAddress: true,
        },
      },
    },
  });

  return hotels.map((hotel) => ({
    id: hotel.id,
    name: hotel.name,
    address: hotel.address?.holeAddress,
  }));
};
export const getHotelFeatures = async (hotelId: number) => {
  return prisma.features.findUnique({
    where: {
      hotelId,
    },
  });
};
export const getHotelAddress = async (hotelId: number) => {
  return prisma.address.findUnique({
    where: {
      hotelId,
    },
  });
};
export const getGuestsCount = async (hotelId: number) => {
  return prisma.client.count({
    where: {
      bookings: {
        some: {
          hotelId,
          status: 'ACTIVE',
        },
      },
    },
  });
};

export const getBookingsCount = async (hotelId: number) => {
  return prisma.booking.count({
    where: {
      hotelId,
    },
  });
};

export const getRequestsCount = async (hotelId: number) => {
  return prisma.bookingRequest.count({
    where: {
      hotelId,
      status: 'PENDING',
    },
  });
};
export const getRoomModelsCount = async (hotelId: number) => {
  return prisma.roomModel.count({
    where: {
      hotelId,
    },
  });
};
