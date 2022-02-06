import React from 'react';
import Box from '@mui/material/Box';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Typography from '@mui/material/Typography';
import toDateAndHourFormat from '@/utils/toDateAndHourFormat';
import { BookingRequest } from '@/interfaces/index';
import { styles } from './styles';
import currencyFixer from '@/utils/currencyFixer';
export default function RequestInfo({
  requestInfo,
}: {
  requestInfo?: BookingRequest;
}) {
  if (!requestInfo) return null;
  return (
    <div>
      <Box sx={styles.withIconLabel}>
        <MeetingRoomIcon />
        <Typography component="h3">Room/Staying</Typography>
      </Box>
      <Box component="ul" sx={{ mb: 2, px: 0 }}>
        {' '}
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend} title={requestInfo?.roomModel?.name}>
            Room Type:
          </Typography>
          <Typography component="span">
            {requestInfo?.roomModel?.name}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Price:</Typography>
          <Typography component="span">
            {' '}
            USD {currencyFixer(requestInfo?.roomModel?.lowestPrice)}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Taxes:</Typography>
          <Typography component="span">
            {' '}
            USD {currencyFixer(requestInfo?.roomModel?.taxesAndCharges)}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Check In Date:</Typography>
          <time>{toDateAndHourFormat(parseInt(requestInfo?.checkInDate))}</time>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Check Out Date:</Typography>
          <time>
            {toDateAndHourFormat(parseInt(requestInfo?.checkOutDate))}
          </time>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Nights:</Typography>
          <Typography component="span"> {requestInfo?.nights}</Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Quantity: </Typography>
          <Typography component="span">
            {requestInfo?.guestsDistribution?.length}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Guest/Room: </Typography>
          <Box sx={{ display: 'grid' }}>
            {requestInfo?.guestsDistribution?.map((room, index) => (
              <Box key={index} sx={styles.roomGuests}>
                <Typography variant="body2" sx={{ minWidth: 'max-content' }}>
                  Adults: {room.adults}
                </Typography>
                <Typography variant="body2" sx={{ minWidth: 'max-content' }}>
                  Children: {room.children}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={styles.withIconLabel}>
        <PermContactCalendarIcon />
        <Typography component="h3">Prospect Information</Typography>
      </Box>
      <Box component="ul" sx={{ mb: 2, px: 0 }}>
        {' '}
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Name:</Typography>
          <Typography
            component="span"
            title={
              requestInfo?.client?.firstName +
              ' ' +
              requestInfo?.client?.lastName
            }
          >
            {requestInfo?.client?.firstName} {requestInfo?.client?.lastName}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Mobile:</Typography>
          <Typography component="span">
            {' '}
            {requestInfo?.client?.mobileNumber}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list}>
          <Typography sx={styles.legend}>Landline:</Typography>
          <Typography component="span">
            {' '}
            {requestInfo?.client?.landlineNumber}
          </Typography>
        </Box>
        <Box component="li" sx={styles.list} title={requestInfo?.client?.email}>
          <Typography sx={styles.legend}>Email: </Typography>
          <Typography
            component="span"
            sx={{ textTransform: 'none', fontSize: '14px' }}
          >
            {requestInfo?.client?.email}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.withIconLabel}>
        <ListAltIcon />
        <Typography component="h3">Special requests</Typography>
      </Box>
      <Typography sx={{ mx: 1, fontSize: '14px' }}>
        {requestInfo.specifications || 'No special requests.'}
      </Typography>
    </div>
  );
}
