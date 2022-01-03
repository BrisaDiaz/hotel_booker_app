import React from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';

export default function AddressSection({
  register,
  errors,
  defaultData,
  children,
}: {
  children?: React.ReactNode;
  register:  (fieldName:string,config?:any)=>void;
  errors: any;
  defaultData?: any;
}) {
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Address
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            id="hole-address"
            type="text"
            defaultValue={defaultData?.address?.holeAddress || ''}
            {...register('holeAddress', {
              required: 'The hole address is required',
              maxLength: {
                value: 100,
                message: 'The address must not exced the 50 character',
              },
            })}
            label={
              errors['holeAddress']
                ? errors['holeAddress'].message
                : 'Hole Address'
            }
            error={errors['holeAddress'] ? true : false}
            sx={styles.textField}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="text"
            id="country"
            defaultValue={defaultData?.address?.country || ''}
            label={errors['country'] ? errors['country'].message : 'Country'}
            error={errors['country'] ? true : false}
            {...register('country', {
              maxLength: {
                value: 25,
                message: 'The address must not exced the 20 character',
              },
            })}
            sx={styles.textField}
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            defaultValue={defaultData?.address?.postalCode || ''}
            sx={styles.textField}
            id="postalCode"
            type="text"
            label={
              errors['postalCode']
                ? errors['postalCode'].message
                : 'Zip/Postal code'
            }
            error={errors['postalCode'] ? true : false}
            {...register('postalCode', {
              required: 'The Postal code is required',
              maxLength: {
                value: 10,
                message: 'The Postal code must not exced the 10 character',
              },
            })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="administrativeArea"
            label={
              errors['administrativeArea']
                ? errors['administrativeArea'].message
                : 'State/Region/Province'
            }
            defaultValue={defaultData?.address?.administrativeArea || ''}
            error={errors['administrativeArea'] ? true : false}
            {...register('administrativeArea', {
              required: 'The field is required',
              maxLength: {
                value: 25,
                message:
                  'The administrative Area  must not exced the 10 character',
              },
            })}
            type="text"
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="city"
            label={errors['city'] ? errors['city'].message : 'City'}
            error={errors['city'] ? true : false}
            defaultValue={defaultData?.address?.city || ''}
            {...register('city', {
              maxLength: {
                value: 25,
                message: 'The city name must not exced the 10 character',
              },
            })}
            variant="outlined"
            type="text"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="street"
            type="text"
            defaultValue={defaultData?.address?.street || ''}
            label={errors['street'] ? errors['street'].message : 'Street'}
            error={errors['street'] ? true : false}
            {...register('street', {
              required: 'The street name and nº is required',
              maxLength: {
                value: 25,
                message: 'The street  must not exced the 25 character',
              },
            })}
            variant="outlined"
          />
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
}
