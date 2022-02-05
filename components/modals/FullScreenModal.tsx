import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import CloseButton from '@/components/modals/CloseButton';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({
  title,
  children,
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!isOpen) return <div />;
  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      sx={{
        '.css-m9glnp-MuiPaper-root-MuiDialog-paper': { background: '#fff' },
      }}
      TransitionComponent={Transition}
    >
      <CloseButton
        handleClose={onClose}
        buttonStyles={{
          transform: { md: 'scale(1.2)' },
          mx: { xs: 1, md: 2 },

          my: 1,
        }}
      />

      {title ? (
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{ fontWeight: 600, opacity: 0.8 }}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Dialog>
  );
}
