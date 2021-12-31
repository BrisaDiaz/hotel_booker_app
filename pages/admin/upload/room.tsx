import Head from 'next/head';
import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
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
  if (authContext.loading) return <Backdrop loading={true} />;

  if (!authContext.session.user) return router.push('/signin');

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
  const [success, setSuccess] = React.useState<Boolean>(false);
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

  return (
    <div>
      <Head>
        <title>Create Next App</title>
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
export const getStaticProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const servicesRequest = prisma.service.findMany({});
  const amenitiesRequest = prisma.amenity.findMany({});
  const categoriesRequest = prisma.roomCategory.findMany({});
  const bedsRequest = prisma.bedType.findMany({});
  const [amenitiesList, servicesList, roomCategoriesList, bedTypesList] =
    await Promise.all([
      servicesRequest,
      categoriesRequest,
      amenitiesRequest,
      bedsRequest,
    ]);

  const props = {
    amenitiesList: JSON.stringify(amenitiesList),
    servicesList: JSON.stringify(servicesList),
    roomCategoriesList: JSON.stringify(roomCategoriesList),
    bedTypesList: JSON.stringify(bedTypesList),
  };

  return {
    props: {
      ...props,
    },
  };
};
