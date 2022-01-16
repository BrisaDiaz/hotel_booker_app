import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styles } from '@/components/dashboard/forms/styles';
import { RoomModel, Feature } from '@/interfaces/index';
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'

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
  register: (fieldName:string,config?:any)=>void;
  errors: any;
}) {
  type DefaultBeds = {
    [key: string]: { quantity: number };
  };
  const defaultBeds: DefaultBeds =
    defaultData && defaultData.beds
      ? defaultData.beds.reduce(
          (
            defaulValues: any,
            bed: { type: keyof DefaultBeds; quantity: number }
          ) => {
            defaulValues[`${bed.type}`] = {
              quantity: bed.quantity,
            };
            return defaulValues;
          },
          {}
        )
      : null;
    const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Capacity & Stay
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField fullWidth 
                    sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
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
        <Grid item xs={6} >
          <TextField fullWidth 
                   sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
            id="maximunGueststs"
            defaultValue={defaultData ? defaultData.maximunGuests : 1}
            inputProps={{ min: 0 }}
            {...register('maximunGuests', {
              required: 'The guest limit is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            variant="outlined"
            label={
              errors['maximunGuests']
                ? errors['maximunGuests'].message
                : 'Maximun guest'
            }
            type="number"
            error={errors['maximunGuests'] ? true : false}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item  xs={6}>
          <TextField fullWidth 
               sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
            id="minimunNights"
            defaultValue={defaultData ? defaultData.minimunStay : 1}
            {...register('minimunNights', {
              required: 'The minimun staying  is required',
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            inputProps={{ min: 0 }}
            variant="outlined"
            label={
              errors['minimunNights']
                ? errors['minimunNights'].message
                : 'Minimun Nights'
            }
            type="number"
            error={errors['minimunNights'] ? true : false}
          />
        </Grid>
        <Grid item  xs={6}>
          <TextField fullWidth 
                   sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
            id="maximunNights"
            {...register('maximunNights', {
              min: {
                value: 0,
                message: 'the value must be a positive number',
              },
            })}
            defaultValue={defaultData ? defaultData.maximunStay : ''}
            variant="outlined"
            label={
              errors['maximunNights']
                ? errors['maximunNights'].message
                : 'Maximun Nights'
            }
            type="number"
            error={errors['maximunNights'] ? true : false}
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
 register: (fieldName:string,config?:any)=>void;
  errors: {
    [key: string]: {
      message: string;
    };
  };
}) {
    const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
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
            sx={{ mr: 1, width: 'max-content', textTransform: 'capitalize' ,fontSize:{xs:'14px',sm:'16px'}}}
          >
            {bed.name}
            {' :'}
          </Typography>
          <Box sx={{ width: '100px' }}>
            <TextField fullWidth 
                      sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
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
