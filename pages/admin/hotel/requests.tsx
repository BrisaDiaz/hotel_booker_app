import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import AdminMenu from '@/components/layouts/AdminMenu';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { WithLayoutPage } from '@/interfaces/index';
const RoomRequests: WithLayoutPage = () => {
  return (
    <div>
      <Head>
        <title>Requests</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        component="main"
        sx={{ p: { xs: '20px 0', sm: '20px 16px' }, maxWidth: 1200 }}
      >
        <Typography sx={{ m: '20px auto' }}>Room Requests</Typography>
      </Box>
    </div>
  );
};
RoomRequests.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="requests">{page}</AdminMenu>;
};
export default RoomRequests;
