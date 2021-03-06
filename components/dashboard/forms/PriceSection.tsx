import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';
export default function PriceSection({
  register,
  errors,
  defaultData,
  sourceForm,
  children,
}: {
  children?: React.ReactNode;
  register: (fieldName: string, config?: any) => void;
  errors: any;
  defaultData?: any;
  sourceForm?: 'roomForm' | 'hotelForm';
}) {
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Prices
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="lowestPrice"
            {...register('lowestPrice', {
              required: 'The lowest price is required',
              min: {
                value: 0,
                message: 'The amount must be a positive number',
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
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="taxesAndCharges"
            defaultValue={
              defaultData?.taxesAndCharges ? defaultData.taxesAndCharges : 0
            }
            {...register('taxesAndCharges', {
              required: 'The taxes are required',
              min: {
                value: 0,
                message: 'The amount must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['taxesAndCharges']
                ? errors['taxesAndCharges'].message
                : 'Taxes And Charges'
            }
            type="number"
            error={errors['taxesAndCharges'] ? true : false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      {sourceForm === 'roomForm' && (
        <Grid container spacing={{ sm: 2 }} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              size={isInSmScreen ? 'medium' : 'small'}
              id="cancellationFee"
              defaultValue={
                defaultData?.cancellationFee ? defaultData.cancellationFee : 0
              }
              {...register('cancellationFee', {
                min: {
                  value: 0,
                  message: 'The amount must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['cancellationFee']
                  ? errors['cancellationFee'].message
                  : 'cancellation Fee'
              }
              type="number"
              error={errors['cancellationFee'] ? true : false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
      {children}
    </Grid>
  );
}
