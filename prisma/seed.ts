import { prisma } from '../lib/prisma';
import { hash, genSalt } from 'bcryptjs';

import {
  activities,
  services,
  facilities,
  amenities,
  roomCategories,
  bedTypes,
  hotelCategories,
  languages,
  adminUser,
  hotels,
} from './data';

async function seed() {
  try {

    
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    const encryptedPasswod = await hash(adminUser.password, salt);

    const admin = await prisma.user.create({
      data: {
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        password: encryptedPasswod,
        role: 'ADMIN',
      },
    });
    await prisma.administrator.create({
      data: {
        userId: admin.id,
      },
    });

    await prisma.service.createMany({
      data: services.map((service) => ({
        name: service,
      })),
    });
    await prisma.facility.createMany({
      data: facilities.map((facility) => ({
        name: facility,
      })),
    });
    await prisma.amenity.createMany({
      data: amenities.map((amenity) => ({
        name: amenity,
      })),
    });

    await prisma.roomCategory.createMany({
      data: roomCategories.map((castegory) => ({
        name: castegory,
      })),
    });
    await prisma.bedType.createMany({
      data: bedTypes.map((type) => ({
        name: type,
      })),
    });
    await prisma.hotelCategory.createMany({
      data: hotelCategories.map((castegory) => ({
        name: castegory,
      })),
    });
    await prisma.language.createMany({
      data: languages.map((language) => ({
        name: language.name,
      })),
    });
        await prisma.activity.createMany({
      data: activities.map((activity) => ({
        name: activity,
      })),
    });
    const hotelPromices = hotels.map(async(hotel)=>{
  
    
        const createdHotel=  await prisma.hotel.create({
            data: {
              administrator: { connect: { id: admin.id } },
              name: hotel.name,
              hotelCategory: { connect: { name: hotel.category } },
              brand: hotel.brand,
              website: hotel.website,
              email: hotel.email,
              telephone: hotel.telephone,
              lowestPrice: hotel.lowestPrice,
              taxesAndCharges: hotel.taxesAndCharges,
              frameImage: hotel.frameImage,
              interiorImage: hotel.interiorImage,
              description: hotel.description,
              checkInHour: hotel.checkInHour,
              checkOutHour: hotel.checkOutHour,
              policiesAndRules: hotel.policiesAndRules,
              facilities: {
                connect: hotel.facilities.map((facility: {name:string}) => ({
                  name: facility.name,
                })),
              },
              services: {
                connect: hotel.services.map((service: {name:string}) => ({
                  name: service.name,
                })),
              },
              activities: {
                connect: hotel.activities.map((activity: {name:string}) => ({
                  name: activity.name,
                })),
              },
              languages: {
                connect: hotel.languages.map((language: {name:string}) => ({
                  name: language.name,
                })),
              },
            },
          });
          await prisma.address.create({
            data: {
              hotelId: createdHotel.id * 1,
              country: hotel.address.country,
              holeAddress: hotel.address.holeAddress,
              postalCode: hotel.address.postalCode,
              administrativeArea: hotel.address.administrativeArea,
              city: hotel.address.city,
              street: hotel.address.street,
            },
          });
          await prisma.features.create({
            data: {
              hotelId: hotel.id ,
              freeCancelation: hotel.features.freeCancelation,
              accessible: hotel.features.accessible,
              familyFriendly: hotel.features.familyFriendly,
              petFriendly: hotel.features.petFriendly,
              smokerFriendly: hotel.features.smokerFriendly,
              ecoFriendly: hotel.features.ecoFriendly,
            },
          });
          return hotel;
       

})
await Promise.all(hotelPromices)
    console.log('Database has been successfully seed');
  } catch (error) {
    console.log(error);
  }
}

seed();
