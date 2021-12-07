import React from 'react';
import Box from '@mui/material/Box';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Typography from '@mui/material/Typography';
import { getFormatedDate } from '@/utils/index';
import { BookingRequest } from '@/interfaces/index';
const withIconLabel = {
  marginBottom: '10px',
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
  '& > *': {
    color: 'primary.main',
  },
};

const list = {
  display: 'flex',
  textTransform: 'capitalize',
  flexWrap: 'wrap',
  mb: 1,
  ml: 1,

  '& p': {
    fontSize: '14px',
  },
  '& span': {
    fontSize: '14px',
  },
  '& time': {
    fontSize: '14px',
  },
};
const leyend = {
  width: { xs: '50%', sm: '45%' },
  color: 'text.secondary',
  fontStyle: 'oblique',
};

export default function RequestInfo({
  requestInfo,
}: {
  requestInfo: BookingRequest;
}) {
  return (
    <div>
      <Box sx={withIconLabel}>
        <MeetingRoomIcon />
        <Typography variant="subtitle1" component="h3">
          Room Details
        </Typography>
      </Box>
      <Box component="ul" sx={{ mb: 2, px: 0 }}>
        {' '}
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Room Type:</Typography>
          <Typography component="span" sx={{ textAlign: 'right' }}>
            {requestInfo?.roomModel?.name}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Price:</Typography>
          <Typography component="span">
            {' '}
            USD ${requestInfo?.roomModel?.lowestPrice}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Taxes And Charges:</Typography>
          <Typography component="span">
            {' '}
            USD $ {requestInfo?.roomModel?.taxesAndCharges}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Nights:</Typography>
          <Typography component="span"> {requestInfo?.nights}</Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Check In Date:</Typography>
          <time>{getFormatedDate(parseInt(requestInfo?.checkInDate))}</time>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Check Out Date:</Typography>
          <time>{getFormatedDate(parseInt(requestInfo?.checkOutDate))}</time>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Quantity: </Typography>
          <Typography component="span">
            {requestInfo?.guestsDistribution?.length}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Guest/Room: </Typography>
          <Box sx={{ p: 0, gap: 1, display: 'grid' }}>
            {requestInfo?.guestsDistribution?.map((room, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 1,
                  minWidth: 'max-content',
                }}
              >
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

      <Box sx={withIconLabel}>
        <PermContactCalendarIcon />
        <Typography variant="subtitle1" component="h3">
          Prospect Information
        </Typography>
      </Box>
      <Box component="ul" sx={{ mb: 2, px: 0 }}>
        {' '}
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Name:</Typography>
          <Typography component="span">
            {requestInfo?.client?.firstName} {requestInfo?.client?.lastName}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Mobile:</Typography>
          <Typography component="span">
            {' '}
            {requestInfo?.client?.mobileNumber}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Landline:</Typography>
          <Typography component="span">
            {' '}
            {requestInfo?.client?.landlineNumber}
          </Typography>
        </Box>
        <Box component="li" sx={list}>
          <Typography sx={leyend}>Email: </Typography>
          <Typography
            component="span"
            sx={{ textTransform: 'none', fontSize: '14px' }}
          >
            {requestInfo?.client?.email}
          </Typography>
        </Box>
      </Box>
      <Box sx={withIconLabel}>
        <ListAltIcon />
        <Typography variant="subtitle1" component="h3">
          Special requests
        </Typography>
      </Box>
      <Typography sx={{ mx: 1, fontSize: '14px' }}>
        {requestInfo.specifications}
      </Typography>
    </div>
  );
}
