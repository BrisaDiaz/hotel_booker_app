import Head from 'next/head';
import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/lib/apollo';
import { getUser } from '@/graphql/utils';
import {
  WithLayoutPage,
  Booking,
  BookingEvent,
  CancelationDetails,
} from '@/interfaces/index';
import Backdrop from '@/components/Backdrop';
import SnackBar from '@/components/SnackBar';
import Box from '@mui/material/Box';
import AdminMenu from '@/components/layouts/AdminMenu';
import {
  GET_BOOKING_BY_ID,
  GET_HOTEL_BOOKINGS,
  GET_HOTEL_ROOM_MODELS_LIST,
  CANCEL_BOOKING,
  GET_BOOKING_CANCELATION_DETAILS,
} from '@/queries/index';
import { useLazyQuery, useMutation } from '@apollo/client';
import { getFormattedBookings } from '@/utils/getFormattedBookings';
import BookingsCalendar from '@/components/dashboard/calendars/Bookings';
import BookingDetailsModal from '@/components/modals/BookingDetailsModal';
import CancelBookigModal from '@/components/modals/CancelBookigModal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
type PageProps = {
  hotelId: number;
  userId: number;
  bookings: Booking[];
  roomModels: { id: number; name: string }[];
};
const Bookings: WithLayoutPage<PageProps> = ({
  hotelId,
  userId,
  bookings,
  roomModels,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState<{
    show: boolean;
    cancel: boolean;
  }>({
    show: false,
    cancel: false,
  });
  const [loading, setLoading] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error';
    content: string;
  }>({
    type: 'success',
    content: '',
  });
  const clearNotification = () => {
    setTimeout(() => {
      setNotification({
        type: 'success',
        content: '',
      });
    }, 6000);
  };
  const [displayedBookings, setDisplayedBookings] =
    React.useState<Booking[]>(bookings);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const [cancelationDetails, setCancelationDetails] =
    React.useState<CancelationDetails | null>(null);
  const [bookingsStatus, setBookingsStatus] = React.useState('active');
  const [dateRanges, setDateRanges] = React.useState<
    { from: Date; until: Date } | {}
  >({});

  const closeModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: false });
  };
  const openModal = (modalName: string) => {
    setIsModalOpen({ ...isModalOpen, [modalName]: true });
  };
  const [getBookingById, bookingDataRequest] = useLazyQuery(GET_BOOKING_BY_ID);
  const [getBookings, bookingsRequest] = useLazyQuery(GET_HOTEL_BOOKINGS);
  const [getCancelationDetails, cancelationDetailsRequest] = useLazyQuery(
    GET_BOOKING_CANCELATION_DETAILS
  );

  const [cancelBooking, cancelBookingRequest] = useMutation(CANCEL_BOOKING, {
    onCompleted({ cancelationDetails }) {
      setNotification({
        type: 'success',
        content: 'Booking was canceled successfully',
      });
      clearNotification();
      setBookingsStatus('CANCELED');
      closeModal('cancel');
      closeModal('show');
    },
    onError({ message }) {
      setNotification({
        type: 'success',
        content: `Booking couldn't be canceled, Error: ${message}`,
      });
      clearNotification();
    },
  });
  const handleGetBookings = async () => {
    if (dateRanges) {
      const variables: { [key: string]: number | string | Date } = {
        userId,
        hotelId,
        ...dateRanges,
      };
      if (bookingsStatus !== 'all') {
        variables['status'] = bookingsStatus;
      }

      try {
        await getBookings({ variables });
      } catch (err) {
        console.log(err);
      }
    }
  };

  React.useEffect(() => {
    if (bookingsRequest.data?.bookings) {
      setDisplayedBookings(bookingsRequest.data?.bookings);
    }
  }, [bookingsRequest]);

  React.useEffect(() => {
    if (cancelationDetailsRequest.data?.cancelationDetails) {
      setCancelationDetails(cancelationDetailsRequest.data.cancelationDetails);
    }
    if (bookingDataRequest.data?.booking) {
      setSelectedBooking(bookingDataRequest.data.booking);
      openModal('show');
    }
  }, [bookingDataRequest, cancelationDetails]);

  React.useEffect(() => {
    handleGetBookings();
  }, [bookingsStatus, dateRanges]);
  React.useEffect(() => {
    if (
      bookingDataRequest.loading ||
      bookingsRequest.loading ||
      cancelBookingRequest.loading ||
      cancelationDetailsRequest.loading
    ) {
      return setLoading(true);
    }
    setLoading(false);
  }, [
    bookingDataRequest.loading,
    bookingsRequest.loading,
    cancelBookingRequest.loading,
    cancelationDetailsRequest.loading,
  ]);

  const handleBookingSelect = async (bookingEvent: BookingEvent) => {
    // bookingEvent.id = bookingId+roomId//
    const bookingId = parseInt(bookingEvent.id.split('+')[0]);
    try {
      setCancelationDetails(null);
      if (bookingEvent.status === 'CANCELED') {
        await Promise.all([
          getBookingById({
            variables: {
              bookingId,
              userId,
            },
          }),
          getCancelationDetails({
            variables: {
              bookingId,
            },
          }),
        ]);
        return;
      }

      await getBookingById({
        variables: {
          bookingId,
          userId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setBookingsStatus(event.target.value);
  };
  const handleRangeChanges = (range: { start: Date; end: Date }) => {
    setDateRanges({
      from: range.start,
      until: range.end,
    });
  };
  const onCancelBooking = async (data: {
    message: string;
    cancelationFee: number;
  }) => {
    if (!selectedBooking) return;
    try {
      let variables = { ...data, userId, bookingId: selectedBooking.id };
      await cancelBooking({ variables });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Head>
        <title>Bookings</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ m: 1, mt: 3, width: 150 }}>
          <InputLabel id="demo-simple-select-autowidth-label">
            Booking Status
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={bookingsStatus}
            onChange={handleStatusChange}
            label="Booking Status"
            size="small"
            sx={{
              '&  div  ': { display: 'flex !important', alignItems: 'center' },
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">
              <Box
                sx={{
                  height: 14,
                  width: 14,
                  mr: 0.5,
                  backgroundColor: '#1e88e5',
                }}
              />
              Active
            </MenuItem>
            <MenuItem value="finished">
              {' '}
              <Box
                sx={{
                  height: 14,
                  width: 14,
                  mr: 0.5,
                  backgroundColor: '#43a047',
                }}
              />
              Finished
            </MenuItem>
            <MenuItem value="canceled">
              {' '}
              <Box
                sx={{
                  height: 14,
                  width: 14,
                  mr: 0.5,
                  backgroundColor: '#e53935',
                }}
              />
              Canceled
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ maxWidth: 1200, mt: 1 }} component="main">
        <BookingsCalendar
          data={getFormattedBookings(displayedBookings, roomModels)}
          onSelect={handleBookingSelect}
          onRangeChange={handleRangeChanges}
        />

        <BookingDetailsModal
          bookingData={selectedBooking}
          isModalOpen={isModalOpen.show}
          closeModal={() => closeModal('show')}
          onCancel={() => openModal('cancel')}
          cancelationDetails={cancelationDetails}
        />
      </Box>
      <CancelBookigModal
        isModalOpen={isModalOpen.cancel}
        onSubmit={onCancelBooking}
        bookingData={selectedBooking}
        closeModal={() => closeModal('cancel')}
      />
      <Backdrop loading={loading} />
      {notification.content && (
        <SnackBar severity={notification.type} message={notification.content} />
      )}
    </div>
  );
};
Bookings.getLayout = function getLayout(pbookingsStatus: React.ReactNode) {
  return <AdminMenu activeLink="bookings">{pbookingsStatus}</AdminMenu>;
};

export default Bookings;
type PbookingsStatusContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  query: {
    hotelId: number;
  };
};
export const getServerSideProps = async ({
  req,
  res,
  query,
}: PbookingsStatusContext) => {
  try {
    const user = await getUser(req, res);

    if (user.role === 'ADMIN') {
      const bookingResponce = await client.query({
        query: GET_HOTEL_BOOKINGS,
        variables: {
          userId: user.id,
          hotelId: query.hotelId,
        },
      });
      const RoomModelsResponce = await client.query({
        query: GET_HOTEL_ROOM_MODELS_LIST,
        variables: {
          hotelId: query.hotelId,
        },
      });

      return {
        props: {
          hotelId: query.hotelId,
          userId: user.id,

          bookings: bookingResponce.data.bookings,
          roomModels: RoomModelsResponce.data.hotel.roomModels,
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
