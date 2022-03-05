import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

import CloseIcon from '@mui/icons-material/Close';
export default function CloseButton({
  handleClose,
  buttonStyles,
}: {
  handleClose: () => void;
  buttonStyles?: any;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 500,
      }}
    >
      <IconButton
        sx={{
          mr: { xs: '-12px', md: '-16px' },
          ...buttonStyles,
        }}
        aria-label="delete"
        onClick={() => handleClose()}
      >
        <CloseIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
}
