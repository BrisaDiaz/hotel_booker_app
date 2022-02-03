import * as React from 'react';
import { useForm } from 'react-hook-form';
import { BookingRequest } from '@/interfaces/index';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import BookingRequestInfo from '@/components/modals/BookingRequestInfo';
import CloseButton from '@/components/modals/CloseButton';
import BookingAdminInputs from '@/components/modals/BookingAdminInputs';
import { styles } from './styles';

export default function BasicModal({
  isOpen,
  onSubmit,
  onClose,
  requestInfo,
}: {
  isOpen: boolean;
  onClose: ()=>void;
  requestInfo?: BookingRequest;
  onSubmit: (formData:any)=>void;
}) {



  const handleClose = () => {
 onClose();
  };


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
    const roomsRequired: number =requestInfo? requestInfo.guestsDistribution.length:1;

    if (data.roomsIds.length < roomsRequired)
      return setError('roomsIds', {
        message: `You need to select ${roomsRequired} ${
          roomsRequired > 1 ? 'rooms' : 'room'
        }`,
      });
    clearErrors('roomsIds');
    onSubmit({ ...data, totalCost: parseInt(data.totalCost) });
  };
    if (!requestInfo) return <div/>;
  return (
    <div>
      <Modal
        keepMounted
        open={isOpen}
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
          <BookingRequestInfo requestInfo={requestInfo} />
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
