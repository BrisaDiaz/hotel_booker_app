import { prisma } from '@/lib/prisma';

export const getHotelCategories = async () => {
  return prisma.hotelCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getRoomCategories = async () => {
  return prisma.roomCategory.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getBedTypes = async () => {
  return prisma.bedType.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getLanguages = async () => {
  return prisma.language.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getActivities = async () => {
  return prisma.activity.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getServices = async () => {
  return prisma.service.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getFacilities = async () => {
  return prisma.facility.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getAmenities = async () => {
  return prisma.amenity.findMany({
    orderBy: {
      name: 'asc',
    },
  });
};
export const getFeatures = async () => {
  return [
    { id: 1, name: 'freeCancellation' },
    { id: 2, name: 'accessible' },
    { id: 3, name: 'petFriendly' },
    { id: 4, name: 'familyFriendly' },
    { id: 5, name: 'ecoFriendly' },
    { id: 6, name: 'smokerFriendly' },
  ];
};
export const getHotelsWithFacilityCount = async (facilityId: number) => {
  return prisma.hotel.count({
    where: {
      facilities: {
        some: { id: facilityId },
      },
    },
  });
};
export const getHotelsWithActivityCount = async (activityId: number) => {
  return prisma.hotel.count({
    where: {
      activities: {
        some: { id: activityId },
      },
    },
  });
};
export const getHotelsWithServiceCount = async (serviceId: number) => {
  return prisma.hotel.count({
    where: {
      services: {
        some: { id: serviceId },
      },
    },
  });
};
export const getHotelsWithLanguageCount = async (languageId: number) => {
  return prisma.hotel.count({
    where: {
      languages: {
        some: { id: languageId },
      },
    },
  });
};
export const getHotelsOfCategoryCount = async (category: string) => {
  return prisma.hotel.count({
    where: {
      category: {
        equals: category,
      },
    },
  });
};
export const getHotelsWithFeatureCount = async (feature: string) => {
  return prisma.features.count({
    where: {
      [feature]: { equals: true },
    },
  });
};
