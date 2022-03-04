import {
  verifyIsHotelAdmin,
  deleteImage,
  getUserIdentity,
} from '../utils/index';
import { UserInputError } from 'apollo-server-micro';
import { prisma } from '@/lib/prisma';
export const updateAlbum = async (
  token: string,
  albumId: number,
  args: any
) => {
  const user = await getUserIdentity(token);
  const albumFound = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    include: {
      images: true,
    },
  });
  if (!albumFound) throw new UserInputError('Invalid album identifier');
  verifyIsHotelAdmin(user.id, albumFound.hotelId);

  if (!args.images) {
    return prisma.album.update({
      where: {
        id: albumId,
      },
      data: {
        name: args.name,
      },
    });
  }
  const toDeleteImgs: { id: number; src: string }[] = [];
  const savedUrls: string[] = [];
  const toCreateImagesUrls: string[] = [];

  albumFound.images.forEach((img: { id: number; src: string }) => {
    !args.images.includes(img.src) && toDeleteImgs.push(img);
    savedUrls.push(img.src);
  });
  args.images.forEach((url: string) => {
    !savedUrls.includes(url) && toCreateImagesUrls.push(url);
  });

  //// delete the removed images
  await Promise.all(
    toDeleteImgs.map(async (img: { src: string; id: number }) => {
      await prisma.image.delete({
        where: { id: img.id },
      });
      await deleteImage(img.src);
    })
  );

  /// create added images
  await Promise.all(
    toCreateImagesUrls.map(async (url: string) => {
      await prisma.image.create({
        data: {
          albumId: albumFound.id,
          src: url,
        },
      });
    })
  );

  const album = await prisma.album.update({
    where: {
      id: albumId,
    },
    data: {
      name: args.name,
    },
  });
  return album;
};
export const deleteAlbum = async (token: string, albumId: number) => {
  const user = await getUserIdentity(token);
  const albumFound = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    include: {
      images: true,
    },
  });
  if (!albumFound) throw new UserInputError('Invalid album identifier');
  verifyIsHotelAdmin(user.id, albumFound.hotelId);

  await Promise.all(
    albumFound.images.map(async (img: { src: string; id: number }) => {
      await prisma.image.delete({
        where: { id: img.id },
      });
      await deleteImage(img.src);
    })
  );
  await prisma.album.delete({
    where: {
      id: albumId,
    },
  });
  return albumFound;
};
export const createAlbum = async (
  token: string,
  hotelId: number,
  roomModelId: number | undefined,
  args: any
) => {
  const user = await getUserIdentity(token);
  verifyIsHotelAdmin(user.id, hotelId);
  const album = await prisma.album.create({
    data: {
      hotelId: hotelId,
      roomModelId: roomModelId,
      name: args.name,

      images: args.images?.length
        ? {
            create: args.images.map((imgSrc: string) => ({
              src: imgSrc,
            })),
          }
        : undefined,
    },
  });
  return album;
};
export const getRoomModelImages = async (roomModelId: number, args: any) => {
  return prisma.image.findMany({
    take: args.take || undefined,
    skip: args.skip || undefined,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      album: {
        roomModelId: roomModelId,
      },
    },
  });
};
export const getAlbumImages = async (albumId: number) => {
  return prisma.image.findMany({
    where: {
      albumId: albumId,
    },
  });
};
export const getHotelImages = async (hotelId: number, args: any) => {
  return prisma.image.findMany({
    take: args.take || undefined,
    skip: args.skip || 0,
    orderBy: {
      id: 'desc',
    },
    where: {
      album: {
        hotelId: hotelId,
      },
    },
  });
};
export const getHotelAlbums = async (hotelId: number) => {
  return prisma.album.findMany({
    where: {
      hotelId: hotelId,
    },
  });
};
export const getRoomModelAlbum = async (roomModelId: number) => {
  return prisma.album.findUnique({
    where: {
      id: roomModelId,
    },
  });
};
export const getRoomModelImagesCount = async (roomModelId: number) => {
  return prisma.image.count({
    where: {
      album: {
        roomModelId,
      },
    },
  });
};
export const getHotelImagesCount = async (hotelId: number) => {
  return prisma.image.count({
    where: {
      album: {
        hotelId,
      },
    },
  });
};
