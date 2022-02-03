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
import BookingRequestInfo from '@/components/modals/BookingRequestInfo';

export default function BookingModal({
  isModalOpen,
  requestInfo,
  onClose,
}: {
  isModalOpen: boolean;
  requestInfo: BookingRequest;
  onClose: () => void;
}) {
  const handleClose = () => {
    onClose();
  };

  return requestInfo ? (
    <Box sx={{ maxWidth: '100vw' }}>
      <Modal
        aria-labelledby="requestInfo-details-title"
        aria-describedby="requestInfo-details"
        open={isModalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isModalOpen}>
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
              Booking Request
            </Typography>
            <BookingRequestInfo requestInfo={requestInfo} />
          </Box>
        </Fade>
      </Modal>
    </Box>
  ) : null;
}
