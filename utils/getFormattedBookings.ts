import {
  BookingListed,
  BookingEvent,
  BookingResourceMap,
} from '../interfaces/index';

export const getFormattedBookings = (
  bookings: BookingListed[],
  roomModels: { id: number; name: string }[]
) => {
  const resourceMap: BookingResourceMap[] = roomModels.map((model) => ({
    resourceId: model.id,
    resourceTitle: model.name,
  }));

  const events: BookingEvent[] = bookings.reduce(
    (events: BookingEvent[], booking: BookingListed) => {
      const roomsBookingListeds = booking.reservedRooms.map((room) => ({
        id: `${booking.id}+${room.number}`,
        title: `Room Nº ${room.number} - Booking ${booking.id}`,
        start: new Date(parseInt(booking.checkInDate)),
        end: new Date(parseInt(booking.checkOutDate)),
        resourceId: booking.roomModel.id,
        allDay: false,
        selectable: true,
      }));
      return [...events, ...roomsBookingListeds];
    },
    []
  );

  return { resourceMap, events };
};
