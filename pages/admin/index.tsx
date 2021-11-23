import React from 'react';
import type { NextPage, GetServerSideProps, NextApiResponse } from 'next';
import { client } from '@/lib/apollo';
import { GET_ADMIN_HOTELS } from '@/queries/index';
import {getServerSideSession}from '@/utils/index'
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import ActionCard from '@/components/dashboard/ActionCard';
import HotelCard from '@/components/dashboard/HotelCard';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const cardData = {
    title: 'hotels',
    count: 3,
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
  const handleEdit = (fieldToEdit: string) => {
    alert('editing ' + fieldToEdit);
  };
  const hotels = [
    {
      id: 1,
      name: 'Four Seasons Hotel Buenos Aires',
      frameImage:
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22113570.jpg?k=50944ce5e79a439a84781c80e40564ad174a0eb0955bcc5b5033469b4f44bfa7&o=&hp=1',
      address: {
        holeAddress:
          'Posadas 1086/88, Buenos Aires, C1011 ABB, Capital Federal, Argentina',
      },
      lowestPrice: 546.9,
      taxesAndCharges: 45,
    },

    {
      id: 2,
      name: 'Four Seasons Hotel Buenos Aires',
      frameImage:
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22113570.jpg?k=50944ce5e79a439a84781c80e40564ad174a0eb0955bcc5b5033469b4f44bfa7&o=&hp=1',
      address: {
        holeAddress:
          'Posadas 1086/88, Buenos Aires, C1011 ABB, Capital Federal, Argentina',
      },
      lowestPrice: 546.9,
      taxesAndCharges: 45,
    },
    {
      id: 3,
      name: 'Four Seasons Hotel Buenos Aires',
      frameImage:
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/22113570.jpg?k=50944ce5e79a439a84781c80e40564ad174a0eb0955bcc5b5033469b4f44bfa7&o=&hp=1',
      address: {
        holeAddress:
          'Posadas 1086/88, Buenos Aires, C1011 ABB, Capital Federal, Argentina',
      },
      lowestPrice: 546.9,
      taxesAndCharges: 45,
    },
  ];
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ p: { xs: '20px 0', sm: '20px 16px' }, maxWidth: 1200 }}>
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
            <HotelCard hotel={hotel} handleRedirect={handleRedirect} handleEdit={handleEdit} />
          ))}
        </Box>
      </Box>
    </div>
  );
};
Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export default Dashboard;

export const getServerSideProps: GetServerSideProps = async () => {
  const user = await getServerSideSession()
  // const { data, error, loading } = await client.query({
  //   query: GET_ADMIN_HOTELS,
  // });
  // console.log(error);
  // if (error) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/search',
  //     },
  //     props: {},
  //   };
  // }

  // return {
  //   props: {
  //     hotels: data?.adminHotels.hotels,
  //     hotelsCount: data?.adminHotels.hotelsCount,
  //   },
  // };
  console.log(user)
  return {
    props:{}
  }
};
