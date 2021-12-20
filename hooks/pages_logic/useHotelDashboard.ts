import React from 'react';
import { ADD_ROOMS_TO_MODEL, DELETE_ROOMS_OF_MODEL } from '@/queries/index';
import { useLazyQuery, useMutation } from '@apollo/client';
import { NextRouter, useRouter } from 'next/router';

export interface RoomType {
  __typename: string;
  id: number;
  name: string;
  mainImage: string;
  lowestPrice: number;
  taxesAndCharges: number;
  maximunGuests: number;
  beds: Array<{ id: number; type: string; quantity: number }>;
  rooms: Array<{ id: number; number: number }>;
}
export interface Props {
  roomModels: Array<RoomType>;
  roomTypesCount: number;
  bookingsCount: number;
  guestsCount: number;
  requestsCount: number;
  hotelId: number;
  userId: number;
}
export default function useHotelDashboard({
  roomModels,
  roomTypesCount,
  bookingsCount,
  guestsCount,
  requestsCount,
  hotelId,
  userId,
}: Props) {
  const router = useRouter();
  function generateCardsData({
    roomTypesCount,
    guestsCount,
    requestsCount,
    bookingsCount,
    hotelId,
    router,
  }: {
    roomTypesCount: number;
    guestsCount: number;
    requestsCount: number;
    bookingsCount: number;
    hotelId: number;
    router: NextRouter;
  }) {
    const cardsData = [
      {
        title: roomTypesCount === 1 ? 'Room type' : 'Room types',
        count: roomTypesCount,
        actions: [
          {
            name: 'add',
            callback: () => {
              router.push({
                pathname: '/admin/upload/room',
                query: { hotelId },
              });
            },
          },
        ],
      },
      {
        title: guestsCount === 1 ? 'Guest' : 'Guests',
        count: guestsCount,
        actions: [
          {
            name: 'view',
            callback: () => {
              router.push({
                pathname: '/admin/hotel/guests',
                query: { hotelId },
              });
            },
          },
        ],
      },
      {
        title: requestsCount === 1 ? 'Request' : 'Requests',
        count: requestsCount,
        actions: [
          {
            name: 'view',
            callback: () => {
              router.push({
                pathname: '/admin/hotel/requests',
                query: { hotelId },
              });
            },
          },
        ],
      },
      {
        title: bookingsCount === 1 ? 'Booking' : 'Bookings',
        count: bookingsCount,
        actions: [
          {
            name: 'view',
            callback: () => {
              router.push({
                pathname: '/admin/hotel/bookings',
                query: { hotelId },
              });
            },
          },
        ],
      },
    ];
    return cardsData;
  }
  const cardsData = generateCardsData({
    roomTypesCount,
    bookingsCount,
    guestsCount,
    requestsCount,
    router,
    hotelId,
  });

  const [modalsOpenState, setModelsOpenState] = React.useState({
    addRoom: false,
    deleteRooms: false,
    edit: false,
    addBooking: false,
    displayRoomsStatus: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const [notification, setNotification] = React.useState<{
    content: string;
    type: 'error' | 'success';
  }>({ content: '', type: 'success' });

  const getAlreadyUploadRoomNumbers = (
    hotelRoomTypes: RoomType[]
  ): number[] | [] => {
    const roomNumbers = hotelRoomTypes
      ?.map((roomType) => roomType?.rooms.map((room) => room.number))
      .flat();

    return roomNumbers;
  };
  const [roomTypes, setRoomTypes] = React.useState<RoomType[]>(roomModels);
  const [toDeleteRoomsIds, setToDeleteRoomsIds] = React.useState<number[] | []>(
    []
  );
  const [roomNumbersUploaded, setRoomNumbersUploaded] = React.useState<
    number[] | []
  >(getAlreadyUploadRoomNumbers(roomModels));

  const [selectedRoomTypeId, setSelectedRoomTypeId] = React.useState<
    number | null
  >(null);

  type RoomTypeActions =
    | 'addRoom'
    | 'deleteRooms'
    | 'edit'
    | 'addBooking'
    | 'displayRoomsStatus';

  const handleActions = (
    roomModelId: number,
    action: RoomTypeActions,
    roomsToDelete: number[] | []
  ) => {
    setSelectedRoomTypeId(roomModelId);
    if (action === 'deleteRooms') {
      setToDeleteRoomsIds(roomsToDelete);
    }
    return setModelsOpenState({
      ...modalsOpenState,
      [action]: true,
    });
  };
  const handleCloseModal = (modalType: RoomTypeActions) => {
    setModelsOpenState({
      ...modalsOpenState,
      [modalType]: false,
    });
  };

  const [addRoomsToRoomModel, addRoomResults] = useMutation(
    ADD_ROOMS_TO_MODEL,
    {
      onCompleted: ({ addRoomToModel }) => {
        const actualizedRooms = addRoomToModel;
        if (actualizedRooms.length) {
          const actualizedRoomTypes = roomTypes.map((roomType: RoomType) =>
            roomType.id === selectedRoomTypeId
              ? { ...roomType, rooms: actualizedRooms }
              : roomType
          );
          setRoomTypes(actualizedRoomTypes);
          setRoomNumbersUploaded(
            getAlreadyUploadRoomNumbers(actualizedRoomTypes)
          );
          handleCloseModal('addRoom');
          setNotification({
            content: 'Rooms where added sucessfully',
            type: 'success',
          });
        }
      },
      onError: (error) => {
        setNotification({
          content: `Rooms could not be added.\n Error:${error.message}`,
          type: 'error',
        });
      },
    }
  );
  const [deleteRoomsOfRoomModel, deleteRoomsResults] = useMutation(
    DELETE_ROOMS_OF_MODEL,
    {
      onCompleted: ({ deleteRoomOfModel }) => {
        const actualizedRooms = deleteRoomOfModel;

        const actualizedRoomTypes = roomTypes.map((roomType: RoomType) =>
          roomType.id === selectedRoomTypeId
            ? { ...roomType, rooms: actualizedRooms }
            : roomType
        );
        setRoomTypes(actualizedRoomTypes);
        setRoomNumbersUploaded(
          getAlreadyUploadRoomNumbers(actualizedRoomTypes)
        );
        handleCloseModal('deleteRooms');
        setToDeleteRoomsIds([]);
        setNotification({
          content: 'Rooms where deleted sucessfully',
          type: 'success',
        });
      },
      onError: (error) => {
        handleCloseModal('deleteRooms');
        setNotification({
          content: `Rooms could not be deleted.\n Error:${error.message}`,
          type: 'error',
        });
      },
    }
  );
  React.useEffect(() => {
    if (addRoomResults.loading) {
      return setLoading(true);
    }
    return setLoading(false);
  }, [addRoomResults.loading, deleteRoomsResults.loading]);

  React.useEffect(() => {
    if (notification.content) {
      setTimeout(() => {
        setNotification({ content: '', type: 'success' });
      }, 5000);
    }
  }, [notification.content]);

  const onAddNewRoom = async (roomNumbers: number[]) => {
    if (!roomNumbers.length) return null;
    const variables = {
      hotelId,
      userId,
      roomModelId: selectedRoomTypeId,
      roomNumbers,
    };
    try {
      await addRoomsToRoomModel({ variables });
    } catch (error) {
      console.log(error);
    }
  };
  const onDeleteRooms = async () => {
    if (!toDeleteRoomsIds.length) return null;
    const variables = {
      hotelId,
      userId,
      roomModelId: selectedRoomTypeId,
      roomsIds: toDeleteRoomsIds,
    };
    try {
      await deleteRoomsOfRoomModel({ variables });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    onDeleteRooms,
    onAddNewRoom,
    handleActions,
    handleCloseModal,
    roomTypes,
    notification,
    loading,
    roomNumbersUploaded,
    modalsOpenState,
    cardsData,
  };
}
