import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WithLayoutPage, HotelGuest } from '@/interfaces/index';
import { GET_HOTEL_GUESTS } from '@/queries/index';
import { useLazyQuery } from '@apollo/client';
import { getUser } from '@/graphql/utils';
import { client } from '@/lib/apollo';
import Backdrop from '@/components/Backdrop';
import Head from 'next/head';
import AdminMenu from '@/components/layouts/AdminMenu';
import Box from '@mui/material/Box';
import GuestsTable from '@/components/dashboard/tables/GuestsTable';
type PagePromps = {
  guests: HotelGuest[];
  totalResults: number;
  userId: number;
  hotelId: number;
};
const resultsPerPage = 6;
const Guest: WithLayoutPage<PagePromps> = (props) => {
  const [guests, setGuest] = React.useState(props.guests);
  const [totalResults, setTotalResults] = React.useState<number>(
    props.totalResults
  );
  const [hasRender, setHasRender] = React.useState(false);

  const [page, setPage] = React.useState<number>(0);
  const [query, setQuery] = React.useState<{
    userId: number;
    hotelId: number;
    take: number;
    skip: number;
    search?: {
      field: string;
      value: string;
    };
  }>({
    userId: props.userId,
    hotelId: props.hotelId,
    take: resultsPerPage,
    skip: 0,
  });
  const handleActions = (action: 'search' | 'pageChange', data: any) => {
    if (action === 'search') {
      const [field, value] = data;

      if (!value) {
        setPage(0);
        return setQuery({
          userId: props.userId,
          hotelId: props.hotelId,
          take: resultsPerPage,
          skip: 0,
        });
      }
      return setQuery({
        ...query,
        search: {
          field: field,
          value: value,
        },
      });
    }
    if (action === 'pageChange') {
      const newPage = data;
      const take = (newPage + 1) * resultsPerPage;
      const skip = newPage * resultsPerPage;
      setPage(newPage);
      setQuery({
        ...query,
        take,
        skip,
      });
    }
  };
  const [searchGuest, { data, loading, error }] =
    useLazyQuery(GET_HOTEL_GUESTS);
  const handleGuestsSearch = async () => {
    try {
      await searchGuest({
        variables: {
          ...query,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  React.useEffect(() => {
    if (!hasRender) return setHasRender(true);
    handleGuestsSearch();
  }, [query]);

  React.useEffect(() => {
    if (data?.results) {
      setGuest(data.results.guests);
      setTotalResults(data.results.totalResults);
    }
  }, [data]);

  return (
    <div>
      <Head>
        <title>Guests</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ maxWidth: 1200 }} component="main">
        <GuestsTable
          data={guests}
          handleActions={handleActions}
          totalResults={totalResults}
          currentPage={page}
        />
      </Box>
      <Backdrop loading={loading} />
    </div>
  );
};
Guest.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="guests">{page}</AdminMenu>;
};
export default Guest;
type PageContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  query: {
    hotelId: number;
  };
};
export const getServerSideProps = async ({ req, res, query }: PageContext) => {
  try {
    const user = await getUser(req, res);

    if (user.role === 'ADMIN') {
      const { data, error } = await client.query({
        query: GET_HOTEL_GUESTS,
        variables: {
          userId: user.id,
          hotelId: query.hotelId,
          take: 6,
          skip: 0,
        },
      });

      return {
        props: {
          hotelId: query.hotelId,
          userId: user.id,
          guests: data.results.guests,
          totalResults: data.results.totalResults,
        },
      };
    }

    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  } catch (e: any) {
    console.log(e.networkError ? e.networkError?.result?.errors : e);
    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  }
};
