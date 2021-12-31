import type { NextApiResponse } from 'next';
import { WithLayoutPage } from '@/interfaces/index';

import React from 'react';
import { client } from '@/lib/apollo';
import Link from 'next/link';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import { useTheme } from '@mui/material/styles';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import BedIcon from '@mui/icons-material/Bed';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ConsultModal from '@/components/modals/AbailableRoomModal';
import BookingRequestModal from '@/components/modals/BookingRequestModal';
import Backdrop from '@/components/Backdrop';
import RoomBedsUI from '@/components/RoomBedsUI';
import DinamicFieldIcone from '@/components/DinamicFieldIcone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StraightenIcon from '@mui/icons-material/Straighten';
import AppBar from '@/components/layouts/AppBar';
import SnackBar from '@/components/SnackBar';
import { RoomModel, Feature } from '@/interfaces/index';

import { useLazyQuery, useMutation } from '@apollo/client';
import {
  MAKE_ROOM_CONSULT,
  GET_ROOM_MODEL_BY_ID,
  MAKE_BOOKING_REQUEST,
} from '@/queries/index';

const styles = {
  list: {
    display: 'flex',
    p: '0 10px',
    flexWrap: 'wrap',
    gap: '20px',
    fontWeight: 400,
  },
  listItem: {
    display: 'flex',
    gap: 1,
    textTransform: 'capitalize',
    alignItems: 'center',
    '& p': {
      m: '8px 0',
    },
  },
  featuresItems: {
    display: 'flex',
    gap: 1,
    textTransform: 'capitalize',
    alignItems: 'center',
    width: { xs: '250px', sm: '300px' },
  },
} as const;
type PageProps = {
  room: RoomModel;
  roomModelId: number;
};

const RoomPage: WithLayoutPage<PageProps> = ({ room, roomModelId }) => {
  const theme = useTheme();

  const [notification, setNotification] = React.useState({
    content: '',
    type: 'info',
  });
  const [makeRoomConsult, consultResponce] = useLazyQuery(MAKE_ROOM_CONSULT, {
    fetchPolicy: 'network-only',
  });

  const [makeBookingRequest, boolkingResponce] = useMutation(
    MAKE_BOOKING_REQUEST,
    {
      fetchPolicy: 'network-only',
    }
  );

  const [loading, setLoading] = React.useState<Boolean>(false);
  type Room = {
    childrens: number;
    adults: number;
  };

  React.useEffect(() => {
    if (consultResponce.loading || boolkingResponce.loading) {
      return setLoading(true);
    }
    return setLoading(false);
  }, [consultResponce.loading, boolkingResponce.loading]);

  React.useEffect(() => {
    if (consultResponce.data?.responce) {
      const { isAvailable, message } = consultResponce.data.responce;
      if (isAvailable) {
        setNotification({
          ...notification,
          content:
            'There is availability, make your reservation before the quotas run out.',
        });
        return clearNotifications();
      }
      setNotification({
        ...notification,
        content: message,
      });
      return clearNotifications();
    }
  }, [consultResponce]);

  React.useEffect(() => {
    if (boolkingResponce.data?.responce) {
      const { message } = boolkingResponce.data.responce;
      setNotification({
        ...notification,
        content: message,
      });
      return clearNotifications();
    }
  }, [boolkingResponce]);
  const clearNotifications = () => {
    setTimeout(() => {
      setNotification({ ...notification, content: '' });
    }, 6000);
  };
  const handleConsutlSubmit = async (data: {
    checkInDate: string;
    checkOutDate: string;
    guestsDistribution: Room[];
  }) => {
    try {
      const variables = {
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        rooms: data.guestsDistribution,
        roomModelId: roomModelId,
      };

      await makeRoomConsult({ variables });
    } catch (err) {
      console.log(err);
    }
  };
  const handleBookingSubmit = async (bookingVaribles: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string;
    guestsDistribution: Room[];
    checkInDate: string;
    checkOutDate: string;
    specifications?: string;
  }) => {
    try {
      await makeBookingRequest({
        variables: { ...bookingVaribles, roomModelId: roomModelId },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const roomReservationData = {
    price: room.lowestPrice,
    taxes: room.taxesAndCharges,
    maximunGuests: room.maximunGuests,
    checkInHour: room.hotel.checkInHour,
    checkOutHour: room.hotel.checkOutHour,
  };
  return (
    <div>
      <Head>
        <title>Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component="main" sx={{ maxWidth: '1000px', m: '20px auto 30px' }}>
        <Box component={Link} href={`/hotel/${room.hotelId}`} passHref>
          <Typography
            variant="h3"
            component="a"
            sx={{
              fontWeight: 700,
              margin: { xs: '0 10px', md: 0 },
              width: 'fit-content',
              textTransform: 'capitalize',

              cursor: 'pointer',
              '&:hover': {
                color: 'rgb(0 0 0 / 70%)',
                textDecoration: 'underline',
                textUnderlineOffset: '5px',
              },
            }}
          >
            {room.hotel.name}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          component="h2"
          color="primary"
          sx={{
            fontWeight: 700,
            margin: { xs: '0 10px', md: 0 },
            width: 'fit-content',
            textTransform: 'capitalize',
            padding: '10px 0 5px',
          }}
        >
          {room.name}
        </Typography>

        <ImageList
          sx={{
            width: '100%',
            maxHeight: '500px',
            overflow: 'hidden',
            objectFit: 'cover',
            objectPosition: 'center bottom',
          }}
          rowHeight={500}
          cols={1}
        >
          <ImageListItem cols={1}>
            <img
              src={`${room.mainImage}`}
              srcSet={`${room.mainImage}`}
              alt={`${room.hotel.name} ${room.category}`}
              loading="lazy"
            />
          </ImageListItem>
        </ImageList>
        <Typography
          component="h4"
          variant="h5"
          sx={{
            p: 1,
            pb: 0,
            fontWeight: 200,
            maxWidth: 'fit-content',
            m: '0 15px 0 auto',
          }}
        >
          From{' '}
          <Typography
            variant="h5"
            component="span"
            sx={{ color: 'primary.main', fontWeight: 700, ml: 1, mb: 1 }}
          >
            USD ${room.lowestPrice}
          </Typography>
          /Night
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            p: '0 10px ',
            fontWeight: 200,
            width: 190,
            textAlign: 'end',
            m: '0 15px 30px auto',
            lineHeight: 1.3,
          }}
        >
          Taxes and Charges{' '}
          <Typography
            color="primary"
            component="span"
            sx={{ fontWeight: 200, ml: 0.5, mb: 0 }}
          >
            USD ${room.taxesAndCharges}
          </Typography>
        </Typography>
        <Box
          component="ul"
          sx={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
            mx: 1,
            mt: { sm: '-20px' },
            p: 0,
          }}
        >
          {room.freeCancelation && (
            <Box sx={styles.listItem} component="li">
              {DinamicFieldIcone('free cancelation')}
              <Typography>free cancelation</Typography>
            </Box>
          )}
          {room.smooking && (
            <Box sx={styles.listItem} component="li">
              {DinamicFieldIcone('smoker friendly')}
              <Typography>smoker friendly</Typography>
            </Box>
          )}
        </Box>
        <Typography
          component="pre"
          sx={{ margin: ' 10px 10px 20px ', whiteSpace: 'pre-line' }}
        >
          {room.description}
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <ConsultModal onSubmit={handleConsutlSubmit}>
            <Button
              sx={{ padding: '10px 20px', m: 1 }}
              color="secondary"
              variant="outlined"
            >
              Check Diponibility
            </Button>
          </ConsultModal>
          <BookingRequestModal
            onSubmit={handleBookingSubmit}
            roomData={roomReservationData}
          >
            <Button
              sx={{
                padding: '10px 20px',
                m: '10px 0',
                maxWidth: 'fit-content',
                mr: 'auto',
              }}
              color="secondary"
              variant="contained"
            >
              Reserve
            </Button>
          </BookingRequestModal>
        </Box>
        <Box
          sx={{
            m: '20px 10px 30px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,

              alignItems: 'center',
              my: 3,
            }}
          >
            <BedIcon color="primary" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 300,
                textTransform: 'capitalize',
              }}
            >
              Capacity
            </Typography>
          </Box>
          <Box
            component="ul"
            sx={{
              display: 'flex',
              alignItems: 'center',
              rowGap: 3,
              textTransform: 'capitalize',
              margin: ' 0 15px',
              flexWrap: 'wrap',
              p: 0,
            }}
          >
            <Box
              component="li"
              sx={{
                width: '300px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <StraightenIcon
                color="secondary"
                sx={{ mr: 1 }}
                fontSize="small"
              />
              <Typography
                sx={{
                  width: 'max-content',

                  marginRight: '5px',
                  fontWeight: 400,
                }}
              >
                {room.mts2} Mts <sup>2</sup>
              </Typography>
            </Box>
            <Box
              component="li"
              sx={{
                width: '300px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {room.beds && room.beds.length && (
                <RoomBedsUI beds={room.beds} size="medium" />
              )}
            </Box>
            <Box
              component="li"
              sx={{
                width: '300px',
                display: 'flex',
              }}
            >
              {new Array(room.maximunGuests).fill(1).map((_, index) => (
                <PersonOutlineIcon
                  color="secondary"
                  key={index}
                  fontSize="small"
                />
              ))}
              <Typography sx={{ mx: 1 }}>
                {room.maximunGuests > 1 ? ' people ' : ' persone '} max
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              margin: '30px 0',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                my: 3,
              }}
            >
              <RoomPreferencesIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  textTransform: 'capitalize',
                }}
              >
                Amenities
              </Typography>
            </Box>
            {room.amenities && room?.amenities?.length && (
              <Box sx={styles.list} component="ul">
                {room.amenities.map((item: Feature) => (
                  <Box key={item.id} sx={styles.featuresItems} component="li">
                    <DoneIcon
                      fontSize="small"
                      sx={{ color: theme.palette.secondary.main }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                my: 3,
              }}
            >
              <RoomServiceIcon color="primary" />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 300,
                  textTransform: 'capitalize',
                }}
              >
                Services
              </Typography>
            </Box>
            {room.services && room?.services?.length && (
              <Box sx={styles.list} component="ul">
                {room.services.map((item: Feature) => (
                  <Box key={item.id} sx={styles.featuresItems} component="li">
                    <DoneIcon
                      fontSize="small"
                      sx={{ color: theme.palette.secondary.main }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {notification?.content && (
        <SnackBar
          severity={notification?.type}
          message={notification?.content}
        />
      )}
      <Backdrop loading={loading} />
    </div>
  );
};
RoomPage.getLayout = (page: React.ReactNode) => (
  <>
    <AppBar />
    <>{page}</>
  </>
);
export default RoomPage;
export const getServerSideProps = async ({
  query,
  res,
}: {
  query: { id: number };
  res: NextApiResponse;
}) => {
  const { data, error } = await client.query({
    query: GET_ROOM_MODEL_BY_ID,
    variables: { roomModelId: query.id },
  });

  if (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/search',
      },
      props: {},
    };
  }

  return {
    props: {
      room: data?.roomModel,
      roomModelId: data?.roomModel.id,
    },
  };
};
