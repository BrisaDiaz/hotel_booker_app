import {
  objectType,
  extendType,
  stringArg,
  intArg,
  list,
  nonNull,
} from 'nexus';

import {
  getAdminHotels,
  getHotelRequest,
  getHotelBookings,
  getHotelGuests,
} from '../services/Admin';
import {
  getUserIdentity,
  verifyIsHotelAdmin,
  getUserProfile,
} from '../utils/index';

import { searchFilter } from './Generics';
import {
  getGuestsCount,
  getBookingsCount,
  getRequestsCount,
  getRoomModelsCount,
} from '../services/Hotel';
export const Administrator = objectType({
  name: 'Administrator',
  definition(t) {
    t.int('id');
    t.int('userId');
    t.field('user', {
      type: 'User',
      resolve(root: any): any {
        return getUserProfile(root.user.id);
      },
    });
    t.field('hotels', {
      type: list('Hotel'),
      resolve(root: any): any {
        return getAdminHotels(root.id);
      },
    });
  },
});
export const AdminHotels = objectType({
  name: 'AdminHotels',
  definition(t) {
    t.list.field('hotels', {
      type: 'Hotel',
    });
    t.int('hotelsCount');
  },
});
export const GuestSearch = objectType({
  name: 'GuestSearch',
  definition(t) {
    t.list.field('guests', {
      type: 'Client',
    });
    t.int('totalResults');
  },
});
export const RequestSearch = objectType({
  name: 'RequestSearch',
  definition(t) {
    t.list.field('requests', {
      type: 'BookingRequest',
    });
    t.int('totalResults');
    t.int('pageCount');
  },
});
export const HotelData = objectType({
  name: 'HotelData',
  definition(t) {
    t.int('id');
    t.int('roomModelsCount', {
      resolve(root: any, args, ctx): any {
        return getRoomModelsCount(root.id);
      },
    });
    t.int('requestsCount', {
      resolve(root: any, args, ctx): any {
        return getRequestsCount(root.id);
      },
    });
    t.int('bookingsCount', {
      resolve(root: any, args, ctx): any {
        return getBookingsCount(root.id);
      },
    });
    t.int('guestsCount', {
      resolve(root: any, args, ctx): any {
        return getGuestsCount(root.id);
      },
    });
  },
});

export const GuestsSearchResult = objectType({
  name: 'GuestsSearchResult',
  definition(t) {
    t.list.field('guests', { type: 'Client' });
  },
});
export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('adminHotels', {
      type: AdminHotels,
      args: {
        token: nonNull(stringArg()),
      },
      resolve(root, args, ctx): any {
        return getAdminHotels(args.token);
      },
    });
    t.field('hotelData', {
      type: HotelData,
      args: {
        hotelId: nonNull(intArg()),
        token: nonNull(stringArg()),
      },
      resolve(root, args, ctx): any {
        const getSensitiveHotelData = async (
          token: string,
          hotelId: number
        ) => {
          const user = await getUserIdentity(token);
          await verifyIsHotelAdmin(user.id, hotelId);

          return {
            id: hotelId,
          };
        };
        return getSensitiveHotelData(args.token, args.hotelId);
      },
    });

    t.field('hotelRequests', {
      type: RequestSearch,
      args: {
        hotelId: nonNull(intArg()),
        token: nonNull(stringArg()),
        sort: stringArg(),
        search: searchFilter,
        take: intArg({ default: 8 }),
        skip: intArg({ default: 0 }),
      },
      resolve(root, args, ctx): any {
        return getHotelRequest(args.token, args.hotelId, args);
      },
    });

    t.field('hotelBookings', {
      type: list('Booking'),

      args: {
        hotelId: nonNull(intArg()),
        token: nonNull(stringArg()),
        status: stringArg(),
        from: stringArg(),
        until: stringArg(),
      },
      resolve(root, args, ctx): any {
        return getHotelBookings(args.token, args.hotelId, args);
      },
    });

    t.field('hotelGuests', {
      type: GuestSearch,
      args: {
        hotelId: nonNull(intArg()),
        token: nonNull(stringArg()),
        sort: stringArg(),
        search: searchFilter,
        take: intArg({ default: 6 }),
        skip: intArg({ default: 0 }),
      },
      resolve(root, args, ctx): any {
        return getHotelGuests(args.token, args.hotelId, args);
      },
    });
  },
});
