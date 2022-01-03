import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { BookingRequest } from '@/interfaces/index';
import Typography from '@mui/material/Typography';
import { styles } from './styles';
import BookingRequesInfo from '@/components/modals/BookingRequesInfo';

export default function BookingModal({
  isModalOpen,
  requestInfo,
  closeModal,
}: {
  isModalOpen: boolean;
  requestInfo: BookingRequest;
  closeModal: ()=> void;
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
          <Box sx={styles.modal}>
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
              sx={styles.title}
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
