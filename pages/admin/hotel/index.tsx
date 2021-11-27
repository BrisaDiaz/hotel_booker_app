import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import { GET_DASHBOARD_HOTEL_DATA } from '@/queries/index';
import { client } from '@/lib/apollo';
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/graphql/utils';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ActionCard from '@/components/dashboard/ActionCard';
import RoomTypesTable from '@/components/dashboard/tables/RoomTypesTable';
import AddRoomModal from '@/components/dashboard/AddRoomModal';
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
interface PageProps {
  roomTypes: Array<{
    __typename: string;
    id: number;
    name: string;
    mainImage: string;
    lowestPrice: number;
    taxesAndCharges: number;
    maximunGuests: number;
    beds: Array<{ id: number; type: string; number: number }>;
    rooms: Array<{ id: number; number: number }>;
  }>;
  roomTypesCount: number;
  bookingsCount: number;
  guestsCount: number;
  requestsCount: number;
  hotelId: number;
}
const HotelAdmin: WithLayoutPage = ({
  roomTypes,
  roomTypesCount,
  bookingsCount,
  guestsCount,
  requestsCount,
  hotelId,
}: PageProps) => {
  const [modalsOpenState, setModelsOpenState] = React.useState({
    addRoom: false,
    edit: false,
    addBooking: false,
    displayRoomsStatus: false,
  });
  const router = useRouter();

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

  const [selectedRoomModelId, setSelectedRoomModelId] = React.useState<
    number | null
  >(null);
  type RoomTypeActions =
    | 'addRoom'
    | 'edit'
    | 'addBooking'
    | 'displayRoomsStatus';

  const handleActions = (roomModelId: number, action: RoomTypeActions) => {
    setSelectedRoomModelId(roomModelId);
    setModelsOpenState({
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
  const roomNumbersUploaded = roomTypes
    .map((roomType) => roomType.rooms.map((room) => room.number))
    .flat();

  const onAddNewRoom = (roomsNumbers: number[]) => {
    console.log(roomsNumbers);
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
      <RoomTypesTable roomTypes={roomTypes} handleActions={handleActions} />
    </div>
  );
};

HotelAdmin.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="hotel">{page}</AdminMenu>;
};

export default HotelAdmin;
export const getServerSideProps: GetServerSideProps = async ({
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
          roomTypes: data.hotelData.roomModels,
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
