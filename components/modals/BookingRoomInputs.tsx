import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TodayIcon from '@mui/icons-material/Today';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

const flexBox = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
  px: '5px',
};

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
const roomsContainer = {
  maxHeight: '190px',
  borderBottom: '1px solid #0002',
  borderTop: '1px solid #0002',
  overflowY: 'hidden',
};

function RoomField({
  room,
  handleChange,
  index,
  onDelete,
}: {
  room: Room;
  index: number;
  onDelete: Function;
  handleChange: Function;
}) {
  return (
    <div>
      <Typography component="div" sx={{ my: 2 }}>
        <Box sx={flexBox}>
          <Typography variant="body2" sx={{ minWidth: 'max-content' }}>
            Room {index}
          </Typography>
          <TextField
            type="number"
            label="Adults"
            fullWidth
            onChange={(e) =>
              handleChange(room.id, 'adults', parseInt(e.target.value) || 0)
            }
            defaultValue={room.adults}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <TextField
            type="number"
            label="Children"
            fullWidth
            defaultValue={room.children}
            InputProps={{ inputProps: { min: 0 } }}
            onChange={(e) =>
              handleChange(room.id, 'children', parseInt(e.target.value) || 0)
            }
          />
          {index !== 1 ? (
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => onDelete()}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          ) : (
            <Box sx={{ width: '90px' }}></Box>
          )}
        </Box>
      </Typography>
    </div>
  );
}
export default function BookingRoomInputs({
  register,

  errors,
  handleDeleteRoom,
  handdleAddRoom,
  handleRoomChanges,
  rooms,
  minDate,
}: {
  register: Function;
  setError: Function;
  errors: any;
  handleDeleteRoom: Function;
  handdleAddRoom: Function;
  handleRoomChanges: Function;
  rooms: Room[];
  minDate: string;
}) {
  return (
    <div>
      <Box sx={withIconLabel}>
        <TodayIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Check In/ Check Out
        </Typography>
      </Box>
      <Typography component="div" sx={{ my: 2 }}>
        <Box sx={flexBox}>
          <TextField
            type="date"
            fullWidth
            defaultValue={minDate}
            error={errors['checkInDate'] && true}
            {...register('checkInDate', {
              required: true,
            })}
          />
          <TextField
            type="date"
            fullWidth
            defaultValue={minDate}
            error={errors['checkOutDate'] && true}
            {...register('checkOutDate', {
              required: true,
            })}
          />
        </Box>
      </Typography>
      <Box sx={withIconLabel}>
        <PeopleIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Guests/Room
        </Typography>
        <Typography variant="caption" component="span">
          {'(children  0-12 years)'}
        </Typography>
      </Box>

      <Box sx={roomsContainer}>
        <Box
          sx={{
            maxHeight: '190px',
            overflowY: 'auto',
            scrollbarWidth: 'thin',
          }}
        >
          {rooms.map((room, index) => (
            <div key={room.id}>
              <RoomField
                room={room}
                handleChange={handleRoomChanges}
                index={index + 1}
                onDelete={() => handleDeleteRoom(room.id)}
              />
            </div>
          ))}
        </Box>
      </Box>
      <Button
        sx={{ marginLeft: 'auto', mt: 1, display: 'flex' }}
        onClick={() => handdleAddRoom()}
      >
        Add Room
      </Button>
    </div>
  );
}
