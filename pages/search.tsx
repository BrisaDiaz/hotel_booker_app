import React from 'react';
import { NextApiResponse } from 'next';
import { client } from '@/lib/apollo';
import { useLazyQuery } from '@apollo/client';
import Head from 'next/head';
import Typography from '@mui/material/Typography';

import HotelsGrid from '@/components/HotelsGrid';
import FilterMenu from '@/components/layouts/FilterMenu';
import Pagination from '@/components/Pagination';
import Box from '@mui/material/Box';
import { Hotel, Feature } from '@/interfaces/index';
import Backdrop from '@/components/Backdrop';
import {
  GET_ALL_SERVICES,
  GET_ALL_FACILITIES,
  GET_ALL_ACTIVITIES,
  GET_ALL_LANGUAGES,
  GET_ALL_HOTEL_CATEGORIES,
  GET_HOTEL_SEARCH_SUGGESTIONS,
  GET_HOTELS,
} from '@/queries/index';

type Props = {
  facilitiesList: Feature[];
  activitiesList: Feature[];
  languagesList: Feature[];
  servicesList: Feature[];
  hotelCategoriesList: Feature[];

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

  const [getSuggestions, suggestionsRequest] = useLazyQuery(
    GET_HOTEL_SEARCH_SUGGESTIONS
  );

  const formatHotelSuggestions = (
    suggestions: {
      id: number;
      name: string;
      address: string;
    }[]
  ) => {
    return suggestions.map((hotel) => ({
      primary: hotel.name,
      secondary: hotel.address,
    }));
  };
  const [hotelSuggestions, setHotelSuggestions] = React.useState<
    { primary: string; secondary: string }[]
  >([]);

  const SUGGESTIONS_QUANTITY = 4;

  const onSearchFilter = async (search: string) => {
    await getSuggestions({ variables: { take: SUGGESTIONS_QUANTITY, search } });
  };
  React.useEffect(() => {
    if (suggestionsRequest.data?.suggestions) {
      setHotelSuggestions(
        formatHotelSuggestions(suggestionsRequest.data.suggestions)
      );
    }
  }, [suggestionsRequest.data]);

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
    const skip: number = (page - 1) * 6;

    const searchVariables = { ...variables, take: 6, skip };

    try {
      await requestHotels({
        variables: searchVariables,
      });
    } catch (err) {
      console.log(err);
      console.log(error?.graphQLErrors);
    }
  };
  React.useEffect(() => {
    if (data?.hotelSearch) {
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
          onSearchFilter={onSearchFilter}
          searchOptions={hotelSuggestions}
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
              padding: { xs: '30px 0', md: '30px 16px' },
            }}
          >
            {displayHotels?.length ? (
              <HotelsGrid hotels={displayHotels} />
            ) : (
              <Box>
                <Typography>
                  {"There wasn't any coincidence for the search"}
                </Typography>
              </Box>
            )}
          </Box>
          {!displayHotels?.length && <Box sx={{ height: '65vh' }} />}
          <Box sx={{ p: 2, pb: 4, mx: 'auto', maxWidth: 'fit-content' }}>
            <Pagination setPage={setPage} count={pageCount} />
          </Box>
        </FilterMenu>
        <Backdrop loading={loading} />
      </main>
    </div>
  );
};

export default Search;
export const getServerSideProps = async ({ res }: { res: NextApiResponse }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );
  const activitiesRequest = await client.query({
    query: GET_ALL_ACTIVITIES,
  });
  const servicesRequest = await client.query({
    query: GET_ALL_SERVICES,
  });
  const facilitiesRequest = await client.query({
    query: GET_ALL_FACILITIES,
  });
  const languagesRequest = await client.query({
    query: GET_ALL_LANGUAGES,
  });
  const categoriesRequest = await client.query({
    query: GET_ALL_HOTEL_CATEGORIES,
  });

  const hotelsRequest = await client.query({
    query: GET_HOTELS,
  });

  const props = {
    activitiesList: activitiesRequest.data.activitiesList,
    servicesList: servicesRequest.data.servicesList,
    facilitiesList: facilitiesRequest.data.facilitiesList,
    languagesList: languagesRequest.data.languagesList,
    hotelCategoriesList: categoriesRequest.data.hotelCategoriesList,
    hotelSearch: hotelsRequest.data.hotelSearch,
  };

  return {
    props: {
      ...props,
    },
  };
};
