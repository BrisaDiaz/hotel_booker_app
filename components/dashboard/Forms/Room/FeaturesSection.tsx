import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AutocompleteCheckbox from '@/components/AutocompleteCheckbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styles } from '@/components/dashboard/forms/styles';

type Feature = {
  id: number;
  name: string;
};
export function BedsInputs({
  beds,
  register,
  errors,
}: {
  beds: Feature[];
  register: Function;
  errors: {
    [key: string]: {
      message: string;
    };
  };
}) {
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
            sx={{ mr: 1, width: 'max-content', textTransform: 'capitalize' }}
          >
            {bed.name}
            {' :'}
          </Typography>
          <Box sx={{ width: '100px' }}>
            <TextField
              sx={styles.textField}
              id="bedQuantity"
              defaultValue={0}
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
export default function ({
  register,
  errors,
  services,
  amenities,
  setValue,
  bedTypes,
}: {
  register: Function;
  setValue: Function;
  errors: any;
  services: Feature[];
  amenities: Feature[];
  bedTypes: Feature[];
}) {
  const [servicesSelected, setServicesSelected] = useState<string[]>([]);
  const [amenitiesSelected, setAmenitiesSelected] = useState<string[]>([]);

  type autocompliteData = { name: string };

  const handleServicesField = (data: autocompliteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleAmenitiesField = (data: autocompliteData[]) => {
    setAmenitiesSelected(getOptionsNames(data));
  };
  useEffect(() => {
    setValue('services', servicesSelected);
  }, [servicesSelected]);
  useEffect(() => {
    setValue('amenities', amenitiesSelected);
  }, [amenitiesSelected]);

  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Features
      </Typography>
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleAmenitiesField(data)}
        label="Amenities"
        options={amenities}
        sx={styles.textField}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
      />
      <Box sx={{ m: '10px 0', display: 'flex', flexWrap: 'wrap' }}>
        <BedsInputs beds={bedTypes} register={register} errors={errors} />
      </Box>
      <FormControlLabel
        sx={{ textTransform: 'capitalize' }}
        {...register('freeCancelation')}
        control={<Checkbox color="secondary" />}
        label="free cancelation"
      />
      <FormControlLabel
        sx={{ textTransform: 'capitalize' }}
        {...register('smooking')}
        control={<Checkbox />}
        label="smooking"
      />
      <input type="hidden" {...register('services')} />
      <input type="hidden" {...register('amenities')} />
    </Box>
  );
}
