import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styles } from '@/components/dashboard/forms/styles';
import { RoomModel, Feature } from '@/interfaces/index';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';

export default function CapacitySection({
  register,
  errors,
  children,
  bedTypes,
  defaultData,
}: {
  defaultData?: RoomModel;
  children?: React.ReactNode;
  bedTypes: Feature[];
  register: (fieldName: string, config?: any) => void;
  errors: any;
}) {
  type DefaultBeds = {
    [key: string]: { quantity: number };
  };
  const defaultBeds: DefaultBeds =
    defaultData && defaultData.beds
      ? defaultData.beds.reduce(
          (
            defaultValues: any,
            bed: { type: keyof DefaultBeds; quantity: number }
          ) => {
            defaultValues[`${bed.type}`] = {
              quantity: bed.quantity,
            };
            return defaultValues;
          },
          {}
        )
      : null;
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Capacity & Stay
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            fullWidth
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="mts2"
            defaultValue={defaultData ? defaultData.mts2 : 1}
            {...register('mts2', {
              required: 'The mts2 are required',
              min: {
                value: 1,
                message: 'Meters must be positive number',
              },
            })}
            inputProps={{ min: 1 }}
            variant="outlined"
            label={errors['mts2'] ? errors['mts2'].message : 'Quadratic Meters'}
            type="number"
            error={errors['mts2'] ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            defaultValue={defaultData ? defaultData.maximumGuests : 1}
            inputProps={{ min: 0 }}
            {...register('maximumGuests', {
              required: 'The guest limit is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['maximumGuests']
                ? errors['maximumGuests'].message
                : 'maximum guest'
            }
            type="number"
            error={errors['maximumGuests'] ? true : false}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            fullWidth
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="minimumNights"
            defaultValue={defaultData ? defaultData.minimumStay : 1}
            {...register('minimumNights', {
              required: 'The minimum staying  is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            inputProps={{ min: 0 }}
            variant="outlined"
            label={
              errors['minimumNights']
                ? errors['minimumNights'].message
                : 'minimum Nights'
            }
            type="number"
            error={errors['minimumNights'] ? true : false}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="maximumNights"
            {...register('maximumNights', {
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            defaultValue={defaultData ? defaultData.maximumStay : ''}
            variant="outlined"
            label={
              errors['maximumNights']
                ? errors['maximumNights'].message
                : 'maximum Nights'
            }
            type="number"
            error={errors['maximumNights'] ? true : false}
            inputProps={{ min: 0 }}
          />
        </Grid>
      </Grid>
      <Box sx={{ m: '10px 0', display: 'flex', flexWrap: 'wrap' }}>
        <BedsInputs
          beds={bedTypes}
          register={register}
          errors={errors}
          defaultBeds={defaultBeds}
        />
      </Box>
      {children}
    </Box>
  );
}
export function BedsInputs({
  beds,
  register,
  errors,
  defaultBeds,
}: {
  defaultBeds: { [key: string]: { quantity: number } } | null;
  beds: Feature[];
  register: (fieldName: string, config?: any) => void;
  errors: {
    [key: string]: {
      message: string;
    };
  };
}) {
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <>
      {beds.map((bed) => (
        <Box
          key={bed.id}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
            padding: '0 20px',
          }}
        >
          <Typography
            sx={{
              mr: 1,
              width: 'max-content',
              textTransform: 'capitalize',
              fontSize: { xs: '14px', sm: '16px' },
            }}
          >
            {bed.name}
            {' :'}
          </Typography>
          <Box sx={{ width: '100px' }}>
            <TextField
              fullWidth
              sx={styles.textField}
              size={isInSmScreen ? 'medium' : 'small'}
              id="bedQuantity"
              defaultValue={
                defaultBeds ? defaultBeds[`${bed.name}`]?.quantity : 0
              }
              inputProps={{ min: 0 }}
              {...register(`${bed.name}`, {
                min: {
                  value: 0,
                  message: 'Bed quantity must be positive number',
                },
              })}
              variant="outlined"
              label={
                errors[`${bed.name}`]
                  ? errors[`${bed.name}`].message
                  : 'Quantity'
              }
              type="number"
              error={errors[`${bed.name}`] ? true : false}
            />
          </Box>
        </Box>
      ))}
    </>
  );
}
