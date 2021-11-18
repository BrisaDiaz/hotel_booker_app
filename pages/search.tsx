import React from 'react';
import { GetStaticProps } from 'next';
import { client } from '@/lib/apollo';
import { useLazyQuery } from '@apollo/client';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import HotelsGrid from '@/components/HotelsGrid';
import FilterMenu from '@/components/layouts/FilterMenu';
import Pagination from '@/components/pagination';
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

  hotelSearch: {
    hotels: Hotel[];
    pageCount: number;
    totalResults: number;
  };
};

const Search = ({
  facilitiesList,
  activitiesList,
  languagesList,
  servicesList,
  hotelCategoriesList,
  hotelSearch,
}: Props) => {
  const [page, setPage] = React.useState<number>(1);
  const [pageCount, setPageCount] = React.useState<number>(
    hotelSearch.pageCount
  );
  const [displayHotels, setDisplayHotels] = React.useState<Hotel[]>(
    hotelSearch.hotels
  );

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
    const skipe: number = page - 1 * 6;

    let serchVariables = { ...variables, take: 6, skipe };

    try {
      await requestHotels({
        variables: serchVariables,
      });
    } catch (err) {
      console.log(err);
      console.log(error?.graphQLErrors);
    }
  };
  React.useEffect(() => {
    if (data?.hotelSearch && !loading) {
      setDisplayHotels(data?.hotelSearch.hotels);
      setPageCount(data?.hotelSearch.pageCount);
    }
  }, [loading]);

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
            {displayHotels.length ? (
              <HotelsGrid hotels={displayHotels} />
            ) : (
              <Box>
                <Typography>
                  There wasn't any coincidens for the search
                </Typography>
              </Box>
            )}
          </Box>
          {!displayHotels.length && <Box sx={{ height: '65vh' }} />}
          <Box sx={{ p: 2, pb: 4, mx: 'auto', maxWidth: 'fit-content' }}>
            <Pagination setPage={setPage} count={pageCount} />
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
