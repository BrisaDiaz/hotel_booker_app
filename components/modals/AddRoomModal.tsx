import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'
const styles = {
  modal: {
    position: 'fixed',
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
       input:{
    '*':{
       fontSize:{xs:'14px',sm:'16px'},
    },
'input':{

p:{xs:'10px 14px',sm:'16.5px 14px'},
},
    },
} as const;

export default function KeepMountedModal({
  onSubmit,
  isModalOpen,
  closeModal,
  restrictedNumbers,
}: {
  onSubmit: (formData:any)=>void;
  closeModal: ()=>void;
  isModalOpen: boolean;
  restrictedNumbers: number[];
}) {
  const inputRef: any = React.useRef();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    setOpen(false), closeModal();
    setRoomNumbers([]);
    setCurrentNumber(null);
  };
  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
    return handleClose();
  }, [isModalOpen]);
  const [roomNumbers, setRoomNumbers] = React.useState<number[] | []>([]);
  const [currentNumber, setCurrentNumber] = React.useState<number | null>(null);
  const [error, setError] = React.useState({ message: '' });
  const handleChange = (newNumber: number) => {
    if (!newNumber || newNumber < 1) {
      return setError({ message: 'Only positive numbers are allowed' });
    }
    if (restrictedNumbers.includes(newNumber)) {
      return setError({
        message: 'Room numeber already registred',
      });
    }
    setError({ message: '' });
    setCurrentNumber(newNumber);
  };
  const handleDeleteNumber = (toDeleteNumber: number) => {
    setRoomNumbers(roomNumbers.filter((number) => number !== toDeleteNumber));
  };
  const handleAddMore = (): number[] | [] => {
    if (!error.message && currentNumber) {
      const uniqueNumbers = [...new Set([...roomNumbers, currentNumber])];

      setRoomNumbers(uniqueNumbers);
      return uniqueNumbers;
    }
    return roomNumbers;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const numbers = handleAddMore();

    if (numbers.length) return onSubmit(numbers);
  };
 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  return (
    <Box sx={{ maxWidth: '100vw', margin: '0 auto' }}>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box
          sx={styles.modal}
          component="form"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
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
           size={isInSmScreen?'medium':"small"}
              sx={styles.input}
            type="number"
            id="country"
            inputRef={inputRef}
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
