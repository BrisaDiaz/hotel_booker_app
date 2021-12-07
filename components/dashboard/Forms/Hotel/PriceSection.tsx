import React from 'react';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
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
        Prices
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="lowestPrice"
            {...register('lowestPrice', {
              required: 'The lowest price is required',
              min: {
                value: 0,
                message: 'The ammount must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['lowestPrice']
                ? errors['lowestPrice'].message
                : 'Lowest Price'
            }
            type="number"
            error={errors['lowestPrice'] ? true : false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="taxesAndCharges"
            {...register('taxesAndCharges', {
              required: 'The taxes are required',
              min: {
                value: 0,
                message: 'The ammount must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['taxesAndCharges']
                ? errors['taxesAndCharges'].message
                : 'Taxes And Charges'
            }
            type="number"
            error={errors['lowestPrice'] ? true : false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
