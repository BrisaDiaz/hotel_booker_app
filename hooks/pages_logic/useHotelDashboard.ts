import React from 'react';
import {
  ADD_ROOMS_TO_MODEL,
  GET_ROOM_MODEL_BY_ID,
  DELETE_ROOMS_OF_MODEL,
  UPDATE_ROOM_MODEL,
  GET_ROOM_MODEL_AVAILABLE_ROOMS,
  MAKE_BOOKING,
  GET_ALL_SERVICES,
  GET_ALL_AMENITIES,
  GET_ALL_ROOM_CATEGORIES,
  GET_ALL_BEDS,
} from '@/queries/index';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import { useLazyQuery, useMutation } from '@apollo/client';
import { NextRouter, useRouter } from 'next/router';
import { RoomModel } from '@/interfaces/index';
import useNotification from '@/hooks/useNotification';
export interface Props {
  roomModels: RoomModel[];
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
        id: 'roomTypes',
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
        id: 'guests',
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
        id: 'requests',
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
        id: 'bookings',
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

  const [infoCardsData, setInfoCardsData] = React.useState(
    generateCardsData({
      roomTypesCount,
      bookingsCount,
      guestsCount,
      requestsCount,
      router,
      hotelId,
    })
  );
  type SectionToEdit =
    | 'about'
    | 'price'
    | 'aspect'
    | 'features'
    | 'capacity'
    | '';
  const [toEditSection, setToEditSection] = React.useState<SectionToEdit>('');
  const [toEditRoomTypeData, setToEditRoomTypeData] =
    React.useState<RoomModel | null>(null);

  const [modalsState, setModelsState] = React.useState({
    addRoom: false,
    deleteRooms: false,
    'show/edit': false,
    edit: false,
    addBooking: false,
    displayRoomsStatus: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const { notification, notify } = useNotification({ autoClean: true });

  const getAlreadyUploadRoomNumbers = (
    hotelRoomTypes: RoomModel[]
  ): number[] | [] => {
    const roomNumbers = hotelRoomTypes
      ?.map((roomType) => roomType?.rooms.map((room) => room.number))
      .flat();

    return roomNumbers;
  };
  const setActualizeRoomModelToEditData = (data: RoomModel) => {
    setToEditRoomTypeData(data);
  };
  const [roomTypes, setRoomTypes] = React.useState<RoomModel[]>(roomModels);
  const [toDeleteRoomsIds, setToDeleteRoomsIds] = React.useState<number[] | []>(
    []
  );
  const [roomNumbersUploaded, setRoomNumbersUploaded] = React.useState<
    number[] | []
  >(getAlreadyUploadRoomNumbers(roomModels));

  const [selectedRoomTypeId, setSelectedRoomTypeId] = React.useState<
    number | null
  >(null);
  const [availableRooms, setAvailableRooms] = React.useState<
    | {
        id: string;
        number: number;
      }[]
    | []
  >([]);

  const handleCloseModal = (modalType: RoomTypeActions) => {
    setModelsState({
      ...modalsState,
      [modalType]: false,
    });
  };

  const [addRoomsToRoomModel, addRoomRequest] = useMutation(
    ADD_ROOMS_TO_MODEL,
    {
      onCompleted: ({ addRoomToModel }) => {
        const actualizedRooms = addRoomToModel;
        if (actualizedRooms.length) {
          const actualizedRoomTypes = roomTypes.map((roomType: RoomModel) =>
            roomType.id === selectedRoomTypeId
              ? { ...roomType, rooms: actualizedRooms }
              : roomType
          );
          setRoomTypes(actualizedRoomTypes);
          setRoomNumbersUploaded(
            getAlreadyUploadRoomNumbers(actualizedRoomTypes)
          );
          handleCloseModal('addRoom');
          notify({
            content: 'Rooms where added sucessfully',
            type: 'success',
          });
        }
      },
      onError: (error) => {
        notify({
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

        const actualizedRoomTypes = roomTypes.map((roomType: RoomModel) =>
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
        notify({
          content: 'Rooms where deleted sucessfully',
          type: 'success',
        });
      },
      onError: (error) => {
        handleCloseModal('deleteRooms');
        notify({
          content: `Rooms could not be deleted.\n Error:${error.message}`,
          type: 'error',
        });
      },
    }
  );
  const [createBooking, creatBookingResults] = useMutation(MAKE_BOOKING, {
    onCompleted: () => {
      const actualizedCards = infoCardsData.map((card) =>
        card.id === 'bookings'
          ? {
              ...card,

              title: bookingsCount + 1 === 1 ? 'Booking' : 'Bookings',
              count: bookingsCount + 1,
            }
          : card.id === 'guests'
          ? {
              ...card,
              title: guestsCount + 1 === 1 ? 'Guest' : 'Guests',
              count: guestsCount + 1,
            }
          : card
      );
      setInfoCardsData(actualizedCards);
      handleCloseModal('addBooking');
      notify({
        content: 'Booking was created sucessfully',
        type: 'success',
      });
    },
    onError: (error) => {
      notify({
        content: `Booking could not be created.\n Error:${error.message}`,
        type: 'error',
      });
    },
  });

  const [updateRoomType, updateRoomTypeRequest] = useMutation(
    UPDATE_ROOM_MODEL,
    {
      onCompleted: ({ roomModel }) => {
        setActualizeRoomModelToEditData(roomModel);
        const displayedRoomTypesActualized = roomTypes.map((currentRoom) =>
          currentRoom.id === roomModel.id ? roomModel : currentRoom
        );
        setRoomTypes(displayedRoomTypesActualized);
        setToEditSection('');
        notify({
          content: `Update was complited sucessfully`,
          type: 'success',
        });
      },
      onError: (error) => {
        notify({
          content: `Update could not be complited.\n Error:${error.message}`,
          type: 'error',
        });
      },
    }
  );
  const [getRoomsAvailable, roomsAvailablesRequest] = useLazyQuery(
    GET_ROOM_MODEL_AVAILABLE_ROOMS
  );

  const [getRoomTypeData, roomTypeDataRequest] =
    useLazyQuery(GET_ROOM_MODEL_BY_ID);
  const [getServices, servicesRequest] = useLazyQuery(GET_ALL_SERVICES);
  const [getAmenities, amenitiesRequest] = useLazyQuery(GET_ALL_AMENITIES);
  const [getBedsTypes, bedTypesRequest] = useLazyQuery(GET_ALL_BEDS);
  const [getCategories, categoriesRequest] = useLazyQuery(
    GET_ALL_ROOM_CATEGORIES
  );
  const handleGetAvailableRooms = async (searchArgs: {
    roomModelId: number;
    guestsDistribution: { adults: number; children: number }[];
    checkInDate: string;
    checkOutDate: string;
  }) => {
    try {
      await getRoomsAvailable({ variables: searchArgs });
    } catch (err) {
      console.log(err);
    }
  };
  //// actualize rooms availables
  React.useEffect(() => {
    if (roomsAvailablesRequest.data?.rooms) {
      return setAvailableRooms(roomsAvailablesRequest.data?.rooms);
    }
  }, [roomsAvailablesRequest.data]);

  const getRoomModelToEditData = async (roomModelId: number) => {
    try {
      await getRoomTypeData({ variables: { roomModelId: roomModelId } });
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (!toEditSection) return handleCloseModal('edit');
  }, [toEditSection]);

  React.useEffect(() => {
    if (
      addRoomRequest.loading ||
      deleteRoomsResults.loading ||
      roomsAvailablesRequest.loading ||
      creatBookingResults.loading ||
      roomTypeDataRequest.loading ||
      servicesRequest.loading ||
      amenitiesRequest.loading ||
      bedTypesRequest.loading ||
      categoriesRequest.loading ||
      updateRoomTypeRequest.loading
    ) {
      return setLoading(true);
    }
    return setLoading(false);
  }, [
    addRoomRequest.loading,
    deleteRoomsResults.loading,
    roomsAvailablesRequest.loading,
    creatBookingResults.loading,
    roomTypeDataRequest.loading,
    servicesRequest.loading,
    amenitiesRequest.loading,
    bedTypesRequest.loading,
    categoriesRequest.loading,
    updateRoomTypeRequest.loading,
  ]);

  //// actualize room to show/edit data
  React.useEffect(() => {
    if (roomTypeDataRequest.data?.roomModel?.id) {
      setActualizeRoomModelToEditData(roomTypeDataRequest.data?.roomModel);
    }
  }, [roomTypeDataRequest.data]);

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
  const onCreateBooking = async (data: any) => {
    const variables = {
      hotelId,
      userId,
      roomModelId: selectedRoomTypeId,
      ...data,
    };
    try {
      await createBooking({ variables });
    } catch (error) {
      console.log(error);
    }
  };
  const onEditSection = async (data: any) => {
    const variables = { ...data };

    try {
      setLoading(true);
      if (toEditSection === 'aspect') {
        const [mainImageData] = await uploadToCloudinary([variables.mainImage]);
        variables.mainImage = mainImageData.secure_url;
      }
      await updateRoomType({
        variables: {
          ...variables,
          hotelId: hotelId,
          userId: userId,
          roomModelId: selectedRoomTypeId,
        },
      });
    } catch (err: any) {
      setLoading(false);
      notify({
        content: `Update could not be complited.`,
        type: 'error',
      });
    }
  };
  const handleEditSelected = async (toEditSection: SectionToEdit) => {
    if (toEditSection === 'about') {
      await getCategories();
    }
    if (toEditSection === 'capacity') {
      await getBedsTypes();
    }
    if (toEditSection === 'features') {
      await Promise.all([getServices(), getAmenities()]);
    }
    setToEditSection(toEditSection);
  };
  const handleEditAbort = () => {
    setToEditSection('');
  };

  type RoomTypeActions =
    | 'addRoom'
    | 'deleteRooms'
    | 'show/edit'
    | 'edit'
    | 'addBooking';
  const handleActions = async (
    roomModelId: number,
    action: RoomTypeActions,
    roomsToDelete?: number[]
  ) => {
    setSelectedRoomTypeId(roomModelId);
    if (action === 'deleteRooms') {
      roomsToDelete && setToDeleteRoomsIds(roomsToDelete);
    }
    if (action === 'show/edit') {
      if (!toEditRoomTypeData || toEditRoomTypeData.id != roomModelId) {
        await getRoomModelToEditData(roomModelId);
      }
    }

    return setModelsState({
      ...modalsState,
      [action]: true,
    });
  };

  return {
    onDeleteRooms,
    onAddNewRoom,
    onCreateBooking,
    onEditSection,
    handleActions,
    handleEditAbort,
    handleCloseModal,
    handleGetAvailableRooms,
    handleEditSelected,
    toEditSection,
    services: servicesRequest.data?.servicesList,
    amenities: amenitiesRequest.data?.amenitiesList,
    bedTypes: bedTypesRequest.data?.bedTypesList,
    categories: categoriesRequest.data?.roomCategoriesList,
    selectedRoomTypeId,
    toEditRoomTypeData: toEditRoomTypeData,
    roomTypes,
    notification,
    loading,
    roomNumbersUploaded,
    availableRooms,
    modalsState,
    infoCardsData,
  };
}
