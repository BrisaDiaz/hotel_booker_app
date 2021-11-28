import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ResponsiveDialog({
  title,
  text,
  onAccept,
  onReject,
  isDialogOpen,
  acceptLabel,
  rejectLabel,
}: {
  title?: string;
  acceptLabel: string;
  rejectLabel: string;
  text: string;
  onAccept: Function;
  onReject?: Function;
  isDialogOpen: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (isDialogOpen) {
      return setOpen(true);
    }
    handleClose();
  }, [isDialogOpen]);
  const hadleResponce = (responce: 'accept' | 'reject') => {
    if (responce === 'accept') {
      onAccept();
      return handleClose();
    }
    if (onReject) {
      onReject();
    }
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {title && (
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        )}
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => hadleResponce('reject')}>
            {rejectLabel}
          </Button>
          <Button onClick={() => hadleResponce('accept')} autoFocus>
            {acceptLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
