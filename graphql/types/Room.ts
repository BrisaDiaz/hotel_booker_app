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
import { verifyIsHotelAdmin } from '../utils/index';
import { prisma } from '../../lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RoomBuildierVariables } from '@/interfaces/';
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
    t.int('roomId');
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
    t.string('name');
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
        hotelId: nonNull(intArg()),
        lowestPrice: nonNull(intArg()),
        taxesAndCharges: nonNull(intArg()),
        name: nonNull(stringArg()),
        mts2: nonNull(intArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
        minimunStay: nonNull(intArg()),
        maximunStay: nonNull(intArg()),
        maximunGuests: nonNull(intArg()),
        mainImage: nonNull(stringArg()),
        services: nonNull(list(stringArg())),
        amenities: nonNull(list(stringArg())),
        freeCancelation: nonNull(booleanArg()),
        smooking: nonNull(booleanArg()),
        beds: nonNull(list(bedsSpecifications)),
      },
      resolve(root, args, ctx) {
        const createHotelRoomModel = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: RoomBuildierVariables
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
          const roomModel = await prisma.roomModel.create({
            data: {
              hotelId: args.hotelId,
              name: args.name,
              mts2: args.mts2,
              category: { connect: { name: args.category } },
              lowestPrice: args.lowestPrice,
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
const roomBeds = args.beds.map((bed) => prisma.roomBed.create({data:{
  roomModelId:roomModel.id
  type:bed.type,
  quantity:bed:quantity
}}));
await Promise.all(roomBeds)
return roomModel

        };
        return createHotelRoomModel(ctx.req, ctx.res, args);
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
          res: NextApiResponse,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
          return await prisma.roomModel.update({
            where: {
              id: args.id,
            },
            data: {
              public: args.public,
            },
          });
        };
        return editRoomModelVicibility(ctx.req, ctx.res, args.hotelId);
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
        const updateRoomModelPrice = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args: any
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
          return await prisma.roomModel.update({
            where: {
              id: args.id,
            },
            data: {
              lowestPrice: args.lowestPrice,
            },
          });
        };
        return updateRoomModelPrice(ctx.req, ctx.res, args);
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
        const addNewRoom = async (
          req: NextApiRequest,
          res: NextApiResponse,
          args
        ) => {
          await verifyIsHotelAdmin(req, res, args.hotelId);
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
        return addNewRoom(ctx.req, ctx.res, args);
      },
    });
  },
});
