import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getFormatedDate } from '../utils/ToYearMounthDayFormat';
import TodayIcon from '@mui/icons-material/Today';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import CancelIcon from '@mui/icons-material/Cancel';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '2px solid #efefef',
  boxShadow: 24,

  p: 4,
  px: 3.5,
};
const flexBox = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
  px: '5px',
};
const title = {
  textTransform: 'capitalize',
  mb: 2,
  align: 'center',
};
const withIconLabel = {
  marginBottom: '10px',
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
};
const roomsContainer = {
  maxHeight: '190px',
  borderBottom: '1px solid #0002',
  borderTop: '1px solid #0002',
  overflowY: 'hidden',
};

type Room = {
  children: number;
  adults: number;
  id: string;
};

function RoomField({
  room,

  index,
  deleteItem,
  register,
  errors,
}: {
  room: Room;
  index: number;
  deleteItem: Function;
  register: Function;
  errors: any;
}) {
  return (
    <div>
      <Typography component="div" sx={{ my: 2 }}>
        <Box sx={flexBox}>
          <Typography variant="body2" sx={{ minWidth: 'max-content' }}>
            Room {index + 1}
          </Typography>
          <TextField
            type="number"
            label="Adults"
            error={errors[`adults${index}`] && true}
            {...register(`adults${index}`, {
              require: true,
              min: {
                value: 0,
              },
              pattern: /^[0-9]*$/,
            })}
          />
          <TextField
            type="number"
            label="Children"
            error={errors[`children${index}`] && true}
            {...register(`children${index}`, {
              require: true,
              min: {
                value: 0,
              },
              pattern: /^[0-9]*$/,
            })}
          />
          {index !== 0 ? (
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => deleteItem(room.id)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          ) : (
            <Box sx={{ width: '60px' }}></Box>
          )}
        </Box>
      </Typography>
    </div>
  );
}
export default function TransitionsModal({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: Function;
}) {
  const minDate = getFormatedDate(Date.now());

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [rooms, setRooms] = React.useState<Room[]>([
    { adults: 1, children: 0, id: uuidv4() },
  ]);

  const handdleAddRoom = () => {
    setRooms([...rooms, { adults: 0, children: 0, id: uuidv4() }]);
  };

  const handleDeleteRoom = (id: string) => {
    const actualizedList = rooms.filter((current) => current.id !== id);
    setRooms(actualizedList);
  };
  const handleData = (data: any) => {
    const { checkInDate, checkOutDate } = data;

    new Date(checkOutDate).getTime() < new Date(minDate).getTime() &&
      setError('checkOutDate', {
        type: 'manual',
        message: 'Invalid date',
      });
    new Date(checkInDate).getTime() < new Date(minDate).getTime() &&
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid date',
      });
    new Date(checkOutDate).getTime() < new Date(checkInDate).getTime() &&
      setError('checkInDate', {
        type: 'manual',
        message: 'Invalid check out date',
      });
    //// validates dates are corrected
    if (Object.keys(errors).length) return false;
    /// extract the quantity if rooms with data
    const roomsQuantity = Object.keys(data)
      .filter((field) => field.includes('adults'))
      .filter((key) => Boolean(data[key])).length;

    /// extract the data of each room
    let roomsWithData = new Array(roomsQuantity)
      .fill({ adults: 0, children: 0 })
      .reduce((array, current, index) => {
        let roomData = {
          adults: data[`adults${index}`],
          children: data[`children${index}`],
        };
        return [...array, roomData];
      }, []);

    const formattedData = {
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      rooms: roomsWithData,
    };
    onSubmit(formattedData);
    handleClose();
  };

  return (
    <div>
      <div onClick={handleOpen}>{children}</div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                sx={{ margin: '-25px -10px -10px 0' }}
                aria-label="delete"
                color="secondary"
                onClick={handleClose}
              >
                <CancelIcon fontSize="inherit" />
              </IconButton>
            </Box>

            <form onSubmit={handleSubmit(handleData)}>
              <Typography variant="h5" component="h2" sx={title}>
                check Room abailability
              </Typography>
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
                    defaultValue={minDate}
                    error={errors['checkInDate'] && true}
                    {...register('checkInDate', {
                      required: true,
                    })}
                  />
                  <TextField
                    type="date"
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
                        index={index}
                        deleteItem={handleDeleteRoom}
                        register={register}
                        errors={errors}
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, p: 1.5, width: '100%' }}
                >
                  send
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
