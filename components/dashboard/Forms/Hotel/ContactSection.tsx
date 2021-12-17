import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import LanguageIcon from '@mui/icons-material/Language';
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
        Contact
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            id="telephone"
            type="tel"
            defaultValue={defaultData?.telephone || ''}
            label={
              errors['telephone'] ? errors['telephone'].message : 'Telephone'
            }
            {...register('telephone', {
              required: 'The telephone number is required',
              minLength: {
                value: 9,
                message: 'Invalid telephone number',
              },
              maxLength: {
                value: 20,
                message: 'Invalid telephone number',
              },
            })}
            error={errors['telephone'] ? true : false}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CallOutlinedIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            sx={styles.textField}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            defaultValue={defaultData?.email || ''}
            sx={styles.textField}
            id="email"
            type="email"
            variant="outlined"
            label={errors['email'] ? errors['email'].message : 'Email'}
            error={errors['email'] && true}
            {...register('email', {
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Invalid email.',
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="website"
            defaultValue={defaultData?.website || ''}
            variant="outlined"
            label={errors['website'] ? errors['website'].message : 'Website'}
            error={errors['website'] && true}
            {...register('website', {
              pattern: {
                value:
                  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
                message: 'Invalid website url',
              },
            })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LanguageIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
