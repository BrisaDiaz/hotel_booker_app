import { Booking, BookingEvent, BookingResourceMap } from '../interfaces/index';

export const getFormattedBookings = (
  bookings: Booking[],
  roomModels: { id: number; name: string }[]
) => {
  const resourceMap: BookingResourceMap[] = roomModels.map((model) => ({
    resourceId: model.id,
    resourceTitle: model.name,
  }));

  const events: BookingEvent[] = bookings.reduce(
    (events: BookingEvent[], booking: Booking) => {
      const roomsBookings = booking.reservedRooms.map((room) => ({
        id: `${booking.id}+${room.number}`,
        title: `Room Nº ${room.number} - Booking ${booking.id}`,
        start: new Date(parseInt(booking.checkInDate)),
        end: new Date(parseInt(booking.checkOutDate)),
        resourceId: booking.roomModel.id,
        status: booking.status,
        color:
          booking.status === 'ACTIVE'
            ? '#1e88e5'
            : booking.status === 'CANCELED'
            ? '#e53935'
            : '#43a047',
        allDay: false,
        selectable: true,
      }));
      return [...events, ...roomsBookings];
    },
    []
  );

  return { resourceMap, events };
};
