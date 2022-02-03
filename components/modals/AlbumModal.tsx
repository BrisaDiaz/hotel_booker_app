import * as React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';

import CloseButton from '@/components/modals/CloseButton';

import { styles } from './styles';
import { Album } from '@/interfaces/index';
export default function AlbumModal({
  isOpen,
  onSubmit,
  onClose,
  defaultValue,
}: {
  isOpen: boolean;
  onSubmit: (formData: any) => void;
  onClose: () => void;
  defaultValue?: Partial<Album> | null;
}) {
  const handleClose = () => {
    onClose();
  };

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: { name: string }) => {
    onSubmit(data);
  };

  React.useEffect(() => {
    setValue('name', defaultValue ? defaultValue?.name : '');
  }, [defaultValue]);

  return (
    <Modal
      sx={{ zIndex: 2000 }}
      keepMounted
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-{styles.title}"
      aria-describedby="modal-modal-specifications"
    >
      <Box
        sx={styles.modal}
        component="form"
        noValidate
        onSubmit={handleSubmit(submitMiddleware)}
      >
        <CloseButton handleClose={handleClose} />
        <Typography
          id="modal-modal-{styles.title}"
          variant="h5"
          component="h2"
          sx={styles.title}
        >
          {defaultValue ? 'Edit Album' : 'Add a new album'}
        </Typography>
        <TextField
          fullWidth
          id="name"
          {...register('name', {
            required: 'The album name is required.',
            maxLength: {
              value: 100,
              message:
                'The description should be of a 100 characters length maximum.',
            },
          })}
          variant="outlined"
          label={errors['name'] ? errors['name'].message : 'Name'}
          type="text"
          error={errors['name'] ? true : false}
          defaultValue={defaultValue ? defaultValue.name : ''}
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, p: 1.5, width: '100%' }}
        >
          save
        </Button>
      </Box>
    </Modal>
  );
}
