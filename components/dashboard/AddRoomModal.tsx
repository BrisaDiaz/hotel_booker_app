import * as React from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const styles = {
  modal: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: '320px',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid rgba(244,244,244,1)',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 2,
    '& > button': {
      textTransform: 'capitalize',
    },
  },
};

export default function KeepMountedModal({
  onSubmit,
  isModalOpen,
  closeModal,
  restrictedNumbers,
}: {
  onSubmit: Function;
  closeModal: Function;
  isModalOpen: boolean;
  restrictedNumbers: number[];
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };
  React.useEffect(() => {
    if (isModalOpen) {
      handleOpen();
    }
  }, [isModalOpen]);
  const [roomNumbers, setRoomNumbers] = React.useState<number[] | []>([]);
  const [currentNumber, setCurrentNumber] = React.useState<number | null>(null);
  const [error, setError] = React.useState({ message: '' });
  const handleChange = (newNumber: number) => {
    console.log(newNumber);
    if (!newNumber || newNumber < 1) {
      return setError({ message: 'Only positive numbers are allowed' });
    }
    if (restrictedNumbers.includes(newNumber)) {
      return setError({
        message: 'A room with that identifier was already registred',
      });
    }
    setError({ message: '' });
    setCurrentNumber(newNumber);
  };
  const handleDeleteNumber = (toDeleteNumber: number) => {
    setRoomNumbers(roomNumbers.filter((number) => number !== toDeleteNumber));
  };
  const handleAddMore = () => {
    if (!error.message && currentNumber) {
      const uniqueNumbers = new Set([...roomNumbers, currentNumber]);
      return setRoomNumbers([...uniqueNumbers]);
    }
  };
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddMore();
    onSubmit(roomNumbers);
  };

  return (
    <Box sx={{ maxWidth: '100vw', margin: '0 auto' }}>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={styles.modal} component="form" onSubmit={handleSubmit}>
          <Typography
            id="transition-modal-title"
            variant="h6"
            component="h2"
            sx={{ textTransform: 'capitalize' }}
          >
            Add a new room
          </Typography>
          {roomNumbers.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '6px' }}>
              {roomNumbers.map((roomNumber) => (
                <Chip
                  label={roomNumber}
                  key={roomNumber}
                  onDelete={() => handleDeleteNumber(roomNumber)}
                />
              ))}
            </Stack>
          )}
          <TextField
            type="number"
            id="country"
            autoFocus={true}
            label={error.message ? error.message : 'Room Number Identifier'}
            variant="outlined"
            error={error.message ? true : false}
            onChange={(e) => handleChange(parseInt(e.target.value))}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {' '}
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ color: '#fff', textTransform: 'capitalize' }}
              type="submit"
            >
              {`Add ${roomNumbers.length ? 'Rooms' : 'Room'}`}
            </Button>
            <Button
              variant="outlined"
              size="large"
              style={{ textTransform: 'capitalize' }}
              onClick={handleAddMore}
            >
              {'save & add another'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
