import React from 'react';
import type {  NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '@/graphql/utils';
import { client } from '@/lib/apollo';
import { GET_ADMIN_HOTELS, GET_HOTEL_BY_ID } from '@/queries/index';
import { useLazyQuery } from '@apollo/client';
import { Hotel } from '@/interfaces/index';
import SnackBar from '@/components/SnackBar';
import { useMutation} from '@apollo/client';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import {
  GET_ALL_SERVICES,
  GET_ALL_FACILITIES,
  GET_ALL_ACTIVITIES,
  GET_ALL_LANGUAGES,
  GET_ALL_HOTEL_CATEGORIES,
  UPDATE_HOTEL,
} from '@/queries/index';
import { WithLayoutPage } from '@/interfaces/index';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Backdrop from '@/components/Backdrop';
import DinamicForm from '@/components/dashboard/forms/Hotel/DinamicForm';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import ActionCard from '@/components/dashboard/ActionCard';
import HotelCard from '@/components/dashboard/HotelCard';
import HotelModal from '@/components/modals/HotelModal';
import useNotification from '@/hooks/useNotification'
type SectionToEdit =
  | 'about'
  | 'contact'
  | 'price'
  | 'aspect'
  | 'features'
  | 'policies'
  | 'address'
  | '';
type PageProps = {
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
  userId: number;
};

const Dashboard: WithLayoutPage<PageProps> = ({
  hotels,
  hotelsCount,
  userId,
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


  const [isHotelModalOpen, setIsHotelModalOpen] =
    React.useState<boolean>(false);
  const [hotelCards, setHotelCards] =
    React.useState<PageProps['hotels']>(hotels);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [toEditHotelData, setToEditHotelData] = React.useState<Hotel | null>(
    null
  );

  const [toEditSection, setToEditSection] = React.useState<SectionToEdit>('');
  const { notification,notify} = useNotification({autoClean:true})
  const formRef = React.useRef(null);
  const [getHotelToEdit, hotelDataRequest] = useLazyQuery(GET_HOTEL_BY_ID, {
    fetchPolicy: 'no-cache',
  });

  const [getCategries, categoriesRequest] = useLazyQuery(
    GET_ALL_HOTEL_CATEGORIES
  );
  const [getServices, servicesRequest] = useLazyQuery(GET_ALL_SERVICES);
  const [getFacilities, facilitiesRequest] = useLazyQuery(GET_ALL_FACILITIES);
  const [getActivities, activitiesRequest] = useLazyQuery(GET_ALL_ACTIVITIES);
  const [getLanguages, languagesRequest] = useLazyQuery(GET_ALL_LANGUAGES);
  const [updateHotel] = useMutation(UPDATE_HOTEL, {
    onCompleted: ({ hotel }: { hotel: Hotel }) => {
      setToEditHotelData(hotel);
      ///// update hotel card data
if(! toEditHotelData) return
toEditSection === 'about'  ? setToEditHotelData({...toEditHotelData,description:hotel.description,brand: hotel.brand,category:hotel.category,name:hotel.name}):toEditSection === 'address' ? setToEditHotelData({...toEditHotelData,address:hotel.address}):toEditSection === 'price'? setToEditHotelData({...toEditHotelData,lowestPrice:hotel.lowestPrice,taxesAndCharges:hotel.taxesAndCharges}):toEditSection === 'aspect'? setToEditHotelData({...toEditHotelData,frameImage:hotel.frameImage,interiorImage:hotel.interiorImage}):toEditSection === 'features'? setToEditHotelData({...toEditHotelData,services:hotel.services,activities:hotel.activities,languages:hotel.languages,facilities:hotel.facilities,features:hotel.features}):toEditSection === 'policies'? setToEditHotelData({...toEditHotelData,
checkInHour:hotel.checkInHour,
checkOutHour:hotel.checkOutHour,
policiesAndRules:hotel.policiesAndRules
}):setToEditHotelData({...toEditHotelData,
telephone:hotel.telephone,
email:hotel.email,
website:hotel.website
})

      if (
        toEditSection === 'about' ||
        toEditSection === 'address' ||
        toEditSection === 'price' ||
        toEditSection === 'aspect'
      ) {
        const updatedHotelsCards = hotelCards.map((hotelCard) => {
          if (hotelCard.id === hotel.id) {
            return {
              id: hotel.id,
              name: hotel.name,
              frameImage: hotel.frameImage,
              lowestPrice: hotel.lowestPrice,
              taxesAndCharges: hotel.taxesAndCharges,
              address: {
                holeAddress: hotel.address.holeAddress,
              },
            };
          }
          return hotelCard;
        });
        setHotelCards(updatedHotelsCards);
      }
      setIsLoading(false);
      notify({
        content: 'Hotel updated successfully',
        type: 'success',
      });
      setToEditSection('');
      
    },
    onError: (graphError) => {
      setIsLoading(false);
      notify({ content: graphError.message, type: 'error' });
      
    },
  });

  React.useEffect(() => {
    if (
      hotelDataRequest.loading ||
      categoriesRequest.loading ||
      servicesRequest.loading ||
      facilitiesRequest.loading ||
      activitiesRequest.loading ||
      languagesRequest.loading
    ) {
      return setIsLoading(true);
    }
    setIsLoading(false);
  }, [
    hotelDataRequest,
    categoriesRequest,
    servicesRequest,
    facilitiesRequest,
    activitiesRequest,
    languagesRequest,
  ]);

  const openHotelModal = (hotelId: number) => {
    if (!toEditHotelData || hotelId !== toEditHotelData?.id) {
      return getHotelToEdit({ variables: { hotelId: hotelId } });
    }
    setIsHotelModalOpen(true);
  };

  React.useEffect(() => {
    if (hotelDataRequest.data?.hotelById) {
      setToEditHotelData(hotelDataRequest.data?.hotelById);
      setIsHotelModalOpen(true);
    }
  }, [hotelDataRequest.data]);

  const handleEditAbort = () => {
    setToEditSection('');
  };
  const closeHotelModal = () => {
    setIsHotelModalOpen(false);
  };

  const handleSubmit = async (hotelVariables: any) => {
    if (!toEditHotelData) return false;

    try {
      setIsLoading(true);
      if (toEditSection === 'aspect') {
        const toUploadImages = [
          hotelVariables.frameImage,
          hotelVariables.interiorImage,
        ];

        const images = await uploadToCloudinary(toUploadImages);
        if (
          images?.length === 2 &&
          images[1]?.secure_url &&
          images[0]?.secure_url
        ) {
          await updateHotel({
            variables: {
              hotelId: toEditHotelData.id,
              interiorImage: images[1].secure_url,
              frameImage: images[0].secure_url,
              userId: userId,
            },
          });
        }
      }
      return await updateHotel({
        variables: {
          hotelId: toEditHotelData.id,
          ...hotelVariables,
          userId: userId,
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      notify({ type: 'error', content: JSON.stringify(err) });
      console.log(err);
    }
  };

  const handleEditSelected = async (fieldSelected: SectionToEdit) => {
    if (fieldSelected === 'features') {
      await Promise.all([
        getServices(),
        getFacilities(),
        getActivities(),
        getLanguages(),
      ]);
    }
    if (fieldSelected === 'about') {
      await getCategries();
    }
    setToEditSection(fieldSelected);
  };

  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{ p: { xs: '16px 0', sm: '16px 16px' }, maxWidth: 1200 }}
        component="main"
      >
        <Box sx={{ p: ' 20px 10px 10px', maxWidth: 'fit-content' }}>
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
          {hotelCards.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
      
              onEdit={openHotelModal}
            />
          ))}
        </Box>

        <HotelModal
          isOpen={
            !isLoading && toEditHotelData && isHotelModalOpen ? true : false
          }
          onClose={closeHotelModal}
          onEdit={handleEditSelected}
          hotel={toEditHotelData}
        />
      </Box>
      {!isLoading && toEditSection && toEditHotelData && (
        <DinamicForm
          toEditSection={toEditSection}
          hotel={toEditHotelData}
          submitHandler={handleSubmit}
          abortHandler={handleEditAbort}
          facilities={facilitiesRequest?.data?.facilitiesList || []}
          activities={activitiesRequest.data?.activitiesList || []}
          languages={languagesRequest.data?.laguagesList || []}
          services={servicesRequest.data?.servicesList || []}
          hotelCategories={categoriesRequest?.data?.hotelCategoriesList || []}
        />
      )}
      <div ref={formRef} />
      <Backdrop loading={isLoading} />
      {notification?.content && (
        <SnackBar
          severity={notification?.type}
          message={notification?.content}
        />
      )}
    </div>
  );
};
Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export default Dashboard;

export const getServerSideProps = async ({
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
        userId: user.id,
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
