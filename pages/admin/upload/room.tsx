import Head from 'next/head';
import React from 'react';
import { useAuth } from '@/context/useAuth';
import { useRouter } from 'next/router';
import SnackBar from '@/components/SnackBar';
import RoomForm from '@/components/dashboard/forms/Room/index';
import Backdrop from '@/components/Backdrop';
import AdminMenu from '@/components/layouts/AdminMenu';
import { useMutation } from '@apollo/client';
import { RoomBuildierVariables } from '@/interfaces/index';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import { prisma } from '@/lib/prisma';
import { CREATE_ROOM_MODEL } from '@/queries/index';
import { Feature } from '@/interfaces/index';

type PageProps = {
  amenitiesList: Feature[];
  servicesList: Feature[];
  roomCategoriesList: Feature[];
  bedTypesList: Feature[];
};
const RoomUploadPage: any = ({
  amenitiesList,
  servicesList,
  roomCategoriesList,
  bedTypesList,
}: PageProps) => {
  const authContext = useAuth();

  const router = useRouter();


  const { hotelId } = router.query;
  const [isLoading, setIsLoading] = React.useState(false);
  const [createRoomUploadPageModel, { error }] = useMutation(
    CREATE_ROOM_MODEL,
    {
      onCompleted: () => {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      },
      onError: (graphError) => {
        setIsLoading(false);

        setErrorMessage(graphError.message);
      },
    }
  );
  const [success, setSuccess] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const onSubmit = async (variables: RoomBuildierVariables) => {
    if (!authContext.session.user) return router.push('/signin');
    setIsLoading(true);
    try {
      const [mainImageData] = await uploadToCloudinary([variables.mainImage]);

      await createRoomUploadPageModel({
        variables: {
          ...variables,
          hotelId: hotelId,
          userId: authContext.session.user.id,
          mainImage: mainImageData.secure_url,
        },
      });
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      setErrorMessage(JSON.stringify(err));
    }
  };


React.useEffect(() => {
if (!authContext.session.loading && !authContext.session.user)  router.push('/signin');
}, [authContext])
  if (authContext.session.loading) return <Backdrop loading={true} />;
  return (
    <div>
      <Head>
        <title>Upload Room</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {error && (
          <SnackBar
            severity="error"
            message={errorMessage || "Request couldn't be complited"}
          />
        )}
        {success && (
          <SnackBar
            severity="success"
            message="hotel was created successfully"
          />
        )}
        <RoomForm
          services={servicesList}
          amenities={amenitiesList}
          roomCategories={roomCategoriesList}
          bedTypes={bedTypesList}
          submitHandler={onSubmit}
        />
        <Backdrop loading={isLoading} />
      </main>
    </div>
  );
};
export default RoomUploadPage;
RoomUploadPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export const getStaticProps = async () => {
  const servicesRequest = prisma.service.findMany({});
  const amenitiesRequest = prisma.amenity.findMany({});
  const categoriesRequest = prisma.roomCategory.findMany({});
  const bedsRequest = prisma.bedType.findMany({});
  const [amenitiesList, servicesList, roomCategoriesList, bedTypesList] =
    await Promise.all([
      amenitiesRequest,
      servicesRequest,
      categoriesRequest,
      bedsRequest,
    ]);

  const props = {
    amenitiesList: JSON.parse (JSON.stringify(amenitiesList)),
    servicesList: JSON.parse (JSON.stringify(servicesList)),
    roomCategoriesList: JSON.parse (JSON.stringify(roomCategoriesList)),
    bedTypesList: JSON.parse (JSON.stringify(bedTypesList)),
  };

  return {
    props: {
      ...props,
       revalidate: 60,
    },
  };
};
