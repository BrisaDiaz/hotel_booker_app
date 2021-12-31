import * as React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import CloseButton from '@/components/modals/CloseButton';

import BookingAdminInputs from '@/components/modals/BookingAdminInputs';
import BookingClientInputs from '@/components/modals/BookingClientInputs';
import BookingRoomInputs from '@/components/modals/BookingRoomInputs';
import Steps from '@/components/Steps';
import { getFormatedDate } from '@/utils/ToYearMounthDayFormat';
import { styles } from './styles';

export default function BasicModal({
  isModalOpen,
  onSubmit,
  closeModal,
  availableRooms,
  getAvailableRooms,
  roomTypeId,
}: {
  isModalOpen: boolean;
  onSubmit: Function;
  closeModal: Function;
  getAvailableRooms: Function;
  availableRooms: { id: string; number: number }[] | [];
  roomTypeId?: number | null;
}) {
  if (!roomTypeId || !isModalOpen) return <div />;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };

  const [searchRoomsVariables, setSearchRoomVariables] = React.useState<{
    roomModelId: number;
    checkInDate: string;
    checkOutDate: string;
    rooms: { adults: number; children: number }[];
  }>({
    roomModelId: roomTypeId,
    checkInDate: getFormatedDate(new Date(Date.now()).getTime()),
    checkOutDate: getFormatedDate(+1000 * 60 * 60 * 24),
    rooms: [{ adults: 1, children: 0 }],
  });

  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
    return handleClose();
  }, [isModalOpen]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({ mode: 'onBlur' });
  const [activeStep, setActiveStep] = React.useState(0);

  const handleSearchAvailableRooms = (data: any) => {
    setSearchRoomVariables({
      ...searchRoomsVariables,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      rooms: data.guestsDistribution,
    });
  };
  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  React.useEffect(() => {
    if (roomTypeId)
      return getAvailableRooms({
        ...searchRoomsVariables,
        roomModelId: roomTypeId,
      });
  }, [searchRoomsVariables, roomTypeId]);

  const handleCreateBooking = (data: any) => {
    //// default room quantity === 1
    const quantityOfRoomsRequired = searchRoomsVariables.rooms.length;
    if (data.roomsIds.length < quantityOfRoomsRequired) {
      setError('roomsIds', {
        message: `You need to select ${quantityOfRoomsRequired} ${
          quantityOfRoomsRequired > 1 ? 'rooms' : 'room'
        }`,
      });
      return;
    }
    clearErrors('roomsIds');
    const variables = {
      ...data,
      checkInDate: searchRoomsVariables.checkInDate,
      checkOutDate: searchRoomsVariables.checkOutDate,
      guestsDistribution: searchRoomsVariables.rooms,
      totalCost: parseInt(data.totalCost),
    };
    onSubmit(variables);
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
          onSubmit={handleSubmit((data) =>
            activeStep === 0
              ? handleSearchAvailableRooms(data)
              : handleCreateBooking(data)
          )}
        >
          <CloseButton handleClose={handleClose} />
          <Typography
            id="modal-modal-{styles.title}"
            variant="h5"
            component="h2"
            sx={styles.title}
          >
            Add Booking
          </Typography>
          <Steps
            steps={['Search availables rooms.', 'Add bookings details.']}
            activeStep={activeStep}
            setStep={handleStepChange}
          />
          {activeStep === 0 && (
            <Box component="section" sx={{ mt: 4 }}>
              <BookingRoomInputs
                register={register}
                setError={setError}
                errors={errors}
                setValue={setValue}
                defaultValues={searchRoomsVariables}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, p: 1.5, width: '100%' }}
              >
                Search
              </Button>
            </Box>
          )}

          {activeStep === 1 && (
            <Box component="section" sx={{ mt: 4 }}>
              <Box sx={{ my: 2 }} />
              <BookingClientInputs errors={errors} register={register} />
              <Box sx={{ my: 2 }} />

              <BookingAdminInputs
                errors={errors}
                register={register}
                setValue={setValue}
                requiredRooms={searchRoomsVariables.rooms.length}
                availableRooms={availableRooms}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, p: 1.5, width: '100%' }}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </div>
  );
}
