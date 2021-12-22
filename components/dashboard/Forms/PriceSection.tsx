import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';

export default function ({
  register,
  errors,
  defaultData,

  children,
}: {
  children?: React.ReactNode;
  register: Function;
  errors: any;
  defaultData?: any;
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
            defaultValue={
              defaultData?.lowestPrice ? defaultData.lowestPrice : 0
            }
            label={
              errors['lowestPrice']
                ? errors['lowestPrice'].message
                : 'Lowest Price'
            }
            type="number"
            error={errors['lowestPrice'] ? true : false}
            InputProps={{
              min: 0,
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
            defaultValue={
              defaultData?.taxesAndCharges ? defaultData.taxesAndCharges : 0
            }
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
              min: 0,
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
}
