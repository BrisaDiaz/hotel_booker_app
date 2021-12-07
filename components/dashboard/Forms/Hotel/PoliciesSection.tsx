import React from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

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
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Policies and Rules
      </Typography>

      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={6}>
          <TextField
            id="checkInHour"
            label="Checkin hour"
            type="time"
            {...register('checkInHour')}
            variant="outlined"
            sx={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue="00:00"
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            variant="outlined"
            id="checkOutHour"
            {...register('checkOutHour')}
            label="Checkout hour"
            type="time"
            sx={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue="00:00"
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
      </Grid>

      <TextField
        id="policies"
        {...register('policiesAndRules', {
          required: 'The policies and rules are required',
        })}
        label={
          errors['policiesAndRules']
            ? errors['policiesAndRules'].message
            : 'Policies and Rules'
        }
        error={errors['policiesAndRules'] && true}
        multiline
        rows={8}
        variant="outlined"
        sx={styles.textField}
      />
    </Grid>
  );
}
