import * as React from 'react';
import { useForm } from 'react-hook-form';
import { BookingRequest } from '@/interfaces/index';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingRequesInfo from '@/components/modals/BookingRequesInfo';
import CloseButton from '@/components/modals/CloseButton';
import BookingAdminInputs from '@/components/modals/BookingAdminInputs';
import { styles } from './styles';

export default function BasicModal({
  isModalOpen,
  onSubmit,
  closeModal,
  requestInfo,
}: {
  isModalOpen: boolean;
  onSubmit: Function;
  closeModal: Function;
  requestInfo?: BookingRequest;
}) {
  if (!requestInfo) return null;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };
  React.useEffect(() => {
    if (isModalOpen && requestInfo) {
      return handleOpen();
    }
    return handleClose();
  }, [isModalOpen, requestInfo]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: {
    roomsIds: number[];
    totalCost: string;
    paymentMethod: string;
  }) => {
    const roomsRequired: number = requestInfo.guestsDistribution.length;

    if (data.roomsIds.length < roomsRequired)
      return setError('roomsIds', {
        message: `You need to select ${roomsRequired} ${
          roomsRequired > 1 ? 'rooms' : 'room'
        }`,
      });
    clearErrors('roomsIds');
    onSubmit({ ...data, totalCost: parseInt(data.totalCost) });
  };

  return (
    <div>
      <Modal
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
            Confirm Reservation
          </Typography>
          <BookingRequesInfo requestInfo={requestInfo} />
          <Box sx={{ my: 2 }} />
          <BookingAdminInputs
            errors={errors}
            register={register}
            setValue={setValue}
            requiredRooms={requestInfo?.guestsDistribution?.length}
            availableRooms={requestInfo?.availableRooms}
          />

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
    </div>
  );
}
