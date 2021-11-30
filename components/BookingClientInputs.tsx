import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import validations from '@/utils/formValidations';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';

const withIconLabel = {
  marginBottom: '10px',
  display: 'flex',
  gap: '10px',
  width: '100%',
  alignItems: 'center',
};

export default function BookingClientInputs({
  register,
  errors,
}: {
  register: Function;
  errors: any;
}) {
  return (
    <div>
      <Box sx={withIconLabel}>
        <PermContactCalendarIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Contact Information
        </Typography>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            {...register('firstName', { ...validations.name })}
            error={errors['firstName'] && true}
            label={
              errors['firstName'] ? errors['firstName'].message : 'First Name'
            }
            fullWidth
            id="firstName"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="lastName"
            {...register('lastName', { ...validations.lastname })}
            error={errors['lastName'] && true}
            label={
              errors['lastName'] ? errors['lastName'].message : 'Last Name'
            }
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="email"
            id="email"
            label={errors['email'] ? errors['email'].message : 'Email Address'}
            {...register('email', { ...validations.email })}
            error={errors['email'] && true}
            autoComplete="email"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="landline"
            fullWidth
            type="tel"
            label={
              errors['landlineNumber']
                ? errors['landlineNumber'].message
                : 'Landline'
            }
            {...register('landlineNumber', {
              required: 'The landline number is required',
              minLength: {
                value: 9,
                message: 'Invalid landline number',
              },
              maxLength: {
                value: 20,
                message: 'Invalid landline number',
              },
            })}
            error={errors['landlineNumber'] ? true : false}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="mobile"
            type="tel"
            fullWidth
            label={
              errors['mobileNumber'] ? errors['mobileNumber'].message : 'Mobile'
            }
            {...register('mobileNumber', {
              required: 'The mobile number is required',
              minLength: {
                value: 9,
                message: 'Invalid mobile number',
              },
              maxLength: {
                value: 20,
                message: 'Invalid mobile number',
              },
            })}
            error={errors['mobileNumber'] ? true : false}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="specifications"
            multiline
            {...register('specifications')}
            rows={5}
            label={'Special requests'}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  );
}
