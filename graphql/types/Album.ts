import {
  objectType,
  extendType,
  idArg,
  list,
  stringArg,
  nonNull,
  intArg,
} from 'nexus';
import { verifyIsHotelAdmin, deleteImage, getUser } from '../utils/index';
import { UserInputError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';

export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.id('id');
    t.string('src');
    t.int('albumId');
  },
});
export const Album = objectType({
  name: 'Album',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('hotelId');
    t.int('roomModelId');
    t.list.field('images', {
      type: 'Image',
      resolve(root: any): any {
        return prisma.image.findMany({
          where: {
            albumId: root.id,
          },
        });
      },
    });
    t.string('createdAt');
  },
});

export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAlbum', {
      type: Album,
      args: {
        token: nonNull(stringArg()),
        hotelId: nonNull(idArg()),
        roomModelId: idArg(),
        name: nonNull(stringArg()),
        images: list(stringArg()),
      },
      resolve(root, args, ctx): any {
        const createAlbum = async (
          token: string,
          hotelId: number,
          roomModelId: number | undefined,
          args: any
        ) => {
          const user = await getUser(token);
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
        return createAlbum(
          args.token,
          parseInt(args.hotelId),
          args.roomModelId ? parseInt(args.roomModelId) : undefined,
          args
        );
      },
    });
    t.field('updateAlbum', {
      type: Album,
      args: {
        token: nonNull(stringArg()),
        albumId: nonNull(idArg()),
        name: stringArg(),
        images: list(stringArg()),
      },
      resolve(root, args, ctx): any {
        const updateAlbum = async (
          token: string,
          albumId: number,
          args: any
        ) => {
          const user = await getUser(token);
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
          const storagedUrls: string[] = [];
          const toCreateImagesUrls: string[] = [];

          albumFound.images.forEach((img: { id: number; src: string }) => {
            !args.images.includes(img.src) && toDeleteImgs.push(img);
            storagedUrls.push(img.src);
          });
          args.images.forEach((url: string) => {
            !storagedUrls.includes(url) && toCreateImagesUrls.push(url);
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
        return updateAlbum(args.token, parseInt(args.albumId), args);
      },
    });
    t.field('deleteAlbum', {
      type: Album,
      args: {
        token: nonNull(stringArg()),
        albumId: nonNull(idArg()),
      },
      resolve(root, args, ctx): any {
        const deleteAlbum = async (token: string, albumId: number) => {
          const user = await getUser(token);
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
        return deleteAlbum(args.token, parseInt(args.albumId));
      },
    });
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('roomModelAlbum', {
      type: Album,
      args: {
        roomModelId: nonNull(idArg()),
      },
      resolve(root, args): any {
        return prisma.album.findUnique({
          where: {
            id: parseInt(args.roomModelId),
          },
        });
      },
    }),
      t.field('hotelAlbums', {
        type: list(Album),
        args: {
          hotelId: nonNull(idArg()),
        },
        resolve(root, args): any {
          return prisma.album.findMany({
            where: {
              hotelId: parseInt(args.hotelId),
            },
          });
        },
      }),
      t.field('hotelImages', {
        type: list(Image),
        args: {
          hotelId: nonNull(idArg()),
          take: intArg(),
          skip: intArg(),
        },
        resolve(root, args): any {
          return prisma.image.findMany({
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              album: {
                hotelId: parseInt(args.hotelId),
              },
            },
          });
        },
      }),
      t.field('roomModelImages', {
        type: list(Image),
        args: {
          roomModelId: nonNull(idArg()),
          take: intArg(),
          skip: intArg(),
        },
        resolve(root, args): any {
          return prisma.image.findMany({
            take: args.take || undefined,
            skip: args.skip || undefined,
            orderBy: {
              createdAt: 'desc',
            },
            where: {
              album: {
                roomModelId: parseInt(args.roomModelId),
              },
            },
          });
        },
      }),
      t.field('albumImages', {
        type: list(Image),
        args: {
          albumId: nonNull(idArg()),
        },
        resolve(root, args): any {
          return prisma.image.findMany({
            where: {
              albumId: parseInt(args.albumId),
            },
          });
        },
      });
  },
});
