import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';

export default function CloseButton({
  handleClose,
  buttonStyles,
}: {
  handleClose: Function;
  buttonStyles?: any;
}) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <IconButton
        sx={{ mr: '-12px', ...buttonStyles }}
        aria-label="delete"
        color="secondary"
        onClick={() => handleClose()}
      >
        <CancelIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
