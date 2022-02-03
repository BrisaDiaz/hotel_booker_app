import * as React from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import ListAltIcon from '@mui/icons-material/ListAlt';
import CloseButton from '@/components/modals/CloseButton';
import { toDateAndHourFormat } from '@/utils/index';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Booking, CancellationDetails } from '@/interfaces/index';
import { styles } from './styles';
import currencyFixer from '@/utils/currencyFixer';
export default function BasicModal({
  bookingData,
  isOpen,
  onClose,
  onCancel,
  cancellationDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  bookingData: Booking | null;
  cancellationDetails?: CancellationDetails | null;
}) {
  const handleClose = () => {
    onClose();
  };

  if (
    !bookingData ||
    (bookingData.status === 'CANCELED' && !cancellationDetails)
  )
    return <div />;
  return (
    <div>
      <Modal
        keepMounted
        open={isOpen}
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
              <Typography sx={styles.legend}>Booking ID:</Typography>
              <Typography component="span">{bookingData?.id}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Guest ID:</Typography>
              <Typography component="span">{bookingData?.clientId}</Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Room Type:</Typography>
              <Typography component="span">
                {bookingData?.roomModel?.name}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Check In Date:</Typography>
              <time>
                {toDateAndHourFormat(parseInt(bookingData?.checkInDate))}
              </time>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Check Out Date:</Typography>
              <time>
                {toDateAndHourFormat(parseInt(bookingData?.checkOutDate))}
              </time>
            </Box>

            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Guest/Room: </Typography>
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
              <Typography sx={styles.legend}>Staying Rooms:</Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px' }}>
                {bookingData?.reservedRooms?.map((room) => (
                  <Typography sx={{ fontSize: '14px' }} key={room?.number}>
                    {room?.number}{' '}
                  </Typography>
                ))}
              </Stack>
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
              <Typography sx={styles.legend}>
                {bookingData?.status === 'CANCELED' ? 'Cost:' : 'Total Cost:'}
              </Typography>
              <Typography component="span">
                USD {currencyFixer(bookingData?.totalCost)}
              </Typography>
            </Box>
            <Box component="li" sx={styles.list}>
              <Typography sx={styles.legend}>Payment Method: </Typography>
              <Typography component="span">
                {bookingData?.paymentMethod.split('_').join(' ').toLowerCase()}
              </Typography>
            </Box>
            {bookingData?.status === 'CANCELED' && cancellationDetails && (
              <>
                <Box sx={styles.withIconLabel}>
                  <DoNotDisturbIcon />
                  <Typography component="h3">Cancellation Details</Typography>
                </Box>
                <Box sx={{ my: 1.5, ml: 1 }}>
                  <Typography sx={styles.legend}>Message:</Typography>
                  <Typography variant="body2" sx={{ mt: 1.5 }}>
                    {cancellationDetails?.message}
                  </Typography>
                </Box>

                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.legend}>Cancellation Date:</Typography>
                  <time>
                    {toDateAndHourFormat(
                      parseInt(cancellationDetails?.createdAt)
                    )}
                  </time>
                </Box>

                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.legend}>cancellation Fee</Typography>
                  <Typography component="span">
                    USD {currencyFixer(cancellationDetails.cancellationFee)}
                  </Typography>
                </Box>
                <Box component="li" sx={styles.list}>
                  <Typography sx={styles.legend}>Total Const</Typography>
                  <Typography component="span">
                    USD
                    {currencyFixer(
                      bookingData?.totalCost +
                        cancellationDetails?.cancellationFee
                    )}
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
                  sx={{ textTransform: 'capitalize' }}
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
