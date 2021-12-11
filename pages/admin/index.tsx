import React from 'react';
import type { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/graphql/utils';
import { client } from '@/lib/apollo';
import { GET_ADMIN_HOTELS, GET_HOTEL_BY_ID } from '@/queries/index';
import { useLazyQuery } from '@apollo/client';
import { Hotel } from '@/interfaces/index';
import { WithLayoutPage } from '@/interfaces/index';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Backdrop from '@/components/Backdrop';

import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import ActionCard from '@/components/dashboard/ActionCard';
import HotelCard from '@/components/dashboard/HotelCard';
import HotelModal from '@/components/modals/HotelModal';
const Dashboard: WithLayoutPage = ({
  hotels,
  hotelsCount,
}: {
  hotels: Array<{
    id: number;
    name: string;
    frameImage: string;
    lowestPrice: number;
    taxesAndCharges: number;
    address: {
      holeAddress: string;
    };
  }>;
  hotelsCount: number;
}) => {
  const router = useRouter();
  const cardData = {
    title: hotelsCount === 1 ? 'hotel' : 'hotels',
    count: hotelsCount,
    actions: [
      {
        name: 'add',
        callback: () => {
          router.push('/admin/upload/hotel');
        },
      },
    ],
  };

  const handleRedirect = (hotelId: number) => {
    router.push({
      pathname: '/admin/hotel',
      query: {
        hotelId: hotelId,
      },
    });
  };
  const handleEditSelected = (fieldToEdit: string) => {
    alert('editing ' + fieldToEdit);
  };
  const [isInEditMode, setIsInEditMode] = React.useState<boolean>(false);

  const [getHotelToEdit, { loading, error, data }] =
    useLazyQuery(GET_HOTEL_BY_ID);

  const toggleEditMode = (hotelId: number) => {
    setIsInEditMode(true);

    getHotelToEdit({ variables: { hotelId: hotelId } });
  };
  const closeEditingMode = () => {
    setIsInEditMode(false);
  };
  console.log(isInEditMode);
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
        <Box sx={{ p: ' 20px 10px', maxWidth: 'fit-content' }}>
          <ActionCard card={cardData} />
        </Box>
        <Box
          sx={{
            p: ' 20px 10px',
            display: 'flex',
            justifyContent: { xs: 'center', md: 'start' },
            flexWrap: 'wrap',
            gap: { xs: '20px', lg: '30px' },
          }}
        >
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              handleRedirect={handleRedirect}
              toggleEditMode={toggleEditMode}
            />
          ))}
        </Box>
        {!loading && data && isInEditMode && (
          <HotelModal
            isModalOpend={isInEditMode}
            closeModal={closeEditingMode}
            onEdit={handleEditSelected}
            hotel={data?.hotelById}
          />
        )}
      </Box>
      <Backdrop loading={loading} />
    </div>
  );
};
Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  try {
    const user = await getUser(req, res);

    const { data } = await client.query({
      query: GET_ADMIN_HOTELS,
      variables: { userId: user.id },
    });

    return {
      props: {
        hotels: data?.adminHotels.hotels,
        hotelsCount: data?.adminHotels.hotelsCount,
      },
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
