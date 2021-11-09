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
} from 'nexus';
import { verifyIsHotelAdmin } from '../utils';
import { prisma } from '../../lib/prisma';
import type { NextApiRequest } from 'next';
export const Amenity = objectType({
  name: 'Amenity',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const RoomBed = objectType({
  name: 'RoomBed',
  definition(t) {
    t.int('roomId');
    t.string('type');
    t.int('quantity');
  },
});

export const RoomModel = objectType({
  name: 'RoomModel',
  definition(t) {
    t.id('id');
    t.int('hotelId');
    t.int('mts2');
    t.string('category');
    t.boolean('canselationFree');
    t.float('lowestPrice');
    t.string('description');
    t.string('mainImage');
    t.int('maximunGuests');
    t.int('maximunStay');
    t.int('minimunStay');
    t.list.field('beds', {
      type: 'RoomBed',
      resolve: (root) => {
        return prisma.roomBed.findMany({
          where: {
            roomModelId: root.id,
          },
        });
      },
    });
    t.list.field('images', {
      type: 'Image',
      resolve: (root) => {
        return prisma.image.findMany({
          where: {
            roomModelId: root.id,
          },
        });
      },
    });
    t.list.field('services', { type: 'Service' });
    t.list.field('amenities', { type: 'Amenity' });
    t.list.field('rooms', {
      type: list('Room'),
      resolve: (root) => {
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
    t.field('roomModel', {
      type: 'RoomModel',
      resolve: (root) => {
        return prisma.roomModel.findUnique({
          where: {
            id: root.roomModelId,
          },
        });
      },
    });
    t.list.field('bookings', {
      type: 'Booking',
      resolve: (root) => {
        return prisma.booking.findMany({
          where: {
            roomId: root.id,
          },
        });
      },
    });
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('roomModelById', {
      type: 'RoomModel',
      args: {
        id: nonNull(idArg()),
      },
      resolve(root, args, ctx) {
        return prisma.roomModel.findUnique({
          where: {
            id: args.id * 1,
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

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('creatHotelRoomModel', {
      type: 'RoomModel',
      args: {
        hotelId: nonNull(intArg()),
        lowestPrice: nonNull(intArg()),
        quantityInHotel: nonNull(intArg()),
        mts2: nonNull(intArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
        minimunStay: nonNull(intArg()),
        maximunStay: nonNull(intArg()),
        maximunGuests: nonNull(intArg()),
        mainImage: nonNull(stringArg()),
        services: nonNull(list(stringArg())),
        amenities: nonNull(list(stringArg())),
      },
      resolve(root, args, ctx) {
        type RoomModel = {
          hotelId: number;
          mts2: number;
          category: string;
          lowestPrice: number;
          description: string;
          maximunStay: number;
          minimunStay: number;
          maximunGuests: number;
          mainImage: string;
          services: string[];
          amenities: string[];
        };
        const createHotelRoomModel = async (
          req: NextApiRequest,
          args: RoomModel
        ) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.roomModel.create({
            data: {
              hotelId: args.hotelId,
              mts2: args.mts2,
              category: args.category,
              lowestPrice: args.lowestPrice,
              description: args.description,
              maximunStay: args.maximunStay,
              minimunStay: args.maximunStay,
              maximunGuests: args.maximunGuests,
              mainImage: args.mainImage,
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
        };
        return createHotelRoomModel(ctx.req, args);
      },
    });
    t.field('editRoomModelVicibility', {
      type: 'RoomModel',
      args: {
        id: nonNull(idArg()),
        hotelId: nonNull(intArg()),
        public: nonNull(booleanArg()),
      },
      resolve(root, args, ctx) {
        const editRoomModelVicibility = async (
          req: NextApiRequest,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.roomModel.update({
            where: {
              id: args.id,
            },
            data: {
              public: args.public,
            },
          });
        };
        return editRoomModelVicibility(ctx.req, args.hotelId);
      },
    });
    t.field('updateRoomModelPrice', {
      type: 'RoomModel',
      args: {
        id: nonNull(idArg()),
        hotelId: nonNull(intArg()),
        lowestPrice: nonNull(floatArg()),
      },
      resolve(root, args, ctx) {
        const updateRoomModelPrice = async (req: NextApiRequest, args: any) => {
          await verifyIsHotelAdmin(req, args.hotelId);
          return await prisma.roomModel.update({
            where: {
              id: args.id,
            },
            data: {
              lowestPrice: args.lowestPrice,
            },
          });
        };
        return updateRoomModelPrice(ctx.req, args);
      },
    });
    t.field('addRoomToHotel', {
      type: 'Room',
      args: {
        hotelId: nonNull(idArg()),
        roomModelId: nonNull(intArg()),
        number: nonNull(intArg()),
      },
      resolve: (root, args, ctx) => {
        const addNewRoom = async (args: {
          hotelId: number;
          roomModelId: number;
          number: number;
        }) => {
          await prisma.roomModel.update({
            where: {
              id: args.roomModelId,
            },
            data: {
              quantityInHotel: { increment: 1 },
            },
          });
          return await prisma.room.create({
            data: {
              hotelId: args.hotelId,
              roomModelId: args.roomModelId,
              number: args.number,
            },
          });
        };
        return addNewRoom(args);
      },
    });
  },
});
