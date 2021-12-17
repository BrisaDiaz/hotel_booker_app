import React from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';
export default function ({
  register,
  errors,
  defaultData,
}: {
  register: Function;
  errors: any;
  defaultData?: any;
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
            defaultValue={defaultData?.checkInHour || '00:00'}
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
            defaultValue={defaultData?.checkOutHour || '00:00'}
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
        defaultValue={defaultData?.policiesAndRules || ''}
        variant="outlined"
        sx={styles.textField}
      />
    </Grid>
  );
}
