import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import validations from '@/utils/formValidations';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { styles } from './styles';
import { Theme } from '@mui/system';
import { useMediaQuery } from '@mui/material';
export default function BookingClientInputs({
  register,
  errors,
  disable,
}: {
  register: (fieldName: string, config?: any) => void;
  errors: any;
  disable?: boolean;
}) {
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <div>
      {disable && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 10,
            backgroundColor: '#fff',
            opacity: 0.5,
          }}
        />
      )}
      <Box sx={styles.withIconLabel}>
        <PermContactCalendarIcon />
        <Typography
          id="transition-modal-title"
          variant="subtitle1"
          component="h3"
        >
          Contact Information
        </Typography>
      </Box>
      <Grid sx={styles.inputGrid} container spacing={1}>
        <Grid sx={styles.inputGrid} item xs={12} sm={6}>
          <TextField
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
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
        <Grid sx={styles.inputGrid} item xs={12} sm={6}>
          <TextField
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
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
        <Grid sx={styles.inputGrid} item xs={12}>
          <TextField
            fullWidth
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
            type="email"
            id="email"
            label={errors['email'] ? errors['email'].message : 'Email Address'}
            {...register('email', { ...validations.email })}
            error={errors['email'] && true}
            autoComplete="email"
          />
        </Grid>

        <Grid sx={styles.inputGrid} item xs={12} sm={6}>
          <TextField
            id="landline"
            fullWidth
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
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
        <Grid sx={styles.inputGrid} item xs={12} sm={6}>
          <TextField
            id="mobile"
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
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
        <Grid sx={styles.inputGrid} item xs={12}>
          <TextField
            fullWidth
            size={isInSmScreen ? 'medium' : 'small'}
            sx={styles.input}
            id="specifications"
            multiline
            {...register('specifications')}
            rows={isInSmScreen ? 5 : 8}
            label={'Special requests'}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </div>
  );
}
