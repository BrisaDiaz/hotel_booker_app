import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const styles = {
  groupTitle: {
    fontWeight: 500,
    color: '#484848',
    background: '#fff',
    mb: '10px',
    px: '10px',
    width: 'max-content',
  },
  fieldset: {
    my: 4,
    pt: 1.5,
    borderRadius: 5,
    border: '1px solid  rgb(0 0 0 / 10%)',
    padding: { xs: '15px', sm: '20px', md: '25px ' },
    background: '#fff',
    boxShadow: '1px 5px 32px -12px rgb(0 0 0 / 30%)',
  },

  textField: {
    width: '100%',
    my: 1,
  },
};
export default function ({
  register,
  errors,
}: {
  register: Function;
  errors: any;
}) {
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Capacity & Stay
      </Typography>

      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="mts2"
            {...register('mts2', {
              required: 'The mts2 are required',
              min: {
                value: 0,
                message: 'Meters must be positive number',
              },
            })}
            inputProps={{ min: 0 }}
            variant="outlined"
            label={errors['mts2'] ? errors['mts2'].message : 'Quadratic Meters'}
            type="number"
            error={errors['mts2'] ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ width: { md: '50%' } }}>
          <TextField
            sx={styles.textField}
            id="maximunGueststs"
            defaultValue={0}
            inputProps={{ min: 0 }}
            {...register('maximunGuests', {
              required: 'The guest limit is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['maximunGuests']
                ? errors['maximunGuests'].message
                : 'Maximun guest'
            }
            type="number"
            error={errors['maximunGuests'] ? true : false}
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="minimunNights"
            defaultValue={1}
            {...register('minimunNights', {
              required: 'The minimun staying  is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            inputProps={{ min: 0 }}
            variant="outlined"
            label={
              errors['minimunNights']
                ? errors['minimunNights'].message
                : 'Minimun Nights'
            }
            type="number"
            error={errors['minimunNights'] ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="maximunNights"
            {...register('maximunNights', {
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['maximunNights']
                ? errors['maximunNights'].message
                : 'Maximun Nights'
            }
            type="number"
            error={errors['maximunNights'] ? true : false}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
