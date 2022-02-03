import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';

export default function ResponsiveDialog({
  title,
  text,
  onAccept,
  onCancel,
  isDialogOpen,
  acceptLabel,
  rejectLabel,
}: {
  title?: string;
  acceptLabel: string;
  rejectLabel: string;
  text: string;
  onAccept: () => void;
  onCancel?: () => void;
  isDialogOpen: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
    if (onCancel) {
      onCancel();
    }
  };
  React.useEffect(() => {
    if (isDialogOpen) {
      return setOpen(true);
    }
    handleClose();
  }, [isDialogOpen]);
  const handleResponse = (Response: 'accept' | 'reject') => {
    if (Response === 'accept') {
      onAccept();
      return handleClose();
    }
    if (onCancel) {
      onCancel();
    }
    handleClose();
  };
  return (
    <div>
      <Dialog
        sx={{ border: '1px solid rgba(244,244,244,1)', borderRadius: 2 }}
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
        <DialogActions sx={{ mb: 1, mr: 1 }}>
          <Button autoFocus onClick={() => handleResponse('reject')}>
            {rejectLabel}
          </Button>
          <Button
            onClick={() => handleResponse('accept')}
            autoFocus
            variant="outlined"
          >
            {acceptLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
