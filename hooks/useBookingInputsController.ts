import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFormatedDate } from '../utils/ToYearMounthDayFormat';

export type Room = {
  children: number;
  adults: number;
  id: string;
};

export default function useBookingInputsController({
  setError,
}: {
  setError: Function;
}) {
  const minDate = getFormatedDate(Date.now());
  const [rooms, setRooms] = React.useState<Room[]>([
    { adults: 1, children: 0, id: uuidv4() },
  ]);

  const handdleAddRoom = () => {
    // verify user is not adding emty rooms
    if (
      rooms[rooms.length - 1].children > 0 ||
      rooms[rooms.length - 1].adults > 0
    )
      return setRooms([...rooms, { adults: 0, children: 0, id: uuidv4() }]);
  };
  const handleRoomChanges = (
    roomId: string,
    fieldChanged: 'adults' | 'children',
    value: number
  ) => {
    const actualizedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, [fieldChanged]: value } : room
    );

    setRooms(actualizedRooms);
  };
  const handleDeleteRoom = (id: string) => {
    const actualizedList = rooms.filter((current) => current.id !== id);
    setRooms(actualizedList);
  };
  const handleBookingData = (data: any) => {
    const { checkInDate, checkOutDate } = data;
    let areErrors = false;
    if (new Date(checkOutDate).getTime() < new Date(minDate).getTime()) {
      setError('checkOutDate', {
        type: 'manual',
        message: 'Invalid date',
      });
      areErrors = true;
    }

    if (new Date(checkInDate).getTime() < new Date(minDate).getTime()) {
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid date',
      });
      areErrors = true;
    }
    if (new Date(checkOutDate).getTime() < new Date(checkInDate).getTime()) {
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid check out date',
      });
      areErrors = true;
    }

    if (areErrors) return null;

    const roomsWithData = rooms
      .filter((room) => Boolean(room.adults) || Boolean(room.children))
      .map((room) => ({
        adults: room.adults,
        children: room.children,
      }));

    const formattedData = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      guestsDistribution: roomsWithData,
    };

    return formattedData;
  };

  return {
    handleDeleteRoom,
    handdleAddRoom,
    handleRoomChanges,
    minDate,
    handleBookingData,
    rooms,
  };
}
