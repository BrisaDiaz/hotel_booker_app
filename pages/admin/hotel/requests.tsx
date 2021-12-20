import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { WithLayoutPage } from '@/interfaces/index';
import {
  GET_HOTEL_BOOKING_REQUESTS,
  DECLINE_BOOKING_REQUEST,
  CONFIRM_BOOKING_REQUEST,
} from '@/queries/index';
import { getUser } from '@/graphql/utils';
import { BookingRequest } from '@/interfaces/index';
import { useMutation, useLazyQuery } from '@apollo/client';
import { client } from '@/lib/apollo';
import ConfimBookingModal from '@/components/modals/ConfimBookingModal';
import AdminMenu from '@/components/layouts/AdminMenu';
import Head from 'next/head';
import Box from '@mui/material/Box';
import RequestsTable from '@/components/dashboard/tables/RequestsTable';
import Dialog from '@/components/Dialog';
import SnackBar from '@/components/SnackBar';
import Backdrop from '@/components/Backdrop';
type PagePromps = {
  requests: BookingRequest[];
  totalResults: number;
  userId: number;
  hotelId: number;
};
const RoomRequests: WithLayoutPage<PagePromps> = (props) => {
  const resultsPerPage = 8;
  const [requests, setRequests] = React.useState<BookingRequest[] | []>(
    props.requests
  );
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
  const [searchRequests, searchRequestResponce] = useLazyQuery(
    GET_HOTEL_BOOKING_REQUESTS
  );

  const handleGuestsSearch = async () => {
    try {
      await searchRequests({
        variables: {
          ...query,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (!hasRender) return setHasRender(true);
    handleGuestsSearch();
  }, [query]);

  React.useEffect(() => {
    if (searchRequestResponce.data?.results) {
      setRequests(searchRequestResponce.data.results.requests);
      setTotalResults(searchRequestResponce.data.results.totalResults);
    }
  }, [searchRequestResponce.data]);
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error';
    content: string;
  }>({
    type: 'success',
    content: '',
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const [modalsState, setModalsState] = React.useState<{
    decline: boolean;
    ['show/confirm']: boolean;
  }>({
    decline: false,
    ['show/confirm']: false,
  });
  const [requestSelected, setRequestSelected] =
    React.useState<BookingRequest | null>(null);

  const [declineRequest, declineRequestResponce] = useMutation(
    DECLINE_BOOKING_REQUEST,
    {
      onCompleted: ({ bookingRequest }) => {
        const acutalizePendingRequests = requests.filter(
          (request) => request.id !== bookingRequest.id
        );
        setRequests(acutalizePendingRequests);
        setNotification({
          type: 'success',
          content: 'The request was declined successfully.',
        });
        cleanNotification();
      },
      onError: ({ message }) => {
        setNotification({
          type: 'error',
          content: message,
        });
        cleanNotification();
      },
    }
  );
  const [confirmBookingRequest, confirmBookingRequestResponce] = useMutation(
    CONFIRM_BOOKING_REQUEST,
    {
      onCompleted: ({ booking }) => {
        const acutalizePendingRequests = requests.filter(
          (request) => request.id !== booking.id
        );
        setModalsState({ ...modalsState, 'show/confirm': false });
        setRequests(acutalizePendingRequests);
        setNotification({
          type: 'success',
          content: 'The request has been booked successfully.',
        });
        cleanNotification();
      },
      onError: (graphqlError) => {
        setNotification({
          type: 'error',
          content: graphqlError.message,
        });
        cleanNotification();
      },
    }
  );

  const onDeclineRequest = async () => {
    if (requestSelected === null) return null;

    try {
      await declineRequest({
        variables: {
          bookingRequestId: requestSelected.id,
          userId: props.userId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  const onConfirmBooking = async (data: {
    totalCost: number;
    roomsIds: number[];
    paymentMethod: string;
  }) => {
    if (requestSelected === null) return null;
    const variables = {
      ...data,
      userId: props.userId,
      bookingRequestId: requestSelected.id,
    };
    try {
      await confirmBookingRequest({ variables });
    } catch (error) {
      console.log(error);
    }
  };
  const handleCloseModal = (modalName: string) => {
    setModalsState({ ...modalsState, [modalName]: false });
  };
  const handleOpenModal = (modalName: string) => {
    setModalsState({ ...modalsState, [modalName]: true });
  };
  const handleActions = (
    action: 'search' | 'pageChange' | 'show/confirm' | 'decline',
    data: any
  ) => {
    if (action === 'search') {
      const [field, value] = data;

      if (!value) {
        setPage(0);
        const actualizedQuery = {
          ...query,
        };
        delete actualizedQuery['search'];
        return setQuery(actualizedQuery);
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
    const requestId = data;
    const selected = requests.find((request) => request.id === requestId);

    if (!selected) return null;
    setRequestSelected(selected);
    handleOpenModal(action);
  };

  React.useEffect(() => {
    if (
      declineRequestResponce.loading ||
      confirmBookingRequestResponce.loading ||
      searchRequestResponce.loading
    ) {
      return setLoading(true);
    }
    return setLoading(false);
  }, [
    declineRequestResponce,
    searchRequestResponce,
    confirmBookingRequestResponce,
  ]);
  const cleanNotification = () => {
    setTimeout(() => {
      setNotification({
        type: 'success',
        content: '',
      });
    }, 6000);
  };

  return (
    <div>
      <Head>
        <title>Requests</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ maxWidth: 1200 }} component="main">
        <RequestsTable
          data={requests}
          handleActions={handleActions}
          totalResults={totalResults}
          currentPage={page}
        />

        {modalsState['show/confirm'] && requestSelected && (
          <ConfimBookingModal
            closeModal={() => handleCloseModal('show/confirm')}
            requestInfo={requestSelected}
            isModalOpen={modalsState['show/confirm']}
            onSubmit={onConfirmBooking}
          />
        )}
        <Dialog
          acceptLabel={'Procced'}
          rejectLabel={'Avort'}
          title={'Are you sure?'}
          text={
            'If procced the request will be no longer visible in the request queue.'
          }
          isDialogOpen={modalsState['decline']}
          onAccept={onDeclineRequest}
          onCancel={() => handleCloseModal('decline')}
        />
        <Backdrop loading={loading} />
        {notification.content && (
          <SnackBar
            severity={notification.type}
            message={notification.content || 'Oparation succesfully complited'}
          />
        )}
      </Box>
    </div>
  );
};
RoomRequests.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="requests">{page}</AdminMenu>;
};
export default RoomRequests;
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
        query: GET_HOTEL_BOOKING_REQUESTS,
        variables: { userId: user.id, hotelId: query.hotelId },
      });

      return {
        props: {
          hotelId: query.hotelId,
          userId: user.id,
          requests: data.results.requests,
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
