import * as React from 'react';

import { WithLayoutPage } from '@/interfaces/index';
import { client } from '@/lib/apollo';
import AppBar from '@/components/layouts/AppBar';
import { GET_HOTEL_BY_ID, GET_HOTEL_IMAGES } from '@/queries/index';
import { useLazyQuery } from '@apollo/client';
import { getFeaturesTags } from '@/utils/getHotelFeatureTags';
import Head from 'next/head';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DoneIcon from '@mui/icons-material/Done';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Typography from '@mui/material/Typography';
import AlarmIcon from '@mui/icons-material/Alarm';
import Tabs from '@/components/Tabs';
import AsyncCarrouselModal from '@/components/modals/AsyncCarrouselModal';
import DynamicFiledIcon from '@/components/DynamicFiledIcon';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HikingIcon from '@mui/icons-material/Hiking';
import LanguageIcon from '@mui/icons-material/Language';
import RoomCard from '@/components/RoomCard';
import currencyFixer from '@/utils/currencyFixer';
import { useTheme } from '@mui/material/styles';
import { Hotel } from '@/interfaces/index';
import ImageGrid from '@/components/ImageGrid';
const styles = {
  list: {
    display: 'flex',
    p: '0 10px',
    flexWrap: 'wrap',
    flexDirection: 'column',
    columnGap: '20px',

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
  contactInfo: {
    py: 1,
    px: { xs: 2, lg: 1 },
    mb: '-16px',
    display: 'flex',
    columnGap: { xs: 2, sm: 3 },
    rowGap: 0,
    color: 'primary.main',
    textDecoration: 'underline',
    flexWrap: 'wrap',
    fontStyle: 'inherit',
    background: '#e6e6e6',
  },
} as const;
const HotelPage: WithLayoutPage<{ hotel: Hotel }> = ({ hotel }) => {
  const theme = useTheme();
  const characteristics = [
    {
      title: 'facilities',
      items: hotel.facilities,
    },
    {
      title: 'services',
      items: hotel.services,
    },

    {
      title: 'activities',
      items: hotel.activities,
    },
    {
      title: 'languages',
      items: hotel.languages,
    },
  ];
  const includedFeatures = getFeaturesTags(hotel.features);
  const mainImages = [
    {
      image: hotel.frameImage,
      title: 'Hotel Facade',
    },
    {
      image: hotel.interiorImage,
      title: 'Hotel Exterior',
    },
  ];
  const miniatures = hotel.miniatures.map((img) => ({
    title: `${hotel.name} photo`,
    image: img.src,
  }));

  const [isCarouselOpen, setIsCarouselOpen] = React.useState<boolean>(false);
  const [carouselImages, setCarrouselImages] = React.useState<
    { image: string; title: string }[]
  >([...mainImages, ...miniatures]);
  const [CarrouselIndex, setCarrouselIndex] = React.useState<number>(0);

  const [getHotelImages, { data }] = useLazyQuery(GET_HOTEL_IMAGES);
  const closeCarrousel = () => {
    setIsCarouselOpen(false);
    setCarrouselIndex(0);
  };
  const openCarousel = () => {
    if (carouselImages.length<3) return
     setIsCarouselOpen(true);
  };
  const handleImageClick = (
    img: { image: string; title: string },
    index: number
  ) => {
    setCarrouselIndex(index);
    handleShowMore();
  };
  const handleShowMore = async () => {
    try {
      await getHotelImages({
        variables: { hotelId: hotel.id, skip: miniatures.length },
      });
      !isCarouselOpen && openCarousel();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    if (data && 'images' in data) {
      setCarrouselImages([
        ...mainImages,
        ...data.images.map((img: { id: number; src: string }) => ({
          title: `${hotel.name} photo`,
          image: img.src,
        })),
      ]);
    }
  }, [data]);
  return (
    <div>
      <Head>
        <title>{hotel.name} </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        component="main"
        sx={{ maxWidth: '900px', m: '80px auto 60px', overflowX: 'hidden' }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mx: { xs: 1, lg: 0 },
            mb: 2,
            width: 'fit-content',
            color: theme.palette.common.black,
            padding: '10px 0 5px',
          }}
        >
          {hotel.name}
        </Typography>
        <Box component="address" sx={styles.contactInfo}>
          <Box sx={styles.listItem}>
            <LocationOnIcon color="primary" fontSize="small" />
            <Typography color="primary" sx={{ fontSize: '14px' }}>
              {hotel.address.holeAddress}
            </Typography>
          </Box>

          {hotel?.email && (
            <Box sx={styles.listItem}>
              <EmailIcon color="primary" fontSize="small" />
              <Typography
                sx={{ fontSize: '14px' }}
                color="primary"
                component="a"
                href={`mailto: ${hotel.email}`}
              >
                {hotel.email}
              </Typography>
            </Box>
          )}
          {hotel?.website && (
            <Box sx={styles.listItem}>
              <LanguageIcon color="primary" fontSize="small" />
              <Typography
                sx={{ fontSize: '14px', textTransform: 'lowercase' }}
                color="primary"
                component="a"
                href={'https://' + hotel.website}
                target="_blank"
              >
                {hotel.website}
              </Typography>
            </Box>
          )}
          <Box sx={styles.listItem}>
            <LocalPhoneIcon color="primary" fontSize="small" />
            <Typography
              sx={{ fontSize: '14px' }}
              color="primary"
              component="a"
              href={`tel:${hotel.telephone}`}
            >
              {hotel.telephone}
            </Typography>
          </Box>
        </Box>

        {/* CARROUSEL */}
        <ImageGrid
          mainImages={mainImages}
          miniatures={miniatures}
          totalQuantity={hotel.imagesCount - miniatures.length}
          onClick={handleImageClick}
          onShowMore={handleShowMore}
        />

        <AsyncCarrouselModal
          totalImages={hotel.imagesCount + mainImages.length}
          images={carouselImages}
          onClose={closeCarrousel}
          isOpen={isCarouselOpen}
          defaultIndex={CarrouselIndex}
          requireMore={handleShowMore}
        />
        <Box component="section" sx={{ px: { xs: 1, md: 0 } }}>
          <Typography
            component="h4"
            variant="h5"
            sx={{
              fontWeight: 200,
              maxWidth: 'fit-content',
              ml: 'auto',
              mr: 1,
              mb: 0.5,
            }}
          >
            Prices from{' '}
            <Typography
              variant="h5"
              component="span"
              sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}
            >
              USD {currencyFixer(hotel.lowestPrice)}
            </Typography>
          </Typography>

          <Typography
            variant="subtitle1"
            color="primary"
            sx={{
              fontWeight: 200,
              width: 170,
              lineHeight: 1.3,
              textAlign: 'end',
              m: { xs: '0 8px 30px auto', md: '0 8px  20px auto ' },
            }}
          >
            {hotel.taxesAndCharges ? `Taxes and Charges ` : 'Taxes Included'}

            {hotel.taxesAndCharges ? (
              <Typography
                component="span"
                sx={{ fontWeight: 200, ml: 0.5, fontSize: 'inherit' }}
              >
                USD {currencyFixer(hotel.taxesAndCharges)}
              </Typography>
            ) : null}
          </Typography>

          {/* HOTEL POLICIES AND RULES */}
          <Box sx={{ margin: '20px 10px' }} component="section">
            <Tabs
              data={[
                {
                  title: 'About Us',
                  Content: (
                    <Box sx={{ margin: { xs: '24px 6px', md: '30px 0' } }}>
                      <Box
                        sx={{ fontSize: { xs: '14px', md: '16px' } }}
                        dangerouslySetInnerHTML={{ __html: hotel.description }}
                      />
                    </Box>
                  ),
                },
                {
                  title: 'Policies and Rules',
                  Content: (
                    <Box sx={{ margin: { xs: '24px 6px', md: '30px 0' } }}>
                      <Box
                        sx={{ fontSize: { xs: '14px', md: '16px' } }}
                        dangerouslySetInnerHTML={{
                          __html: hotel.policiesAndRules,
                        }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          columnGap: '20px',

                          flexWrap: 'wrap',
                        }}
                      >
                        <Box sx={styles.listItem}>
                          <AlarmIcon fontSize="small" color="primary" />
                          <Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              color="primary"
                            >
                              Check In Hour:
                            </Typography>
                            <time> {`  ${hotel.checkInHour}`}</time>
                          </Typography>
                        </Box>
                        <Box sx={styles.listItem}>
                          <AlarmIcon fontSize="small" color="primary" />
                          <Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              color="primary"
                            >
                              Check Out Hour:
                            </Typography>
                            <time> {`  ${hotel.checkOutHour}`}</time>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ),
                },
              ]}
            />
          </Box>

          {/* HOTEL CHARACTERISTICS */}

          <Box sx={{ mt: { xs: 3, sm: 5 }, maxWidth: 900 }} component="section">
            <Box
              component="ul"
              sx={{
                mx: 0,
                mb: { sm: 3 },
                px: { xs: 1, md: 0 },
                display: 'flex',
                columnGap: 4,
                flexWrap: 'wrap',
              }}
            >
              {includedFeatures.map((featureName) => (
                <Box
                  component="li"
                  sx={{ ...styles.list, p: 0 }}
                  key={featureName}
                >
                  <Box sx={styles.listItem}>
                    {DynamicFiledIcon(featureName)}

                    <p>{featureName}</p>
                  </Box>
                </Box>
              ))}
            </Box>
            <Grid container alignItems="flex-start" sx={{ columnGap: '80px' }}>
              {characteristics.length &&
                characteristics.map((characteristic) =>
                  characteristic.items && characteristic.items.length ? (
                    <div key={characteristic.title}>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          padding: { xs: 1, sm: 0 },
                          minWidth: { xs: '100%', sm: 'max-content' },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center',
                            marginBottom: '15px',
                          }}
                        >
                          {characteristic.title === 'facilities' ? (
                            <ApartmentIcon color="primary" />
                          ) : characteristic.title === 'services' ? (
                            <RoomServiceIcon color="primary" />
                          ) : characteristic.title === 'languages' ? (
                            <LanguageIcon color="primary" />
                          ) : characteristic.title === 'activities' ? (
                            <HikingIcon color="primary" />
                          ) : null}

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 300,
                              textTransform: 'capitalize',
                            }}
                          >
                            {characteristic.title}
                          </Typography>
                        </Box>

                        <Box sx={styles.list} component="ul">
                          {characteristic.items.map((item) => (
                            <Box
                              key={item.id}
                              sx={styles.listItem}
                              component="li"
                            >
                              <DoneIcon
                                fontSize="small"
                                sx={{ color: theme.palette.secondary.main }}
                              />
                              <Typography>{item.name}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </div>
                  ) : null
                )}
            </Grid>
          </Box>
        </Box>
        {hotel.roomModels && hotel?.roomModels?.length > 0 && (
          <Box>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                background: '#e6e6e6',
                my: 1,
                padding: '10px 15px ',
              }}
            >
              Rooms
            </Typography>
            <Box sx={{ mt: 3, mb: 3, mx: { xs: 1, sm: 4 } }}>
              <Grid container spacing={3} justifyContent="start">
                {hotel.roomModels.map((room) => (
                  <Grid item xs={12} sm={6} key={room.id}>
                    <RoomCard room={room} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};
HotelPage.getLayout = (page: React.ReactNode) => (
  <>
    <AppBar />
    <>{page}</>
  </>
);
export default HotelPage;
export const getServerSideProps = async ({
  query,
}: {
  query: { id: string };
}) => {
  const { data, error } = await client.query({
    query: GET_HOTEL_BY_ID,
    variables: { hotelId: parseInt(query.id) },
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
      hotel: data?.hotelById,
    },
  };
};
