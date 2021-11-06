import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { getFormatedDate } from '../utils';
import TodayIcon from '@mui/icons-material/Today';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  bgcolor: 'background.paper',
  border: '2px solid #efefef',
  boxShadow: 24,
  px: 3,
  py: 4,
};
const flexBox = {
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
};
const columnBox = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};
const title = {
  textTransform: 'capitalize',
  mb: 4,
  align: 'center',
};
const withIconLabel = {
  marginBottom: '5px',
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
};

export default function TransitionsModal({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: number;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [checkInValue, setCheckIn] = React.useState<Date | null>();
  const [checkOutValue, setCheckOut] = React.useState<Date | null>();

  const handleCheckInDateChange = (newValue: string) => {
    setCheckIn(new Date(newValue));
    console.log(newValue);
  };
  const handleCheckOutDateChange = (newValue: string) => {
    setCheckOut(new Date(newValue));
    console.log(newValue);
  };
  const minDate = getFormatedDate(Date.now());
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
            <Typography variant="h5" component="h2" sx={title}>
              check Room abailability
            </Typography>

            <Typography component="div" sx={{ mb: 2 }}>
              <Box sx={flexBox}>
                <TextField type="number" label="Rooms" />
                <TextField type="number" label="Adults" />
                <TextField type="number" label="Childrens" />
              </Box>
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
            <Typography component="div" sx={{ my: 1 }}>
              <Box sx={columnBox}>
                <TextField
                  name="checkInDate"
                  type="date"
                  min={minDate}
                  onChange={(e) => handleCheckInDateChange(e.target.value)}
                />
                <TextField
                  name="checkOutDate"
                  type="date"
                  onChange={(e) => handleCheckOutDateChange(e.target.value)}
                />
              </Box>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" sx={{ mt: 2 }}>
                send
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
