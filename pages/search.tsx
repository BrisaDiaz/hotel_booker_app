import React from 'react';
import { GetStaticProps } from 'next';
import { client } from '../lib/apollo';
import { useLazyQuery } from '@apollo/client';
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
interface Hotel {
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
  hotels: Hotel[];
};

const Search = ({
  facilitiesList,
  activitiesList,
  languagesList,
  servicesList,
  hotelCategoriesList,
  hotels,
}: Props) => {
  const [displayHotels, setDisplayHotels] = React.useState<Hotel[]>(hotels);
  const [requestHotels, { data, error, loading }] = useLazyQuery(GET_HOTELS, {
    fetchPolicy: 'no-cache',
  });
  const handleSearch = async (variables: {
    features: string[];
    categories: string[];
    services: string[];
    activities: string[];
    languages: string[];
    sort: string;
    search: string | null;
  }) => {
    await requestHotels({
      variables: variables,
    });
  };
  console.log(data, loading, error);
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
          handleSubmit={handleSearch}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '30px 0',
            }}
          >
            <HotelsGrid hotels={displayHotels || hotels} />
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
