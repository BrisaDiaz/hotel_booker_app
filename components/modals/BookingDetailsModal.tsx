import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseButton from '@/components/modals/CloseButton';
import { toDateAndHourFormat } from '@/utils/index';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Booking, CancelationDetails } from '@/interfaces/index';
import { styles } from './styles';

export default function BasicModal({
  bookingData,
  isModalOpen,
  closeModal,
  onCancel,
  cancelationDetails,
}: {
  isModalOpen: Boolean;
  closeModal: Function;
  onCancel: Function;
  bookingData: Booking | null;
  cancelationDetails?: CancelationDetails | null;
}) {
  if (
    !bookingData ||
    (bookingData.status === 'CANCELED' && !cancelationDetails)
  )
    return <div />;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    closeModal();
  };
  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
    handleClose();
  }, [isModalOpen]);

  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-specifications"
      >
        <Box sx={styles.modal}>
          <CloseButton handleClose={handleClose} />
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={styles.title}
          >
            Booking Details
          </Typography>
          <Box sx={styles.withIconLabel}>
            <MeetingRoomIcon />
            <Typography component="h3">Rooms/Staying</Typography>
          </Box>
          <Box component="ul" sx={{ mb: 2, px: 0 }}>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Booking ID:</Typography>
              <Typography component="span">{bookingData?.id}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Guest ID:</Typography>
              <Typography component="span">{bookingData?.clientId}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Room Type:</Typography>
              <Typography component="span">
                {bookingData?.roomModel?.name}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Room Numbers:</Typography>
              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', gap: '6px', py: 1 }}
              >
                {bookingData?.reservedRooms?.map((room) => (
                  <Chip label={room?.number} key={room?.number} />
                ))}
              </Stack>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Guest/Room: </Typography>
              <Box sx={{ p: 0, gap: 1, display: 'grid' }}>
                {bookingData?.guestsDistribution?.map((room, index) => (
                  <Box key={index} sx={styles.roomGuests}>
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 'max-content' }}
                    >
                      Adults: {room?.adults}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ minWidth: 'max-content' }}
                    >
                      Children: {room.children}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Check In Date:</Typography>
              <time>
                {toDateAndHourFormat(parseInt(bookingData?.checkInDate))}
              </time>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Check Out Date:</Typography>
              <time>
                {toDateAndHourFormat(parseInt(bookingData?.checkOutDate))}
              </time>
            </Box>
            <Box sx={styles.withIconLabel}>
              <ListAltIcon />
              <Typography component="h3">Special requests</Typography>
            </Box>
            <Typography sx={{ m: 1, mt: 0, fontSize: '14px' }}>
              {bookingData?.specifications || 'No special requests.'}
            </Typography>
            <Box sx={styles.withIconLabel}>
              <AccountBalanceWalletIcon />
              <Typography component="h3">Payment</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>
                {bookingData?.status === 'CANCELED' ? 'Cost:' : 'Total Cost:'}
              </Typography>
              <Typography component="span">
                USD ${bookingData?.totalCost}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.leyend}>Payment Method: </Typography>
              <Typography component="span">
                {bookingData?.paymentMethod.split('_').join(' ').toLowerCase()}
              </Typography>
            </Box>
            {cancelationDetails && (
              <>
                <Box sx={styles.withIconLabel}>
                  <DoNotDisturbIcon />
                  <Typography component="h3">Cancelation Details</Typography>
                </Box>
                <Box sx={{ my: 1.5, ml: 1 }}>
                  <Typography sx={styles.leyend}>Message:</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5 }}>
                    {cancelationDetails?.message}
                  </Typography>
                </Box>

                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.leyend}>Cancelation Date:</Typography>
                  <time>
                    {toDateAndHourFormat(
                      parseInt(cancelationDetails?.createdAt)
                    )}
                  </time>
                </Box>

                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.leyend}>cancelation Fee</Typography>
                  <Typography component="span">
                    USD ${cancelationDetails.cancelationFee}
                  </Typography>
                </Box>
                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.leyend}>Total Const</Typography>
                  <Typography component="span">
                    USD $
                    {bookingData?.totalCost +
                      cancelationDetails?.cancelationFee}
                  </Typography>
                </Box>
              </>
            )}
            {bookingData?.status === 'ACTIVE' && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => onCancel()}
                >
                  Cancel Booking
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
