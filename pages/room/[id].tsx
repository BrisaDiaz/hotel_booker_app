import { WithLayoutPage } from '@/interfaces/index';
import React from 'react';
import { client } from '@/lib/apollo';
import Link from 'next/link';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
import AsyncCaroucelModal from '@/components/modals/AsyncCaroucelModal';
import ImageGrid from '@/components/ImageGrid';
import currencyFixer from '@/utils/currencyFixer';
import { RoomModel, Feature } from '@/interfaces/index';
import { useLazyQuery, useMutation } from '@apollo/client';
import useNotification from '@/hooks/useNotification';
import {
  MAKE_ROOM_CONSULT,
  GET_ROOM_MODEL_BY_ID,
  MAKE_BOOKING_REQUEST,
  GET_ROOM_MODEL_IMAGES,
} from '@/queries/index';
import { NextApiResponse } from 'next';

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
    gap: 1.5,
    minWidth: 'min-content',
    textTransform: 'capitalize',
    alignItems: 'center',

    '& > p,a,time': {
      m: '8px 0',
      fontSize: '14px',
    },
  },
  featuresItems: {
    display: 'flex',
    fontSize: '14px',
    '& > p,a,time': {
      fontSize: '14px',
    },
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
  const mainImages = [
    {
      image: room.mainImage,
      title: 'Room Interior',
    },
  ];
  const miniatures = room.miniatures.map((img) => ({
    title: `${room.name} photo`,
    image: img.src,
  }));

  const [isCarouselOpen, setIsCarouselOpen] = React.useState<boolean>(false);
  const [carouselImages, setCarruselImages] = React.useState<
    { image: string; title: string }[]
  >([...mainImages, ...miniatures]);
  const [carruselIndex, setCarrucelIndex] = React.useState<number>(0);

  const [getRoomImages, imagesRequest] = useLazyQuery(GET_ROOM_MODEL_IMAGES);
  const closeCarrucel = () => {
    setIsCarouselOpen(false);
    setCarrucelIndex(0);
  };
  const openCarousel = () => {
    setIsCarouselOpen(true);
  };
  const handleImageClick = (
    img: { image: string; title: string },
    index: number
  ) => {
    setCarrucelIndex(index);
    handleShowMore();
  };
  const handleShowMore = async () => {
    try {
      await getRoomImages({
        variables: { roomModelId: room.id, skip: miniatures.length },
      });
      !isCarouselOpen && openCarousel();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (imagesRequest.data && 'images' in imagesRequest.data) {
      setCarruselImages([
        ...mainImages,
        ...imagesRequest.data.images.map(
          (img: { id: number; src: string }) => ({
            title: `${room.name} photo`,
            image: img.src,
          })
        ),
      ]);
    }
  }, [imagesRequest]);

  const { notification, notify } = useNotification({ autoClean: true });

  const [makeRoomConsult, consultResponce] = useLazyQuery(MAKE_ROOM_CONSULT, {
    fetchPolicy: 'network-only',
  });

  const [makeBookingRequest, boolkingResponce] = useMutation(
    MAKE_BOOKING_REQUEST,
    {
      onCompleted({
        responce,
      }: {
        responce: { isAvailable: boolean; message: string };
      }) {
        const { isAvailable, message } = responce;
        if (isAvailable) {
          return notify({
            type: 'info',
            content:
              'There is availability, make your reservation before the quotas run out.',
          });
        }
        notify({
          type: 'info',
          content: message,
        });
      },
    }
  );

  const [loading, setLoading] = React.useState<boolean>(false);

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
    checkInHour: room?.hotel?.checkInHour,
    checkOutHour: room?.hotel?.checkOutHour,
  };
  console.log(room);
  return (
    <div>
      <Head>
        <title>
          {' '}
          {room.name}
          {' - '}
          {room?.hotel?.name}{' '}
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component="main" sx={{ maxWidth: '900px', m: '80px auto 30px' }}>
        <Box component={Link} href={`/hotel/${room.hotelId}`} passHref>
          <Typography
            variant="h3"
            component="a"
            sx={{
              fontWeight: 700,
              display: 'block',
              mx: { xs: 2, lg: 0 },
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
            mx: { xs: 2, lg: 0 },
            width: 'fit-content',
            textTransform: 'capitalize',
            padding: '10px 0 5px',
          }}
        >
          {room.name}
        </Typography>

        <ImageGrid
          mainImages={mainImages}
          miniatures={miniatures}
          totalQuantity={room.imagesCount - miniatures.length}
          onClick={handleImageClick}
          onShowMore={handleShowMore}
        />

        <AsyncCaroucelModal
          totalImages={room.imagesCount + mainImages.length}
          images={carouselImages}
          onClose={closeCarrucel}
          isOpen={isCarouselOpen}
          defaultIndex={carruselIndex}
          requireMore={handleShowMore}
        />
        <Box component="section" sx={{ px: { xs: 1, lg: 0 }, mt: 2 }}>
          <Typography
            component="h4"
            variant="h5"
            sx={{
              fontWeight: 200,
              maxWidth: 'fit-content',
              ml: 'auto',
              mr: 1,
            }}
          >
            Prices from{' '}
            <Typography
              variant="h5"
              component="span"
              sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}
            >
              USD {currencyFixer(room.lowestPrice)}
            </Typography>
          </Typography>

          <Typography
            variant="subtitle1"
            color="primary"
            sx={{
              fontWeight: 200,
              width: 160,
              lineHeight: 1.3,
              textAlign: 'end',
              m: { xs: '0 8px 30px auto', md: '0 8px  20px auto ' },
            }}
          >
            {room.taxesAndCharges ? `Taxes and Charges ` : 'Taxes Included'}
            {room.taxesAndCharges ? (
              <Typography
                component="span"
                sx={{ fontWeight: 200, ml: 0.5, fontSize: 'inherit' }}
              >
                USD {currencyFixer(room.taxesAndCharges)}
              </Typography>
            ) : null}
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
          <Box
            sx={{
              margin: ' 10px 10px 20px ',
              fontSize: { xs: '14px', md: '16px' },
            }}
            dangerouslySetInnerHTML={{ __html: room.description }}
          />

          <Box sx={{ display: 'flex' }}>
            <ConsultModal onSubmit={handleConsutlSubmit}>
              <Button
                size="small"
                sx={{ padding: '5px 10px', m: 1, textTransform: 'capitalize' }}
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
                size="small"
                sx={{
                  padding: '5px 10px',
                  textTransform: 'capitalize',

                  my: '8px',
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
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { sm: 'center' },
                rowGap: 2,
                columnGap: 6,
                textTransform: 'capitalize',
                margin: ' 0 15px',
                flexWrap: 'wrap',
                p: 0,
              }}
            >
              <Box
                component="li"
                sx={{
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
                    fontSize: '14px',
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
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {room.beds && room.beds.length && (
                  <RoomBedsUI beds={room.beds} size="medium" fontSize="14px" />
                )}
              </Box>
              <Box
                component="li"
                sx={{
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
                <Typography sx={{ mx: 1, fontSize: '14px' }}>
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
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
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
