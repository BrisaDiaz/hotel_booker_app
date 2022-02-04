import {
  objectType,
  extendType,
  list,
  intArg,
  stringArg,
  nonNull,
} from 'nexus';
import { prisma } from '../../lib/prisma';

export const HotelSuggestion = objectType({
  name: 'HotelSuggestion',
  description: 'hotel query search suggestion',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('address');
  },
});

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('hotelSearchSuggestions', {
      type: list(HotelSuggestion),
      args: {
        take: intArg({ default: 4 }),
        search: nonNull(stringArg()),
      },
      resolve(root, args, ctx): any {
        const getHotelSuggestions = async (args: {
          take: number | null;
          search: string;
        }) => {
          const hotels = await prisma.hotel.findMany({
            take: args.take || 4,
            where: {
              OR: [
                { name: { contains: args.search, mode: 'insensitive' } },

                {
                  address: {
                    holeAddress: { contains: args.search, mode: 'insensitive' },
                  },
                },
              ],
            },
            select: {
              id: true,
              name: true,
              address: {
                select: {
                  holeAddress: true,
                },
              },
            },
          });

          return hotels.map((hotel) => ({
            id: hotel.id,
            name: hotel.name,
            address: hotel.address?.holeAddress,
          }));
        };
        return getHotelSuggestions(args);
      },
    });
  },
});
