import {
  objectType,
  extendType,
  idArg,
  list,
  intArg,
  stringArg,
  nonNull,
  booleanArg,
  floatArg,
  inputObjectType,
} from 'nexus';
import { verifyIsHotelAdmin, deleteImage, getUser } from '../utils/index';
import { prisma } from '../../lib/prisma';

export const Amenity = objectType({
  name: 'Amenity',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});
export const BedType = objectType({
  name: 'BedType',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const RoomBed = objectType({
  name: 'RoomBed',
  definition(t) {
    t.id('id');
    t.int('roomModelId');
    t.string('type');
    t.int('quantity');
  },
});
export const RoomCategory = objectType({
  name: 'RoomCategory',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const RoomModel = objectType({
  name: 'RoomModel',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.field('hotel', {
      type: 'Hotel',
      resolve: (root: any): any => {
        return prisma.hotel.findUnique({
          where: {
            id: root.hotelId,
          },
        });
      },
    });
    t.string('name');
    t.int('mts2');
    t.string('category');
    t.boolean('canselationFree');
    t.float('lowestPrice');
    t.float('taxesAndCharges');
    t.float('cancelationFee');
    t.string('description');
    t.string('mainImage');
    t.int('maximunGuests');
    t.int('maximunStay');
    t.int('minimunStay');
    t.boolean('freeCancelation');
    t.boolean('smooking');
    t.list.field('beds', {
      type: 'RoomBed',
      resolve: (root: any): any => {
        return prisma.roomBed.findMany({
          where: {
            roomModelId: root.id,
          },
        });
      },
    });
    t.list.field('album', {
      type: 'Album',
      resolve: (root: any): any => {
        return prisma.album.findUnique({
          where: {
            roomModelId: root.id,
          },
        });
      },
    });
    t.int('imagesCount', {
      resolve(root: any): any {
        return prisma.image.count({
          where: {
            album: {
              roomModelId: root.id,
            },
          },
        });
      },
    }),
      t.list.field('miniatures', {
        type: 'Image',
        resolve(root: any): any {
          return prisma.image.findMany({
            take: 6,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              album: {
                roomModelId: root.id,
              },
            },
          });
        },
      });
    t.list.field('services', { type: 'Service' });
    t.list.field('amenities', { type: 'Amenity' });
    t.list.field('rooms', {
      type: 'Room',
      resolve: (root: any): any => {
        return prisma.room.findMany({
          where: {
            roomModelId: root.id,
          },
        });
      },
    });
  },
});
export const Room = objectType({
  name: 'Room',
  definition(t) {
    t.id('id');
    t.int('roomModelId');
    t.int('number');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve: (root: any): any => {
        return prisma.roomModel.findUnique({
          where: {
            id: root.roomModelId,
          },
        });
      },
    });
    t.list.field('bookings', {
      type: 'Booking',
    });
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('roomModelById', {
      type: 'RoomModel',
      args: {
        roomModelId: nonNull(idArg()),
      },
      resolve(root, args, ctx): any {
        return prisma.roomModel.findUnique({
          where: {
            id: parseInt(args.roomModelId),
          },
          include: {
            amenities: true,
            services: true,
          },
        });
      },
    });
  },
});
export const bedsSpecifications = inputObjectType({
  name: 'bedsSpecifications',
  definition(t) {
    t.string('type');
    t.int('quantity');
  },
});
export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('creatHotelRoomModel', {
      type: 'RoomModel',
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(idArg()),
        lowestPrice: nonNull(floatArg()),
        taxesAndCharges: nonNull(floatArg()),
        cancelationFee: floatArg(),
        name: nonNull(stringArg()),
        mts2: nonNull(intArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
        minimunStay: nonNull(intArg()),
        maximunStay: intArg(),
        maximunGuests: nonNull(intArg()),
        mainImage: nonNull(stringArg()),
        services: nonNull(list(stringArg())),
        amenities: nonNull(list(stringArg())),
        freeCancelation: nonNull(booleanArg()),
        smooking: nonNull(booleanArg()),
        beds: nonNull(list(bedsSpecifications)),
      },
      resolve(root, args, ctx): any {
        const hotelId = parseInt(args.hotelId);

        const createHotelRoomModel = async (
          token: string,
          hotelId: number,
          args: any
        ) => {
          const user = await getUser(token);
          await verifyIsHotelAdmin(user.id, hotelId);
          const roomModel = await prisma.roomModel.create({
            data: {
              hotel: { connect: { id: hotelId } },
              name: args.name,
              mts2: args.mts2,
              roomCategory: { connect: { name: args.category } },
              lowestPrice: args.lowestPrice,
              taxesAndCharges: args.taxesAndCharges,
              cancelationFee: args.cancelationFee,
              description: args.description,
              maximunStay: args.maximunStay,
              minimunStay: args.maximunStay,
              maximunGuests: args.maximunGuests,
              mainImage: args.mainImage,
              freeCancelation: args.freeCancelation,
              smooking: args.smooking,
              services: {
                connect: args?.services?.map((service: string) => ({
                  name: service,
                })),
              },
              amenities: {
                connect: args?.amenities?.map((item: string) => ({
                  name: item,
                })),
              },
            },
          });
          const roomBeds = args.beds.map(
            (bed: { type: string; quantity: number }) =>
              prisma.roomBed.create({
                data: {
                  roomModelId: roomModel.id,
                  type: bed.type,
                  quantity: bed.quantity,
                },
              })
          );
          await prisma.album.create({
            data: {
              hotelId: hotelId,
              roomModelId: roomModel.id,
              name: `Room Type ${roomModel.id}`,
            },
          });
          await Promise.all(roomBeds);
          return roomModel;
        };
        return createHotelRoomModel(args.token, hotelId, args);
      },
    });

    t.field('updateRoomModel', {
      type: 'RoomModel',
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(idArg()),
        roomModelId: nonNull(idArg()),
        lowestPrice: floatArg(),
        taxesAndCharges: floatArg(),
        cancelationFee: floatArg(),
        name: stringArg(),
        mts2: intArg(),
        category: stringArg(),
        description: stringArg(),
        minimunStay: intArg(),
        maximunStay: intArg(),
        maximunGuests: intArg(),
        mainImage: stringArg(),
        services: list(stringArg()),
        amenities: list(stringArg()),
        freeCancelation: booleanArg(),
        smooking: booleanArg(),
        beds: list(bedsSpecifications),
      },
      resolve(root, args, ctx): any {
        const updateRoomModel = async (
          token: string,
          hotelId: number,
          roomModelId: number,
          args: any
        ) => {
          const user = await getUser(token);
          await verifyIsHotelAdmin(user.id, hotelId);
          let mainImage;
          if (args.mainImage) {
            const roomModel = await prisma.roomModel.findUnique({
              where: {
                id: roomModelId,
              },
            });
            if (!roomModel) return;
            //// delete change images from the cloud

            await deleteImage(roomModel.mainImage);

            mainImage = args.mainImage;
          }
          if (args.beds?.length) {
            await prisma.roomBed.deleteMany({
              where: {
                roomModelId: roomModelId,
              },
            });
            const promices = args.beds.map(
              (bed: { type: string; quantity: number }) =>
                prisma.roomBed.create({
                  data: {
                    roomModelId: roomModelId,
                    type: bed.type,
                    quantity: bed.quantity,
                  },
                })
            );
            await Promise.all(promices);
          }
          return prisma.roomModel.update({
            where: {
              id: roomModelId,
            },
            data: {
              name: args.name,
              mts2: args.mts2,
              roomCategory: args.category
                ? {
                    connect: { name: args.category },
                  }
                : undefined,
              lowestPrice: args.lowestPrice,
              taxesAndCharges: args.taxesAndCharges,
              cancelationFee: args.cancelationFee,
              description: args.description,
              maximunStay: args.maximunStay,
              minimunStay: args.maximunStay,
              maximunGuests: args.maximunGuests,
              mainImage,
              freeCancelation: args.freeCancelation,
              smooking: args.smooking,
              services: args.services?.length
                ? {
                    connect: args?.services?.map((service: string) => ({
                      name: service,
                    })),
                  }
                : undefined,
              amenities: args.amenities?.length
                ? {
                    connect: args?.amenities?.map((item: string) => ({
                      name: item,
                    })),
                  }
                : undefined,
            },
            include: {
              services: true,
              amenities: true,
            },
          });
        };
        return updateRoomModel(
          args.token,
          parseInt(args.hotelId),
          parseInt(args.roomModelId),
          args
        );
      },
    });

    t.field('addRoomToModel', {
      type: list('Room'),
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(idArg()),
        roomModelId: nonNull(idArg()),
        roomNumbers: nonNull(list(nonNull(intArg()))),
      },
      resolve: (root, args, ctx): any => {
        const userId = args.token;
        const hotelId = parseInt(args.hotelId);
        const roomModelId = parseInt(args.roomModelId);

        const deleteRooms = async (
          token: string,
          hotelId: number,
          roomModelId: number,
          roomNumbers: number[]
        ) => {
          const user = await getUser(token);
          await verifyIsHotelAdmin(user.id, hotelId);
          const roomsInHotel = await prisma.room.findMany({
            where: {
              hotelId: hotelId,
            },
          });

          const roomsNumbersInHotel = roomsInHotel.map(
            (room: { number: number }) => room.number
          );

          const roomsAllowed = roomNumbers.filter(
            (number) => !roomsNumbersInHotel.includes(number)
          );

          if (roomsAllowed.length) {
            await prisma.room.createMany({
              data: roomNumbers.map((number) => ({
                hotelId,
                number,
                roomModelId,
              })),
            });

            return prisma.room.findMany({
              where: {
                roomModelId,
              },
            });
          }
          return [];
        };
        return deleteRooms(userId, hotelId, roomModelId, args.roomNumbers);
      },
    });
    t.field('deleteRoomOfModel', {
      type: list('Room'),
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(idArg()),
        roomModelId: nonNull(idArg()),
        roomsIds: nonNull(list(nonNull(intArg()))),
      },
      resolve: (root, args, ctx): any => {
        const hotelId = parseInt(args.hotelId);
        const roomModelId = parseInt(args.roomModelId);

        const deleteRooms = async (
          token: string,
          hotelId: number,
          roomModelId: number,
          roomsIds: number[]
        ) => {
          const user = await getUser(token);
          await verifyIsHotelAdmin(user.id, hotelId);

          await prisma.room.deleteMany({
            where: {
              OR: roomsIds.map((id) => ({ id: id })),
            },
          });

          return prisma.room.findMany({
            where: {
              roomModelId,
            },
          });
        };
        return deleteRooms(args.token, hotelId, roomModelId, args.roomsIds);
      },
    });
  },
});
