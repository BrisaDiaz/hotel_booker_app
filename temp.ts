import {
  activities,
  services,
  facilities,
  amenities,
  roomCategories,
  bedTypes,
  hotelCategories,
  languages,
} from './prisma/data';
import {
  secondaryAdminUser,
  adminUser,
  hotels,
  roomModels,
  albums,
} from './prisma/defaultContent';

console.log(
  hotels.map((hotel) => ({
    service: hotel.category,
    isSaved: hotelCategories.includes(hotel.category),
  }))
);
