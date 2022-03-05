import * as React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import CloseButton from '@/components/modals/CloseButton';
import currencyFixer from '@/utils/currencyFixer';
import { styles } from './styles';
import { Booking } from '@/interfaces/index';
export default function BasicModal({
  isOpen,
  onSubmit,
  onClose,

  bookingData,
}: {
  isOpen: boolean;
  onSubmit: (formData: any) => void;
  onClose: () => void;

  bookingData: Booking | null;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), onClose();
  };
  const [cancellationFee, setCancellationFee] = React.useState<number>(
    bookingData ? bookingData?.roomModel?.cancellationFee : 0
  );

  React.useEffect(() => {
    if (isOpen) {
      return handleOpen();
    }
    return handleClose();
  }, [isOpen]);
  React.useEffect(() => {
    setCancellationFee(
      bookingData ? bookingData?.roomModel?.cancellationFee : 0
    );
  }, [bookingData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: {
    message: number[];
    cancellationFee: string;
  }) => {
    onSubmit({ ...data, cancellationFee: cancellationFee });
  };

  const handleCancellationFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return setCancellationFee(0);
    setCancellationFee(parseInt(e.target.value));
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
        <Box sx={styles.contentContainer}>
          <Typography variant="body2" sx={{ my: 1 }}>
            Write a message explaining the reason of the cancellation.
          </Typography>
          <TextField
            fullWidth
            id="message"
            multiline
            {...register('message', {
              required: 'A explanatory message is required',
              minLength: {
                value: 20,
                message: 'Message should be of a 20 characters length minimum.',
              },
              maxLength: {
                value: 300,
                message:
                  'Message should be of a 300 characters length maximum.',
              },
            })}
            rows={3}
            variant="outlined"
            sx={{ mb: 2 }}
            error={errors['message'] ? true : false}
            label={errors['message'] ? errors['message'].message : 'Message'}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Set the amount to charge
          </Typography>
          <TextField
            id="cancellationFee"
            sx={{
              maxWidth: 150,
              width: '100%',
              mb: 1,
            }}
            onChange={handleCancellationFee}
            defaultValue={cancellationFee}
            variant="outlined"
            label={
              errors['cancellationFee']
                ? errors['cancellationFee'].message
                : 'Cancellation Fee'
            }
            type="number"
            error={errors['cancellationFee'] ? true : false}
            InputProps={{
              inputProps: { min: 0 },
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <input
            type="hidden"
            value={cancellationFee}
            {...register('cancellationFee', {
              required: 'The cancellation fee is required',
              min: {
                value: 0,
                message: 'The cancellation fee must be a positive number',
              },
            })}
          />
          <Box component="ul" sx={{ mb: 2, px: 0 }}>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Current Const:</Typography>
              <Typography component="span">
                {currencyFixer(bookingData?.totalCost)}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Cost after charge:</Typography>
              <Typography component="span">
                {currencyFixer(bookingData?.totalCost + cancellationFee)}
              </Typography>
            </Box>
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
