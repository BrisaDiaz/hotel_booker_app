import * as React from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingRoomInputs from '@/components/modals/BookingRoomInputs';
import CloseButton from '@/components/modals/CloseButton';
import BookingClientInputs from '@/components/modals/BookingClientInputs';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { styles } from './styles';
import currencyFixer from '@/utils/currencyFixer'
export default function BasicModal({
  children,
  onSubmit,
  roomData,
}: {
  children: React.ReactNode;
  onSubmit: (formData:any)=>void;
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
    setValue,

    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string;
    guestsDistribution: Array<{ childrens: number; adults: number }>;
    checkInDate: string;
    checkOutDate: string;
    specifications?: string;
    requiredRooms?: number;
  }) => {
    handleClose();
    delete data['requiredRooms'];

    onSubmit(data);
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
          sx={styles.modal}
          component="form"
          noValidate
          onSubmit={handleSubmit(submitMiddleware)}
        >
          <CloseButton handleClose={handleClose} />
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={styles.title}
          >
            Ask for a reservation
          </Typography>
          <Box sx={styles.withIconLabel}>
            <MeetingRoomIcon />
            <Typography variant="subtitle1" component="h3">
              Room Details
            </Typography>
          </Box>
          <Box component="ul" sx={{ mb: 2, px: 0 }}>
            {' '}
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Price:</Typography>
              <Typography component="span">USD {currencyFixer(roomData?.price)}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Taxes and Charges: </Typography>
              <Typography component="span">USD {currencyFixer(roomData?.taxes)}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Maximun Guests:</Typography>
              <Typography component="span">
                {' '}
                {roomData?.maximunGuests}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Check In Hour:</Typography>
              <time>{roomData?.checkInHour}</time>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Check Out Hour:</Typography>
              <time>{roomData?.checkOutHour}</time>
            </Box>
          </Box>
          <BookingClientInputs errors={errors} register={register} />
          <Box sx={{ my: 2 }} />
          <BookingRoomInputs
            register={register}
            setError={setError}
            errors={errors}
            setValue={setValue}
          />
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
