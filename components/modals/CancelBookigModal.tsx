import * as React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import CloseButton from '@/components/modals/CloseButton';

import { styles } from './styles';
import { Booking } from '@/interfaces/index';
export default function BasicModal({
  isModalOpen,
  onSubmit,
  closeModal,

  bookingData,
}: {
  isModalOpen: boolean;
  onSubmit: (formData:any)=>void;
  closeModal: ()=>void;

  bookingData: Booking | null;
}) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };
  const [cancelationFee, setCancelationFee] = React.useState<number>(
    bookingData ? bookingData?.roomModel?.cancelationFee : 0
  );
  
  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
    return handleClose();
  }, [isModalOpen]);
    React.useEffect(() => {
    setCancelationFee(bookingData ? bookingData?.roomModel?.cancelationFee : 0);
  }, [bookingData]);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: {
    message: number[];
    cancelationFee: string;
  }) => {
    onSubmit({ ...data, cancelationFee: cancelationFee });
  };

  const handleCancelationFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return setCancelationFee(0);
    setCancelationFee(parseInt(e.target.value));
  };

 if (!bookingData) return <div />;
  return (
    <Modal
      sx={{ zIndex: 2000 }}
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-{styles.title}"
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
          id="modal-modal-{styles.title}"
          variant="h5"
          component="h2"
          sx={styles.title}
        >
          Cancel Reservation
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Write a message explaining the reason of the cancelation.
        </Typography>
        <TextField
          fullWidth
          id="message"
          multiline
          {...register('message', {
            required: 'A explenatory message is required',
            minLength: {
              value: 20,
              message: 'Message should be of a 20 characters length minimun.',
            },
            maxLength: {
              value: 300,
              message: 'Message should be of a 300 characters length maximun.',
            },
          })}
          rows={5}
          variant="outlined"
          sx={{ mb: 2 }}
          error={errors['message'] ? true : false}
          label={errors['message'] ? errors['message'].message : 'Message'}
        />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Set the ammount to charge
        </Typography>
        <TextField
          id="cancelationFee"
          sx={{
            maxWidth: 150,
            width: '100%',
            mb: 1,
          }}
          onChange={handleCancelationFee}
          defaultValue={cancelationFee}
          variant="outlined"
          label={
            errors['cancelationFee']
              ? errors['cancelationFee'].message
              : 'Cancelation Fee'
          }
          type="number"
          error={errors['cancelationFee'] ? true : false}
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        <input
          type="hidden"
          value={cancelationFee}
          {...register('cancelationFee', {
            required: 'The cancelation fee is required',
            min: {
              value: 0,
              message: 'The cancelation fee must be a positive number',
            },
          })}
        />
        <Box component="ul" sx={{ mb: 2, px: 0 }}>
          <Box component="li" sx={styles.list}>
            <Typography sx={styles.leyend}>Current Const:</Typography>
            <Typography component="span">
              USD ${bookingData?.totalCost}
            </Typography>
          </Box>
          <Box component="li" sx={styles.list}>
            <Typography sx={styles.leyend}>Cost after charge:</Typography>
            <Typography component="span">
              USD ${bookingData?.totalCost + cancelationFee}
            </Typography>
          </Box>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, p: 1.5, width: '100%' }}
        >
          Confirm
        </Button>
      </Box>
    </Modal>
  );
}
