import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function SimpleBackdrop({ loading }: { loading: boolean }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  React.useEffect(() => {
    loading ? handleOpen() : handleClose();
    return () => {
      handleClose();
    };
  }, [loading]);
  return (
    <div>
      <Backdrop
        sx={{
          color: '#fff',

          zIndex: 5000,
        }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
