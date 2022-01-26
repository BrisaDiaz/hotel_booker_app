import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import useHotelDashboard, {
  Props,
} from '@/hooks/pages_logic/useHotelDashboard';
import { GET_DASHBOARD_HOTEL_DATA } from '@/queries/index';
import { client } from '@/lib/apollo';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from '@/graphql/utils';
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
import AddBookingModal from '@/components/modals/AddBookingModal';
import DinamicForm from '@/components/dashboard/forms/Room/DinamicForm';
import RoomModal from '@/components/modals/RoomModal';
interface ActionCard {
  title: string;
  actions: Array<{ name: string; callback: () => void }>;
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

const HotelAdmin: WithLayoutPage<Props> = ({
  roomModels,
  roomTypesCount,
  bookingsCount,
  guestsCount,
  requestsCount,
  hotelId,
  token,
}) => {
  const {
    onDeleteRooms,
    onAddNewRoom,
    onCreateBooking,
    onEditSection,
    handleActions,
    handleEditAbort,
    handleCloseModal,
    handleGetAvailableRooms,
    handleEditSelected,
    toEditRoomTypeData,
    toEditSection,
    services,
    amenities,
    bedTypes,
    categories,
    selectedRoomTypeId,
    roomTypes,
    notification,
    loading,
    roomNumbersUploaded,
    modalsState,
    infoCardsData,
    availableRooms,
  } = useHotelDashboard({
    roomModels,
    roomTypesCount,
    bookingsCount,
    guestsCount,
    requestsCount,
    hotelId,
    token,
  });

  return (
    <div>
      <Head>
        <title>Hotel Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{ p: { xs: '16px 0', sm: '16px 16px' }, maxWidth: 1100 }}
        component="main"
      >
        <ActionCardGrid cards={infoCardsData} />
      </Box>
      <AddRoomModal
        onSubmit={onAddNewRoom}
        isOpen={modalsState.addRoom}
        onClose={() => handleCloseModal('addRoom')}
        restrictedNumbers={roomNumbersUploaded}
      />
      <Dialog
        acceptLabel={'Procced'}
        rejectLabel={'Avort'}
        title={'Are you sure?'}
        text={
          'If procced all bookings releted to the rooms are going to be lost.'
        }
        isDialogOpen={modalsState.deleteRooms}
        onAccept={onDeleteRooms}
      />

      <AddBookingModal
        onClose={() => handleCloseModal('addBooking')}
        roomTypeId={selectedRoomTypeId}
        onSubmit={onCreateBooking}
        isOpen={modalsState.addBooking}
        availableRooms={availableRooms}
        getAvailableRooms={handleGetAvailableRooms}
      />

      <RoomModal
        isOpen={
          !loading && toEditRoomTypeData && modalsState['show/edit']
            ? true
            : false
        }
        onClose={() => handleCloseModal('show/edit')}
        onEdit={handleEditSelected}
        roomType={toEditRoomTypeData}
      />

      {!loading && toEditSection && toEditRoomTypeData && (
        <DinamicForm
          toEditSection={toEditSection}
          roomType={toEditRoomTypeData}
          submitHandler={onEditSection}
          abortHandler={handleEditAbort}
          services={services || []}
          amenities={amenities || []}
          bedTypes={bedTypes || []}
          roomCategories={categories || []}
        />
      )}
      <RoomTypesTable roomTypes={roomTypes} handleActions={handleActions} />
      <Backdrop loading={loading} />
      {notification.content && (
        <SnackBar
          severity={notification.type}
          message={notification.content || 'Oparation succesfully complited'}
        />
      )}
    </div>
  );
};

HotelAdmin.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="hotel">{page}</AdminMenu>;
};

export default HotelAdmin;
export const getServerSideProps = async ({
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
    const token = getCookie(req, res);

    const { data } = await client.query({
      query: GET_DASHBOARD_HOTEL_DATA,
      variables: { token: token, hotelId: query.hotelId },
    });

    return {
      props: {
        hotelId: query.hotelId,
        token: token,
        roomModels: data.hotelData.roomModels,
        roomTypesCount: data.hotelData.roomModelsCount,
        guestsCount: data.hotelData.guestsCount,
        requestsCount: data.hotelData.requestsCount,
        bookingsCount: data.hotelData.bookingsCount,
      },
    };
  } catch (e: any) {
    console.log(e.networkError ? e.networkError?.result?.errors : e);

    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  }
};
