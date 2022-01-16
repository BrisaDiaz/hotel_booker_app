import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import type { Modify } from '@/interfaces/index';
import AdminMenu from '@/components/layouts/AdminMenu';
import HotelForm from '@/components/dashboard/forms/Hotel/index';
import Backdrop from '@/components/Backdrop';
import { useAuth } from '@/context/useAuth';
import SnackBar from '@/components/SnackBar';
import { useMutation } from '@apollo/client';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import { prisma } from '@/lib/prisma';
import { CREATE_HOTEL } from '@/queries/index';
import type { Hotel } from '@/interfaces/index';
import useNotification from '@/hooks/useNotification'
type Option = {
  id: number;
  name: string;
};
type PageProps = {
  facilitiesList: Option[];
  activitiesList: Option[];
  servicesList: Option[];
  languagesList: Option[];
  hotelCategoriesList: Option[];
};

const HotelUploadPage: any = ({
  facilitiesList,
  activitiesList,
  servicesList,
  languagesList,
  hotelCategoriesList,
}: PageProps) => {
  const authContext = useAuth();

  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const { notification,notify} = useNotification({autoClean:true})
    
  const [createHotel] = useMutation(CREATE_HOTEL, {
    onCompleted: () => {
      setIsLoading(false);
      notify({type:'success',content:'Hotel created successfully'});
    },
    onError: ({message}) => {
      console.log(message)
      setIsLoading(false);
      notify({type:'error',content:"Hotel couldn't be created, please try later"});
    },
  });



  
  type HotelVariables = Modify<
    Hotel,
    {
      frameImage: File;
      interiorImage: File;
    }
  >;


  const onSubmit = async (hotelVariables: HotelVariables) => {
    if (!authContext.session.user) return router.push('/signin');

    const toUploadImages = [
      hotelVariables.interiorImage,
      hotelVariables.frameImage,
    ];

    setIsLoading(true);

    try {

      const images = await uploadToCloudinary(toUploadImages);
      if (!images.length) {
        setIsLoading(false);
        return notify({type:'error',content:'There was an error on the images upload'});
      }

      await createHotel({
        variables: {
          ...hotelVariables,
          interiorImage: images[0].secure_url,
          frameImage: images[1].secure_url,
          userId: authContext.session.user.id,
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      notify({type:'error',content:"Hotel couldn't be created, try later"});
      console.log(err);
    }
  };
  

React.useEffect(() => {
if (!authContext.session.loading && !authContext.session.user)  router.push('/signin');
}, [authContext])

 if (authContext.session.loading) return <Backdrop loading={true} />;
  return (
    <div>
      <Head>
        <title>Upload Hotel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
  
        {notification.content && (
          <SnackBar
            severity={notification.type}
            message={notification.content}
          />
        )}

        <HotelForm
          facilities={facilitiesList}
          activities={activitiesList}
          services={servicesList}
          languages={languagesList}
          hotelCategories={hotelCategoriesList}
          submitHandler={onSubmit}
        />
      </main>
      <Backdrop loading={isLoading} />
    </div>
  );
};
HotelUploadPage.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="dashboard">{page}</AdminMenu>;
};
export default HotelUploadPage;

export const getStaticProps = async ()=> {
  const activitiesRequest = prisma.activity.findMany({});
  const servicesRequest = prisma.service.findMany({});
  const facilitiesRequest = prisma.facility.findMany({});
  const languagesRequest = prisma.language.findMany({});
  const categoriesRequest = prisma.hotelCategory.findMany({});
  const [
    activitiesList,
    facilitiesList,
    servicesList,
    languagesList,
    hotelCategoriesList,
  ] = await Promise.all([
    activitiesRequest,
    facilitiesRequest,
    servicesRequest,
    languagesRequest,
    categoriesRequest,
  
  ]);

  const props = {
    facilitiesList:JSON.parse (JSON.stringify(facilitiesList)),
    activitiesList:JSON.parse ( JSON.stringify(activitiesList)),
    servicesList:JSON.parse ( JSON.stringify(servicesList)),
    languagesList:JSON.parse ( JSON.stringify(languagesList)),
    hotelCategoriesList: JSON.parse (JSON.stringify(hotelCategoriesList)),
  };

  return {
    props: {
      ...props,
       revalidate: 60,
    },
  };
};
