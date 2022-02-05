import {
  verifyIsHotelAdmin,
  deleteImage,
  getUserIdentity,
  checkIsValidRoomRequest,
} from '../utils/index';
import { prisma } from '@/lib/prisma';
import { ValidationError } from 'apollo-server-micro';

export const createHotelRoomModel = async (
  token: string,
  hotelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  await verifyIsHotelAdmin(user.id, hotelId);
  const roomModel = await prisma.roomModel.create({
    data: {
      hotel: { connect: { id: hotelId } },
      name: args.name,
      mts2: args.mts2,
      roomCategory: { connect: { name: args.category } },
      lowestPrice: args.lowestPrice,
      taxesAndCharges: args.taxesAndCharges,
      cancellationFee: args.cancellationFee,
      description: args.description,
      maximumStay: args.maximumStay,
      minimumStay: args.maximumStay,
      maximumGuests: args.maximumGuests,
      mainImage: args.mainImage,
      freeCancellation: args.freeCancellation,
      smocking: args.smocking,
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
  const roomBeds = args.beds.map((bed: { type: string; quantity: number }) =>
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
export const updateRoomModel = async (
  token: string,
  hotelId: number,
  roomModelId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
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
    const promises = args.beds.map((bed: { type: string; quantity: number }) =>
      prisma.roomBed.create({
        data: {
          roomModelId: roomModelId,
          type: bed.type,
          quantity: bed.quantity,
        },
      })
    );
    await Promise.all(promises);
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
      cancellationFee: args.cancellationFee,
      description: args.description,
      maximumStay: args.maximumStay,
      minimumStay: args.maximumStay,
      maximumGuests: args.maximumGuests,
      mainImage,
      freeCancellation: args.freeCancellation,
      smocking: args.smocking,
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
export const deleteRooms = async (
  token: string,
  hotelId: number,
  roomModelId: number,
  roomsIds: number[]
) => {
  const user = await getUserIdentity(token);
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

export const addRooms = async (
  token: string,
  hotelId: number,
  roomModelId: number,
  roomNumbers: number[]
) => {
  const user = await getUserIdentity(token);
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

export const getRoomModel = async (roomModelId: number) => {
  return prisma.roomModel.findUnique({
    where: {
      id: roomModelId,
    },
    include: {
      amenities: true,
      services: true,
    },
  });
};
export const makeRoomAvailabilityConsult = async (
  roomModelId: number,
  args: {
    rooms: { adults: number; children: number }[];
    checkOutDate: string;
    checkInDate: string;
  }
) => {
  const roomModel = await prisma.roomModel.findUnique({
    where: {
      id: roomModelId,
    },
  });
  if (!roomModel) throw new ValidationError('Invalid room type identifier');
  const result = await checkIsValidRoomRequest({
    roomDetails: roomModel,
    rooms: args.rooms,
    checkOutDate: args.checkOutDate,
    checkInDate: args.checkInDate,
  });

  return {
    isAvailable: result.isAvailable,
    message: result.message,
  };
};
export const getRoomModelBeds = async (roomModelId: number) => {
  return prisma.roomBed.findMany({
    where: {
      roomModelId: roomModelId,
    },
  });
};

export const getRoomModelRooms = async (roomModelId: number) => {
  return prisma.room.findMany({
    where: {
      roomModelId: roomModelId,
    },
  });
};
export const getRoomModelOfRoom = async (roomModelId: number) => {
  return prisma.roomModel.findUnique({
    where: {
      id: roomModelId,
    },
  });
};
