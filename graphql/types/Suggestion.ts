import {
  objectType,
  extendType,
  list,
  intArg,
  stringArg,
  nonNull,
} from 'nexus';
import { getHotelSuggestions } from '../services/Hotel';

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
        return getHotelSuggestions(args);
      },
    });
  },
});
