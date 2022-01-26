import Head from 'next/head';
import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/lib/apollo';
import { getCookie } from '@/graphql/utils';
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
import {getMounthDateRanges} from '@/utils/getMounthDateRanges'
import useNotification from '@/hooks/useNotification'
type PageProps = {
  hotelId: number;
  token: number;
  roomModels: { id: number; name: string }[];
};
const Bookings: WithLayoutPage<PageProps> = ({
  hotelId,
  token,
  roomModels,
}) => {
  const [isOpen, setIsModalOpen] = React.useState<{
    show: boolean;
    cancel: boolean;
  }>({
    show: false,
    cancel: false,
  });
  const [loading, setLoading] = React.useState(false);
    const { notification,notify} = useNotification({autoClean:true})


  const [displayedBookings, setDisplayedBookings] =
    React.useState<Booking[]>([]);
 
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );

  const [cancelationDetails, setCancelationDetails] =
    React.useState<CancelationDetails | null>(null);
  const [bookingsStatus, setBookingsStatus] = React.useState('all');
   const [firstDayOfMonth,lastDayOfMonth ] =getMounthDateRanges()
   
  const [dateRanges, setDateRanges] = React.useState<
    { from: Date; until: Date } 
  >(  { from: firstDayOfMonth, until: lastDayOfMonth } );

  const closeModal = (modalName: string) => {
    setIsModalOpen({ ...isOpen, [modalName]: false });
  };
  const openModal = (modalName: string) => {
    setIsModalOpen({ ...isOpen, [modalName]: true });
  };
  const [getBookingById, bookingDataRequest] = useLazyQuery(GET_BOOKING_BY_ID);
  const [getBookings, bookingsRequest] = useLazyQuery(GET_HOTEL_BOOKINGS, {
   fetchPolicy: 'network-only',
  });
  const [getCancelationDetails, cancelationDetailsRequest] = useLazyQuery(
    GET_BOOKING_CANCELATION_DETAILS,{  fetchPolicy: 'network-only',}
  );

  const [cancelBooking, cancelBookingRequest] = useMutation(CANCEL_BOOKING, {
    onCompleted() {
      notify({
        type: 'success',
        content: 'Booking was canceled successfully',
      });
      
      setBookingsStatus('CANCELED');
      closeModal('cancel');
      closeModal('show');
    },
    onError({ message }) {
      notify({
        type: 'success',
        content: `Booking couldn't be canceled, Error: ${message}`,
      });

    },
  });

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
  }, [bookingDataRequest, cancelationDetailsRequest]);
      const handleGetBookings = async () => {
    if (dateRanges) {
      const variables: { [key: string]: number | string | Date } = {
        token,
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
      setCancelationDetails(null)
      if (bookingEvent.status === 'CANCELED') {
        await Promise.all([
          getBookingById({
            variables: {
              bookingId,
              token,
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
          token,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setBookingsStatus(event.target.value);
  }
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
      const variables = { ...data, token, bookingId: selectedBooking.id };
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
          isOpen={isOpen.show}
          onClose={() => closeModal('show')}
          onCancel={() => openModal('cancel')}
          cancelationDetails={cancelationDetails}
        />
      </Box>
      <CancelBookigModal
        isOpen={isOpen.cancel}
        onSubmit={onCancelBooking}
        bookingData={selectedBooking}
        onClose={() => closeModal('cancel')}
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
    const token = getCookie(req, res);


  
      const RoomModelsResponce = await client.query({
        query: GET_HOTEL_ROOM_MODELS_LIST,
        variables: {
          hotelId: query.hotelId,
        },
      });

      return {
        props: {
          hotelId: query.hotelId,
          token: token,

          roomModels: RoomModelsResponce.data.hotel.roomModels,
        },
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
