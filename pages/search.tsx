import type { NextPage } from 'next';
import { GetStaticProps } from 'next';
import { client } from '../lib/apollo';
import { useMutation } from '@apollo/client';
import Head from 'next/head';
import HotelsGrid from '../components/HotelsGrid';
import FilterMenu from '../components/FilterMenu';
import hotel from '@/mocks/hotel';
import Box from '@mui/material/Box';

import {
  GET_ALL_SERVICES,
  GET_ALL_FACILITIES,
  GET_ALL_ACTIVITIES,
  GET_ALL_LANGUAGES,
  GET_ALL_HOTEL_CATEGORIES,
  GET_HOTELS,
} from '@/queries/index';

type Data = {
  id: number;
  name: string;
  __typename: string;
};
interface hotel {
  name: string;
  lowestPrice: number;
  address: {
    holeAddress: string;
  };
  description: string;
  frameImage: string;
}
type Props = {
  facilitiesList: Data[];
  activitiesList: Data[];
  languagesList: Data[];
  servicesList: Data[];
  hotelCategoriesList: Data[];
  hotels: hotel[];
};
const Search = ({
  facilitiesList,
  activitiesList,
  languagesList,
  servicesList,
  hotelCategoriesList,
  hotels,
}: Props) => {
  return (
    <div>
      <Head>
        <title>Search</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <FilterMenu
          facilities={facilitiesList}
          activities={activitiesList}
          languages={languagesList}
          services={servicesList}
          hotelCategories={hotelCategoriesList}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '30px 0',
            }}
          >
            <HotelsGrid hotels={hotels} />
          </Box>
        </FilterMenu>
      </main>
    </div>
  );
};

export default Search;
export const getStaticProps: GetStaticProps = async (context) => {
  const activitiesRequest = await client.query({
    query: GET_ALL_ACTIVITIES,
  });
  const servicesRequest = await client.query({
    query: GET_ALL_SERVICES,
  });
  const facilitiesRequest = await client.query({
    query: GET_ALL_FACILITIES,
  });
  const categoriesRequest = await client.query({
    query: GET_ALL_HOTEL_CATEGORIES,
  });
  const languagesRequest = await client.query({
    query: GET_ALL_LANGUAGES,
  });
  const hotelsRequest = await client.query({
    query: GET_HOTELS,
  });
  const response = await Promise.all([
    activitiesRequest,
    servicesRequest,
    facilitiesRequest,
    categoriesRequest,
    languagesRequest,
    hotelsRequest,
  ]);

  const props = {
    ...facilitiesRequest.data,
    ...activitiesRequest.data,
    ...languagesRequest.data,
    ...servicesRequest.data,
    ...categoriesRequest.data,
    ...hotelsRequest.data,
  };

  return {
    props: {
      ...props,
    },
  };
};
