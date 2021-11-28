import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import {
  GET_DASHBOARD_HOTEL_DATA,
  ADD_ROOMS_TO_MODEL,
  DELETE_ROOMS_OF_MODEL,
} from '@/queries/index';
import { useMutation } from '@apollo/client';
import { client } from '@/lib/apollo';
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/graphql/utils';
import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head';
import Backdrop from '@/components/Backdrop';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ActionCard from '@/components/dashboard/ActionCard';
import RoomTypesTable from '@/components/dashboard/tables/RoomTypesTable';
import AddRoomModal from '@/components/dashboard/AddRoomModal';
import SnackBar from '@/components/SnackBar';
import Dialog from '@/components/Dialog';

interface ActionCard {
  title: string;
  actions: Array<{ name: string; callback: Function }>;
  count: number;
  color?: string;
}
function ActionCardGrid({ cards }: { cards: ActionCard[] }) {
  return (
    <Grid
      container
      sx={{
        width: '100%',

        justifyContent: { xs: 'center', md: 'start' },
        p: 2,
        gap: { lg: 0 },
      }}
      spacing={3}
    >
      {cards.map((card) => (
        <Grid
          item
          xs={12}
          md={4}
          lg={3}
          key={card.title}
          sx={{
            display: 'flex',
            justifyContent: { sx: 'center', md: 'start' },
          }}
        >
          <ActionCard card={card} />
        </Grid>
      ))}
    </Grid>
  );
}
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
interface RoomType {
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
interface PageProps {
  roomModels: Array<RoomType>;
  roomTypesCount: number;
  bookingsCount: number;
  guestsCount: number;
  requestsCount: number;
  hotelId: number;
  userId: number;
}
const HotelAdmin: WithLayoutPage = ({
  roomModels,
  roomTypesCount,
  bookingsCount,
  guestsCount,
  requestsCount,
  hotelId,
  userId,
}: PageProps) => {
  const router = useRouter();
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

  const [resultMessage, setResultMessage] = React.useState<{
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
          setResultMessage({
            content: 'Rooms where added sucessfully',
            type: 'success',
          });
        }
      },
      onError: (error) => {
        setResultMessage({
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
        setResultMessage({
          content: 'Rooms where deleted sucessfully',
          type: 'success',
        });
      },
      onError: (error) => {
        handleCloseModal('deleteRooms');
        setResultMessage({
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
    if (resultMessage.content) {
      setTimeout(() => {
        setResultMessage({ content: '', type: 'success' });
      }, 5000);
    }
  }, [resultMessage.content]);

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
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{ p: { xs: '16px 0', sm: '20px 16px' }, maxWidth: 1200 }}
        component="main"
      >
        <ActionCardGrid cards={cardsData} />
      </Box>
      <AddRoomModal
        onSubmit={onAddNewRoom}
        isModalOpen={modalsOpenState.addRoom}
        closeModal={() => handleCloseModal('addRoom')}
        restrictedNumbers={roomNumbersUploaded}
      />
      <Dialog
        acceptLabel={'Procced'}
        rejectLabel={'Avort'}
        title={'Are you sure?'}
        text={
          'If procced all bookings releted to the rooms are going to be lost.'
        }
        isDialogOpen={modalsOpenState.deleteRooms}
        onAccept={onDeleteRooms}
      />
      <RoomTypesTable roomTypes={roomTypes} handleActions={handleActions} />
      <Backdrop loading={loading} />
      {resultMessage.content && (
        <SnackBar
          severity={resultMessage.type}
          message={resultMessage.content || 'Oparation succesfully complited'}
        />
      )}
    </div>
  );
};

HotelAdmin.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="hotel">{page}</AdminMenu>;
};

export default HotelAdmin;
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  req,
  res,
  query,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
  query: {
    hotelId: number;
  };
}) => {
  try {
    const user = await getUser(req, res);
    if (user.role === 'ADMIN') {
      const { data } = await client.query({
        query: GET_DASHBOARD_HOTEL_DATA,
        variables: { userId: user.id, hotelId: query.hotelId },
      });

      return {
        props: {
          hotelId: query.hotelId,
          userId: user.id,
          roomModels: data.hotelData.roomModels,
          roomTypesCount: data.hotelData.roomModelsCount,
          guestsCount: data.hotelData.guestsCount,
          requestsCount: data.hotelData.requestsCount,
          bookingsCount: data.hotelData.bookingsCount,
        },
      };
    }
    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  } catch (e) {
    console.log(e);

    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  }
};
