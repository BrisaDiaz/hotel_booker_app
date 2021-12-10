import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import useHotelDashboard, {
  Props,
} from '../../../hooks/pages_logic/useHotelDashboard';
import { GET_DASHBOARD_HOTEL_DATA } from '@/queries/index';
import { client } from '@/lib/apollo';
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/graphql/utils';
import Head from 'next/head';
import Backdrop from '@/components/Backdrop';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ActionCard from '@/components/dashboard/ActionCard';
import RoomTypesTable from '@/components/dashboard/tables/RoomTypesTable';
import AddRoomModal from '@/components/modals/AddRoomModal';
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

const HotelAdmin: WithLayoutPage = ({
  roomModels,
  roomTypesCount,
  bookingsCount,
  guestsCount,
  requestsCount,
  hotelId,
  userId,
}: Props) => {
  const {
    onDeleteRooms,
    onAddNewRoom,
    handleActions,
    handleCloseModal,
    roomTypes,
    resultMessage,
    loading,
    roomNumbersUploaded,
    modalsOpenState,
    cardsData,
  } = useHotelDashboard({
    roomModels,
    roomTypesCount,
    bookingsCount,
    guestsCount,
    requestsCount,
    hotelId,
    userId,
  });
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{ p: { xs: '16px 0', sm: '16px 16px' }, maxWidth: 1200 }}
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
