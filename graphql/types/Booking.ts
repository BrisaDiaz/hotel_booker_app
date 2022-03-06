import {
  objectType,
  extendType,
  stringArg,
  intArg,
  floatArg,
  nonNull,
  enumType,
  list,
  inputObjectType,
} from 'nexus';

import { checkRoomsAvailable } from '../services/Booking';
import { getHotel } from '../services/Hotel';
import { getRoomModel } from '../services/Room';
import {
  makeBookingRequest,
  makeBooking,
  cancelBooking,
  confirmBooking,
  declineBookingRequest,
  getCancellationDetails,
  getBookingReserveRooms,
  getBooking,
  getBookingClient,
  getBookingGuestsDistribution,
} from '../services/Booking';
export const Client = objectType({
  name: 'Client',
  definition(t) {
    t.int('id');
    t.string('firstName');
    t.string('lastName');
    t.string('email');
    t.string('mobileNumber');
    t.string('landlineNumber');
    t.list.field('bookings', { type: 'Booking' });
  },
});

export const roomSpecifications = inputObjectType({
  name: 'roomSpecifications',
  definition(t) {
    t.int('adults');
    t.int('children');
  },
});
export const GuestsDistribution = objectType({
  name: 'GuestsDistribution',
  definition(t) {
    t.int('id');
    t.int('adults');
    t.int('children');
  },
});
export const CancellationDetails = objectType({
  name: 'CancellationDetails',
  definition(t) {
    t.int('id');
    t.int('bookingId');
    t.string('message');
    t.float('cancellationFee');
    t.string('createdAt');
  },
});

export const BookingStatus = enumType({
  name: 'BookingStatus',
  members: ['ACTIVE', 'CANCELED', 'FINISHED'],
});
export const BookingRequestStatus = enumType({
  name: 'BookingRequestStatus',
  members: ['PENDING', 'DECLINED', 'ACCEPTED'],
});
export const PaymentMethod = enumType({
  name: 'PaymentMethod',
  members: [
    'CREDIT_CARD',
    'BILL_TO_ACCOUNT',
    'CASH',
    'DEBIT_CARD',
    'TRAVELER_CHECK',
  ],
});

export const Booking = objectType({
  name: 'Booking',
  definition(t) {
    t.int('id');
    t.int('hotelId');
    t.field('hotel', {
      type: 'Hotel',
      resolve(root: any): any {
        return getHotel(root.hotelId);
      },
    });

    t.int('roomModelId');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve(root: any): any {
        return getRoomModel(root.roomModelId);
      },
    });
    t.field('reservedRooms', {
      type: list('Room'),
      resolve(root: any): any {
        return getBookingReserveRooms(root.id);
      },
    });
    t.int('clientId');
    t.field('client', {
      type: 'Client',
      resolve(root: any): any {
        return getBookingClient(root.clientId);
      },
    });
    t.int('children');
    t.int('adults');
    t.string('checkInDate');
    t.string('checkOutDate');
    t.int('nights');
    t.string('specifications');
    t.list.field('guestsDistribution', {
      type: GuestsDistribution,
      resolve(root: any): any {
        return getBookingGuestsDistribution(root.id);
      },
    });
    t.field('status', { type: 'BookingStatus' });
    t.float('totalCost');
    t.field('paymentMethod', { type: 'PaymentMethod' });
    t.string('createdAt');
  },
});
export const BookingRequest = objectType({
  name: 'BookingRequest',
  definition(t) {
    t.int('id');
    t.int('hotelId');
    t.int('clientId');
    t.int('roomModelId');
    t.field('roomModel', {
      type: 'RoomModel',
      resolve(root: any): any {
        return getRoomModel(root.roomModelId);
      },
    });
    t.field('client', {
      type: 'Client',
      resolve(root: any): any {
        return getBookingClient(root.clientId);
      },
    });
    t.list.field('guestsDistribution', {
      type: GuestsDistribution,
    });
    t.string('telephone');
    t.string('email');
    t.int('children');
    t.int('adults');
    t.string('checkInDate');
    t.string('checkOutDate');
    t.int('nights');
    t.string('specifications');
    t.field('status', { type: BookingRequestStatus });
    t.field('availableRooms', {
      type: list('Room'),
      resolve(root: any): any {
        return checkRoomsAvailable({
          roomModelId: root.roomModelId,
          checkInDate: root.checkInDate,
          checkOutDate: root.checkOutDate,
          roomsRequired: root.guestsDistribution.length,
        });
      },
    });
    t.string('createdAt');
  },
});
export const ConsultQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('getBookingCancellationDetails', {
      type: CancellationDetails,
      args: {
        token: nonNull(stringArg()),
        bookingId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return getCancellationDetails(args.token, args.bookingId);
      },
    });

    t.field('bookingById', {
      type: 'Booking',
      args: {
        token: nonNull(stringArg()),
        bookingId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return getBooking(args.token, args.bookingId);
      },
    });
  },
});
export const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('makeBooking', {
      type: 'Booking',
      args: {
        token: nonNull(stringArg()),
        roomModelId: nonNull(intArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
        specifications: stringArg(),
        guestsDistribution: list(roomSpecifications),
        roomsIds: nonNull(list(nonNull(intArg()))),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx): any {
        return makeBooking(args.token, args.roomModelId, args);
      },
    });
    t.field('cancelBooking', {
      type: 'CancellationDetails',
      args: {
        token: nonNull(stringArg()),
        bookingId: nonNull(intArg()),
        message: nonNull(stringArg()),
        cancellationFee: nonNull(floatArg()),
      },
      resolve(root, args, ctx): any {
        return cancelBooking(args.token, args.bookingId, args);
      },
    });
    t.field('makeBookingRequest', {
      type: 'RoomConsultResponse',
      args: {
        roomModelId: nonNull(intArg()),
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
        email: nonNull(stringArg()),
        mobileNumber: nonNull(stringArg()),
        landlineNumber: nonNull(stringArg()),
        guestsDistribution: nonNull(list(roomSpecifications)),
        checkInDate: nonNull(stringArg()),
        checkOutDate: nonNull(stringArg()),
        specifications: stringArg(),
      },
      resolve(root, args, ctx) {
        return makeBookingRequest(args.roomModelId, args);
      },
    });
    t.field('confirmBookingRequest', {
      type: 'Booking',
      args: {
        token: nonNull(stringArg()),
        bookingRequestId: nonNull(intArg()),
        roomsIds: nonNull(list(nonNull(intArg()))),
        totalCost: nonNull(floatArg()),
        paymentMethod: stringArg(),
      },
      resolve(root, args, ctx): any {
        return confirmBooking(args.token, args.bookingRequestId, args);
      },
    });
    t.field('declineBookingRequest', {
      type: 'BookingRequest',
      args: {
        token: nonNull(stringArg()),
        bookingRequestId: nonNull(intArg()),
      },
      resolve(root, args, ctx): any {
        return declineBookingRequest(args.token, args.bookingRequestId);
      },
    });
  },
});
