import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

import Typography from '@mui/material/Typography';

import BookingRequesInfo from '@/components/modals/BookingRequesInfo';
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minwidth: 360,
  maxWidth: 500,
  width: '100%',
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
const list = {
  display: 'flex',
  textTransform: 'capitalize',
  flexWrap: 'wrap',
  mb: 1,
  ml: 1,
  fontSize: '14px',
  '& > *': {
    fontSize: '14px',
  },
};
const leyend = {
  width: { xs: '50%', sm: '40%' },
  color: 'text.secondary',
  fontStyle: 'oblique',
  fontSize: '14px',
};
export default function BookingModal({
  isModalOpen,
  requestInfo,
  closeModal,
}: {
  isModalOpen: boolean;
  requestInfo: BookingRequest;
  closeModal: Function;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };
  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
  }, [isModalOpen]);
  return requestInfo ? (
    <Box sx={{ maxWidth: '100vw' }}>
      <Modal
        aria-labelledby="requestInfo-details-title"
        aria-describedby="requestInfo-details"
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
            <Typography
              id="requestInfo-details-title"
              variant="h5"
              component="h2"
              sx={title}
            >
              Boking Request
            </Typography>
            <BookingRequesInfo requestInfo={requestInfo} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  ) : null;
}
