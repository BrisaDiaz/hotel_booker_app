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

    console.log('Database has been successfully seed');
  } catch (error) {
    console.log(error);
  }
}

seed();
