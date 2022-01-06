import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TodayIcon from '@mui/icons-material/Today';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { styles } from './styles';
import { v4 as uuidv4 } from 'uuid';
import { getFormatedDate } from '@/utils/ToYearMounthDayFormat';

export type Room = {
  children: number;
  adults: number;
  id: string;
};

const flexBox = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
  px: '5px',
} as const;

const roomsContainer = {
  maxHeight: '190px',
  borderBottom: '1px solid #0002',
  borderTop: '1px solid #0002',
  overflowY: 'hidden',
} as const;

function RoomField({
  room,
  handleChange,
  index,
  onDelete,
}: {
  room: Room;
  index: number;
  onDelete: ()=>void;
  handleChange: (roomId:string,field:'adults'|'children',quantity:number)=>void;
}) {
  return (
    <div>
      <Box component="div" sx={{ my: 2 }}>
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
      </Box>
    </div>
  );
}
export default function BookingRoomInputs({
  register,
  errors,
  setError,
  setValue,
  defaultValues,
}: {
  register: (fieldName:string,config?:any)=>void;
  setError:  (fieldName:string,error?:any)=>void;
  errors: any;
  setValue: (fieldName:string,value:any)=>void;
  defaultValues?: {
    checkInDate?: string;
    checkOutDate?: string;
    rooms?: { adults: number; children: number }[];
  };
}) {
  const minDate = getFormatedDate(new Date(Date.now()).getTime());
  const [rooms, setRooms] = React.useState<Room[]>(
    defaultValues?.rooms
      ? defaultValues.rooms.map((room) => ({
          adults: room.adults,
          children: room.children,
          id: uuidv4(),
        }))
      : [{ adults: 1, children: 0, id: uuidv4() }]
  );
  const [checkInDate, setCheckInDate] = React.useState<string>(
    defaultValues?.checkInDate ? defaultValues?.checkInDate : minDate
  );

  const [checkOutDate, setCheckOutDate] = React.useState<string>(
    defaultValues?.checkOutDate ? defaultValues?.checkOutDate : minDate
  );
  const handdleAddRoom = () => {
    // verify user is not adding emty rooms
    if (
      rooms[rooms.length - 1].children > 0 ||
      rooms[rooms.length - 1].adults > 0
    )
      return setRooms([...rooms, { adults: 0, children: 0, id: uuidv4() }]);
  };
  const handleRoomChanges = (
    roomId: string,
    fieldChanged: 'adults' | 'children',
    value: number
  ) => {
    const actualizedRooms = rooms.map((room) =>
      room.id === roomId ? { ...room, [fieldChanged]: value } : room
    );

    setRooms(actualizedRooms);
  };
  const handleDeleteRoom = (id: string) => {
    const actualizedList = rooms.filter((current) => current.id !== id);
    setRooms(actualizedList);
  };
  const handleDateChanges = () => {
    let existErrors = false;
    setError('checkInDate');
    setError('checkOutDate');

    if (new Date(checkOutDate).getTime() < new Date(minDate).getTime()) {
      setError('checkOutDate', {
        type: 'manual',
        message: 'Invalid date',
      });
      existErrors = true;
    }

    if (new Date(checkInDate).getTime() < new Date(minDate).getTime()) {
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid date',
      });
      existErrors = true;
    }
    if (new Date(checkOutDate).getTime() < new Date(checkInDate).getTime()) {
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid check in date',
      });
      existErrors = true;
    }

    if (existErrors === true) return null;

    setValue('checkInDate', checkInDate);
    setValue('checkOutDate', checkOutDate);
  };
  React.useEffect(() => {
    const roomsWithData = rooms
      .filter((room) => Boolean(room.adults) || Boolean(room.children))
      .map((room) => ({
        adults: room.adults,
        children: room.children,
      }));
    setValue('guestsDistribution', roomsWithData);
    setValue('requiredRooms', roomsWithData.length);
  }, [rooms]);
  React.useEffect(() => {
    handleDateChanges();
  }, [checkInDate, checkOutDate]);

  return (
    <div>
      <Box sx={styles.withIconLabel}>
        <TodayIcon />
        <Typography id="transition-modal-title" component="h3">
          Check In/ Check Out
        </Typography>
      </Box>
      <Typography component="div" sx={{ my: 2 }}>
        <Box sx={flexBox}>
          <TextField
            type="date"
            fullWidth
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            error={errors['checkInDate']?.message}
          />
          <TextField
            type="date"
            fullWidth
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            error={errors['checkOutDate']?.message}
          />
        </Box>
      </Typography>

      <Box sx={styles.withIconLabel}>
        <PeopleIcon />
        <Typography id="transition-modal-title" component="h3">
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
      <input type="hidden" {...register('guestsDistribution')} />
      <input
        type="hidden"
        {...register('checkInDate', {
          required: true,
        })}
      />
      <input
        type="hidden"
        {...register('checkOutDate', {
          required: true,
        })}
      />
      <input defaultValue={1} type="hidden" {...register('requiedRooms')} />
    </div>
  );
}
