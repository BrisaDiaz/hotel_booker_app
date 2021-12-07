import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';

export default function CloseButton({
  handleClose,
}: {
  handleClose: Function;
}) {
  return (
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
  );
}
