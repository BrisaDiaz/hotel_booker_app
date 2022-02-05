import {
  objectType,
  extendType,
  list,
  intArg,
  stringArg,
  nonNull,
  booleanArg,
  floatArg,
  inputObjectType,
} from 'nexus';

import {
  createHotelRoomModel,
  updateRoomModel,
  deleteRooms,
  addRooms,
  getRoomModel,
  makeRoomAvailabilityConsult,
  getRoomModelBeds,
  getRoomModelRooms,
  getRoomModelOfRoom,
} from '../services/Room';
import { checkRoomsAvailable } from '../utils/index';
import { roomSpecifications } from './Booking';
import { getHotel } from '../services/Hotel';
import {
  getRoomModelAlbum,
  getRoomModelImagesCount,
  getRoomModelImages,
} from '../services/Album';
export const Amenity = objectType({
  name: 'Amenity',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});
export const BedType = objectType({
  name: 'BedType',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});

export const RoomBed = objectType({
  name: 'RoomBed',
  definition(t) {
    t.int('id');
    t.int('roomModelId');
    t.string('type');
    t.int('quantity');
  },
});
export const RoomCategory = objectType({
  name: 'RoomCategory',
  definition(t) {
    t.int('id');
    t.string('name');
  },
});
export const RoomConsultResponse = objectType({
  name: 'RoomConsultResponse',
  definition(t) {
    t.string('message');
    t.boolean('isAvailable');
  },
});
export const RoomModel = objectType({
  name: 'RoomModel',
  definition(t) {
    t.int('id');
    t.int('hotelId');
    t.field('hotel', {
      type: 'Hotel',
      resolve: (root: any): any => {
        return getHotel(root.hotelId);
      },
    });
    t.string('name');
    t.int('mts2');
    t.string('category');
    t.boolean('FreeCancellation');
    t.float('lowestPrice');
    t.float('taxesAndCharges');
    t.float('cancellationFee');
    t.string('description');
    t.string('mainImage');
    t.int('maximumGuests');
    t.int('maximumStay');
    t.int('minimumStay');
    t.boolean('freeCancellation');
    t.boolean('smocking');
    t.list.field('beds', {
      type: 'RoomBed',
      resolve: (root: any): any => {
        return getRoomModelBeds(root.id);
      },
    });
    t.list.field('album', {
      type: 'Album',
      resolve: (root: any): any => {
        return getRoomModelAlbum(root.id);
      },
    });
    t.int('imagesCount', {
      resolve(root: any): any {
        return getRoomModelImagesCount(root.id);
      },
    }),
      t.list.field('miniatures', {
        type: 'Image',
        resolve(root: any): any {
          return getRoomModelImages(root.id, { take: 6 });
        },
      });
    t.list.field('services', { type: 'Service' });
    t.list.field('amenities', { type: 'Amenity' });
    t.list.field('rooms', {
      type: 'Room',
      resolve: (root: any): any => {
        return getRoomModelRooms(root.id);
      },
    });
  },
});
export const Room = objectType({
  name: 'Room',
  definition(t) {
    t.int('id');
    t.int('roomModelId');
    t.int('number');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve: (root: any): any => {
        return getRoomModelOfRoom(root.roomModelId);
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
        roomModelId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return getRoomModel(args.roomModelId);
      },
    });
    t.field('getRoomModelAvailableRooms', {
      type: list('Room'),
      args: {
        roomModelId: nonNull(intArg()),
        checkOutDate: nonNull(stringArg()),
        checkInDate: nonNull(stringArg()),
        rooms: nonNull(list(nonNull(roomSpecifications))),
      },
      resolve: (root, args: any, ctx): any => {
        return checkRoomsAvailable({
          roomModelId: parseInt(args.roomModelId),
          roomsRequired: args.rooms.length,
          checkOutDate: args.checkOutDate,
          checkInDate: args.checkInDate,
        });
      },
    });
    t.field('checkRoomAvailability', {
      type: RoomConsultResponse,
      args: {
        roomModelId: nonNull(intArg()),
        checkOutDate: nonNull(stringArg()),
        checkInDate: nonNull(stringArg()),
        rooms: nonNull(list(roomSpecifications)),
      },
      resolve: (root, args: any, ctx) => {
        type RoomSpecifications = {
          adults: number;
          children: number;
        };

        return makeRoomAvailabilityConsult(args.roomModelId, args);
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
        hotelId: nonNull(intArg()),
        lowestPrice: nonNull(floatArg()),
        taxesAndCharges: nonNull(floatArg()),
        cancellationFee: floatArg(),
        name: nonNull(stringArg()),
        mts2: nonNull(intArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
        minimumStay: nonNull(intArg()),
        maximumStay: intArg(),
        maximumGuests: nonNull(intArg()),
        mainImage: nonNull(stringArg()),
        services: nonNull(list(stringArg())),
        amenities: nonNull(list(stringArg())),
        freeCancellation: nonNull(booleanArg()),
        smocking: nonNull(booleanArg()),
        beds: nonNull(list(bedsSpecifications)),
      },
      resolve(root, args, ctx): any {
        return createHotelRoomModel(args.token, args.hotelId, args);
      },
    });

    t.field('updateRoomModel', {
      type: 'RoomModel',
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(intArg()),
        roomModelId: nonNull(intArg()),
        lowestPrice: floatArg(),
        taxesAndCharges: floatArg(),
        cancellationFee: floatArg(),
        name: stringArg(),
        mts2: intArg(),
        category: stringArg(),
        description: stringArg(),
        minimumStay: intArg(),
        maximumStay: intArg(),
        maximumGuests: intArg(),
        mainImage: stringArg(),
        services: list(stringArg()),
        amenities: list(stringArg()),
        freeCancellation: booleanArg(),
        smocking: booleanArg(),
        beds: list(bedsSpecifications),
      },
      resolve(root, args, ctx): any {
        return updateRoomModel(
          args.token,
          args.hotelId,
          args.roomModelId,
          args
        );
      },
    });

    t.field('addRoomToModel', {
      type: list('Room'),
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(intArg()),
        roomModelId: nonNull(intArg()),
        roomNumbers: nonNull(list(nonNull(intArg()))),
      },
      resolve: (root, args, ctx): any => {
        return addRooms(
          args.token,
          args.hotelId,
          args.roomModelId,
          args.roomNumbers
        );
      },
    });
    t.field('deleteRoomsOfModel', {
      type: list('Room'),
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(intArg()),
        roomModelId: nonNull(intArg()),
        roomsIds: nonNull(list(nonNull(intArg()))),
      },
      resolve: (root, args, ctx): any => {
        return deleteRooms(
          args.token,
          args.hotelId,
          args.roomModelId,
          args.roomsIds
        );
      },
    });
  },
});
