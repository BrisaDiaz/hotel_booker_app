import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingRoomInputs from './BookingRoomInputs';
import CloseButton from '@/components/modals/CloseButton';
import { styles } from './styles';
import { useForm } from 'react-hook-form';

export default function TransitionsModal({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (formData: any) => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submitHandler = (data: any) => {
    onSubmit(data);
    handleClose();
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
          <Box sx={styles.modal}>
            <CloseButton handleClose={handleClose} />

            <form onSubmit={handleSubmit(submitHandler)}>
              <Typography variant="h5" component="h2" sx={styles.title}>
                check Room availability
              </Typography>
              <BookingRoomInputs
                register={register}
                setError={setError}
                errors={errors}
                setValue={setValue}
              />
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
