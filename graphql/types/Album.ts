import {
  objectType,
  extendType,
  list,
  stringArg,
  nonNull,
  intArg,
} from 'nexus';

import {
  updateAlbum,
  deleteAlbum,
  createAlbum,
  getRoomModelImages,
  getAlbumImages,
  getHotelImages,
  getHotelAlbums,
  getRoomModelAlbum,
} from '../services/Album';
export const Image = objectType({
  name: 'Image',
  definition(t) {
    t.int('id');
    t.string('src');
    t.int('albumId');
  },
});
export const Album = objectType({
  name: 'Album',
  definition(t) {
    t.int('id');
    t.string('name');
    t.int('hotelId');
    t.int('roomModelId');
    t.list.field('images', {
      type: 'Image',
      resolve(root: any): any {
        return getAlbumImages(root.id);
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
        hotelId: nonNull(intArg()),
        roomModelId: intArg(),
        name: nonNull(stringArg()),
        images: list(stringArg()),
      },
      resolve(root, args, ctx): any {
        return createAlbum(
          args.token,
          args.hotelId,
          args.roomModelId ? args.roomModelId : undefined,
          args
        );
      },
    });
    t.field('updateAlbum', {
      type: Album,
      args: {
        token: nonNull(stringArg()),
        albumId: nonNull(intArg()),
        name: stringArg(),
        images: list(stringArg()),
      },
      resolve(root, args, ctx): any {
        return updateAlbum(args.token, args.albumId, args);
      },
    });
    t.field('deleteAlbum', {
      type: Album,
      args: {
        token: nonNull(stringArg()),
        albumId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return deleteAlbum(args.token, args.albumId);
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
        roomModelId: nonNull(intArg()),
      },
      resolve(root, args): any {
        return getRoomModelAlbum(args.roomModelId);
      },
    }),
      t.field('hotelAlbums', {
        type: list(Album),
        args: {
          hotelId: nonNull(intArg()),
        },
        resolve(root, args): any {
          return getHotelAlbums(args.hotelId);
        },
      }),
      t.field('hotelImages', {
        type: list(Image),
        args: {
          hotelId: nonNull(intArg()),
          take: intArg(),
          skip: intArg(),
        },
        resolve(root, args): any {
          return getHotelImages(args.hotelId, args);
        },
      }),
      t.field('roomModelImages', {
        type: list(Image),
        args: {
          roomModelId: nonNull(intArg()),
          take: intArg(),
          skip: intArg(),
        },
        resolve(root, args): any {
          return getRoomModelImages(args.roomModelId, args);
        },
      }),
      t.field('albumImages', {
        type: list(Image),
        args: {
          albumId: nonNull(intArg()),
        },
        resolve(root, args): any {
          return getAlbumImages(args.albumId);
        },
      });
  },
});
