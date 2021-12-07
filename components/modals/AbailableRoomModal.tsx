import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingRoomInputs from './BookingRoomInputs';
import CloseButton from '@/components/modals/CloseButton';
import useBookingInputsController from '../../hooks/useBookingInputsController';
import { useForm } from 'react-hook-form';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 360,
  maxWidth: 420,
  width: '100%',
  bgcolor: 'background.paper',
  border: '1px solid rgba(244,244,244,1)',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  px: 3.5,
};

const title = {
  textTransform: 'capitalize',
  mb: 2,
  align: 'center',
};

export default function TransitionsModal({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: Function;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const {
    handleBookingData,
    handleDeleteRoom,
    handdleAddRoom,
    handleRoomChanges,
    rooms,
    minDate,
  } = useBookingInputsController({ setError });
  const submitHandler = (data: any) => {
    const formattedData = handleBookingData(data);
    if (!formattedData) return null;

    onSubmit(formattedData);
    handleClose();
  };
  const inputsProps = {
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
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CloseButton handleClose={handleClose} />

            <form onSubmit={handleSubmit(submitHandler)}>
              <Typography variant="h5" component="h2" sx={title}>
                check Room abailability
              </Typography>
              <BookingRoomInputs {...inputsProps} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, p: 1.5, width: '100%' }}
                >
                  send
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
