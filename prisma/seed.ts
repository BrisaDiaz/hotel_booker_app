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
} from './data';
import { secondaryAdminUser, adminUser, hotels } from './defaultContent';

async function seed() {
  try {
    await Promise.all(
      [adminUser, secondaryAdminUser].map(async (admin) => {
        const saltRounds = 10;
        const salt = await genSalt(saltRounds);
        const encryptedPassword = await hash(admin.password, salt);
        const user = await prisma.user.create({
          data: {
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: encryptedPassword,
            role: 'ADMIN',
          },
        });
        await prisma.administrator.create({
          data: {
            userId: user.id,
          },
        });
      })
    );
    await Promise.all([
      prisma.service.createMany({
        data: services.map((service) => ({
          name: service,
        })),
      }),
      prisma.facility.createMany({
        data: facilities.map((facility) => ({
          name: facility,
        })),
      }),
      prisma.amenity.createMany({
        data: amenities.map((amenity) => ({
          name: amenity,
        })),
      }),
      prisma.roomCategory.createMany({
        data: roomCategories.map((category) => ({
          name: category,
        })),
      }),
      prisma.bedType.createMany({
        data: bedTypes.map((type) => ({
          name: type,
        })),
      }),
      prisma.hotelCategory.createMany({
        data: hotelCategories.map((category) => ({
          name: category,
        })),
      }),
      prisma.language.createMany({
        data: languages.map((language) => ({
          name: language.name,
        })),
      }),
      prisma.activity.createMany({
        data: activities.map((activity) => ({
          name: activity,
        })),
      }),
    ]);

    await Promise.all(
      hotels.map(async (hotel, index) => {
        const createdHotel = await prisma.hotel.create({
          data: {
            administrator: { connect: { id: index % 2 === 0 ? 1 : 2 } },
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
            facilities: hotel.facilities.length
              ? {
                  connect: hotel.facilities.map((facility) => ({
                    name: facility.name,
                  })),
                }
              : undefined,
            services: hotel.services.length
              ? {
                  connect: hotel.services.map((service) => ({
                    name: service.name,
                  })),
                }
              : undefined,
            activities: hotel.activities.length
              ? {
                  connect: hotel.activities.map((activity) => ({
                    name: activity.name,
                  })),
                }
              : undefined,
            languages: hotel.languages.length
              ? {
                  connect: hotel.languages.map((language) => ({
                    name: language.name,
                  })),
                }
              : undefined,
          },
        });
        await prisma.address.create({
          data: {
            hotelId: createdHotel.id,
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
            hotelId: createdHotel.id,
            freeCancellation: hotel.features.freeCancellation,
            accessible: hotel.features.accessible,
            familyFriendly: hotel.features.familyFriendly,
            petFriendly: hotel.features.petFriendly,
            smokerFriendly: hotel.features.smokerFriendly,
            ecoFriendly: hotel.features.ecoFriendly,
          },
        });
        await Promise.all(
          hotel.roomModels.map(async (roomData) => {
            const roomModel = await prisma.roomModel.create({
              data: {
                hotel: { connect: { id: createdHotel.id } },
                name: roomData.name,
                mts2: roomData.mts2,
                roomCategory: { connect: { name: roomData.category } },
                lowestPrice: roomData.lowestPrice,
                taxesAndCharges: roomData.taxesAndCharges,
                cancellationFee: roomData.cancellationFee,
                description: roomData.description,
                maximumStay: roomData.maximumStay,
                minimumStay: roomData.maximumStay,
                maximumGuests: roomData.maximumGuests,
                mainImage: roomData.mainImage,
                freeCancellation: roomData.freeCancellation,
                smocking: roomData.smocking,
                services: roomData?.services.length
                  ? {
                      connect: roomData?.services?.map((service) => ({
                        name: service.name,
                      })),
                    }
                  : undefined,
                amenities: roomData?.amenities.length
                  ? {
                      connect: roomData?.amenities?.map((amenity) => ({
                        name: amenity.name,
                      })),
                    }
                  : undefined,
              },
            });
            await Promise.all(
              roomData.beds.map((bed: { type: string; quantity: number }) =>
                prisma.roomBed.create({
                  data: {
                    roomModelId: roomModel.id,
                    type: bed.type,
                    quantity: bed.quantity,
                  },
                })
              )
            );

            await prisma.album.create({
              data: {
                hotelId: createdHotel.id,
                roomModelId: roomModel.id,
                name: `Room Type ${roomModel.id}`,
                images: { create: roomData.album.images },
              },
            });
          })
        );
        await Promise.all(
          hotel.albums.map(async (album) => {
            await prisma.album.create({
              data: {
                hotelId: createdHotel.id,
                name: album.name,
                images: { create: album.images },
              },
            });
          })
        );
      })
    );

    console.log('Database has been successfully seed');
  } catch (error) {
    console.log(error);
  }
}

seed();
