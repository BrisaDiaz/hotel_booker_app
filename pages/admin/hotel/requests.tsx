import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';

import Head from 'next/head';

const RoomRequests: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Typography sx={{ m: '20px auto' }}>Room Requests</Typography>
      </main>
    </div>
  );
};

export default RoomRequests;
