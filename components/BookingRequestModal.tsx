import * as React from 'react';
import { useForm } from 'react-hook-form';
import useBookingInputsController from '@/hooks/useBookingInputsController';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BookingRoomInputs from '@/components/BookingRoomInputs';
import CancelIcon from '@mui/icons-material/Cancel';
import BookingClientInputs from '@/components/BookingClientInputs';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minwidth: 360,
  maxWidth: 500,
  width: '100%',
  bgcolor: 'background.paper',
  border: '1px solid rgba(244,244,244,1)',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  px: 3.5,
  maxHeight: '90%',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};
const withIconLabel = {
  marginBottom: '10px',
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
};
const title = {
  textTransform: 'capitalize',
  mb: 2,
  align: 'center',
};
const list = {
  display: 'flex',
  '& p': { width: '70%', color: 'text.secondary', fontStyle: 'oblique' },
  mb: 1,
  ml: 1,
};
export default function BasicModal({
  children,
  onSubmit,
  roomData,
}: {
  children: React.ReactNode;
  onSubmit: Function;
  roomData: {
    price: number;
    taxes: number;
    maximunGuests: number;
    checkInHour: string;
    checkOutHour: string;
  };
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const dataFormatter = (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string;
    guestsDistribution: Array<{ childrens: number; adults: number }>;
    checkInDate: string;
    checkOutDate: string;
    specifications?: string;
  }) => {
    const technicalSpecificatons = handleBookingData(data);

    const formVariables = {
      ...technicalSpecificatons,
      ...data,
    };
    handleClose();
    onSubmit(formVariables);
  };
  const {
    handleBookingData,
    handleDeleteRoom,
    handdleAddRoom,
    handleRoomChanges,
    rooms,
    minDate,
  } = useBookingInputsController({ setError });
  const bookingInputsProps = {
    handleDeleteRoom,
    handdleAddRoom,
    handleRoomChanges,
    rooms,
    minDate,
    register,
    setError,
    errors,
  };
  return (
    <div>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-specifications"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={handleSubmit(dataFormatter)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              sx={{ margin: '-25px -10px -10px 0' }}
              aria-label="delete"
              color="secondary"
              onClick={handleClose}
            >
              <CancelIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={title}
          >
            Ask for a reservation
          </Typography>
          <Box sx={withIconLabel}>
            <MeetingRoomIcon />
            <Typography variant="subtitle1" component="h3">
              Room Details
            </Typography>
          </Box>
          <Box component="ul" sx={{ mb: 2, px: 0 }}>
            {' '}
            <Box component="li" sx={list}>
              <Typography>Price:</Typography>
              <Typography component="span">USD ${roomData?.price}</Typography>
            </Box>
            <Box component="li" sx={list}>
              <Typography>Taxes and Charges: </Typography>
              <Typography component="span">USD ${roomData?.taxes}</Typography>
            </Box>
            <Box component="li" sx={list}>
              <Typography>Maximun Guests:</Typography>
              <Typography component="span">
                {' '}
                {roomData?.maximunGuests}
              </Typography>
            </Box>
            <Box component="li" sx={list}>
              <Typography>Check In Hour:</Typography>
              <time>{roomData?.checkInHour}</time>
            </Box>
            <Box component="li" sx={list}>
              <Typography>Check Out Hour:</Typography>
              <time>{roomData?.checkOutHour}</time>
            </Box>
          </Box>
          <BookingClientInputs errors={errors} register={register} />
          <Box sx={{ my: 2 }} />
          <BookingRoomInputs {...bookingInputsProps} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, p: 1.5, width: '100%' }}
          >
            Send
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
