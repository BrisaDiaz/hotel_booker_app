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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  maxWidth: 500,
  width: '100%',
  minWidth: '360px',
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

const title = {
  textTransform: 'capitalize',
  mb: 2,
  align: 'center',
};

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

  const dataFormatter = (data: {
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
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-specifications"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={handleSubmit(dataFormatter)}
        >
          <CloseButton handleClose={handleClose} />
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={title}
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
