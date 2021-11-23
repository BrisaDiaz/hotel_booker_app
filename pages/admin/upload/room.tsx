import Head from 'next/head';
import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import SnackBar from '@/components/SnackBar';
import RoomForm from '@/components/RoomForm';
import Backdrop from '@/components/Backdrop';
import AdminMenu from '@/components/layouts/AdminMenu';
import { client } from '@/lib/apollo';
import { useMutation } from '@apollo/client';
import { RoomBuildierVariables } from '@/interfaces/index';
import {
  GET_ALL_SERVICES,
  GET_ALL_ROOM_CATEGORIES,
  CREATE_ROOM_MODEL,
  GET_ALL_AMENITIES,
  GET_ALL_BEDS,
} from '@/queries/index';
type Option = {
  id: number;
  name: string;
};
const RoomUploadPage: WithLayoutPage = ({
  amenitiesList,
  servicesList,
  roomCategoriesList,
  bedTypesList,
}: {
  amenitiesList: Option[];
  servicesList: Option[];
  roomCategoriesList: Option[];
  bedTypesList: Option[];
}): JSX.Element => {
  const router = useRouter();
  const { hotelId } = router.query;

  const [createRoomUploadPageModel, { error, loading, data }] = useMutation(
    CREATE_ROOM_MODEL,
    {
      onCompleted: () => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      },
      onError: (graphError) => {
        console.log(graphError.message);
        console.log(graphError);
        setErrorMessage(graphError.message);
      },
    }
  );
  const [success, setSuccess] = React.useState<Boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const onSubmit = async (variables: RoomBuildierVariables) => {
    try {
      await createRoomUploadPageModel({
        variables: { ...variables, hotelId: hotelId },
      });
    } catch (err) {
      console.log(err);
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
        <Backdrop loading={loading} />
      </main>
    </div>
  );
};
export default RoomUploadPage;
RoomUploadPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const servicesRequest = await client.query({
    query: GET_ALL_SERVICES,
  });
  const amenitiesRequest = await client.query({
    query: GET_ALL_AMENITIES,
  });
  const categoriesRequest = await client.query({
    query: GET_ALL_ROOM_CATEGORIES,
  });
  const bedsRequest = await client.query({
    query: GET_ALL_BEDS,
  });

  const response = await Promise.all([
    servicesRequest,
    categoriesRequest,
    amenitiesRequest,
    bedsRequest,
  ]);

  const props = {
    ...amenitiesRequest.data,
    ...servicesRequest.data,
    ...categoriesRequest.data,
    ...bedsRequest.data,
  };

  return {
    props: {
      ...props,
    },
  };
};
