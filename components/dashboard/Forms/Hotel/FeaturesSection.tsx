import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AutocompleteCheckbox  color="secondary"
from '@/components/AutocompleteCheckbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox  color="secondary"
from '@mui/material/Checkbox';

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
type Feature = {
  id: number;
  name: string;
};
export default function ({
  register,
  setValue,
  facilities,
  services,
  activities,
  languages,
}: {
  register: Function;
  setValue: Function;
  services: Feature[];
  activities: Feature[];
  facilities: Feature[];
  languages: Feature[];
}) {
  const [servicesSelected, setServicesSelected] = useState<string[]>([]);
  const [facilitiesSelected, setFacilitiesSelected] = useState<string[]>([]);
  const [activitiesSelected, setActivitiesSelected] = useState<string[]>([]);
  const [languagesSelected, setLanguageSelected] = useState<string[]>([]);

  type autocompliteData = { name: string };

  const handleFacilitiesField = (data: autocompliteData[]) => {
    setFacilitiesSelected(getOptionsNames(data));
  };
  const handleServicesField = (data: autocompliteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleActivitiesField = (data: autocompliteData[]) => {
    setActivitiesSelected(getOptionsNames(data));
  };
  const handleLanguagesField = (data: autocompliteData[]) => {
    setLanguageSelected(getOptionsNames(data));
  };
  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };
  useEffect(() => {
    setValue('services', servicesSelected);
  }, [servicesSelected]);
  useEffect(() => {
    setValue('facilities', facilitiesSelected);
  }, [facilitiesSelected]);
  useEffect(() => {
    setValue('activities', activitiesSelected);
  }, [activitiesSelected]);
  useEffect(() => {
    setValue('languages', languagesSelected);
  }, [languagesSelected]);
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Features
      </Typography>

      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleFacilitiesField(data)}
        label="Facilities"
        options={facilities}
        sx={styles.textField}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleActivitiesField(data)}
        label="Activities"
        options={activities}
        sx={styles.textField}
      />

      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleLanguagesField(data)}
        label="Languages"
        options={languages}
        sx={styles.textField}
      />

      <Grid container spacing={{ sm: 2 }} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} sm={6}>
          <FormGroup sx={{ px: 1 }}>
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('freeCancelation')} />}
              label="Free Cancelation"
            />
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('accessible')} />}
              label="Accessible"
            />
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('familyFriendly')} />}
              label="Family Friendly"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup sx={{ px: 1 }}>
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('petFriendly')} />}
              label="Pet Friendly"
            />
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('smokerFriendly')} />}
              label="Smoker Friendly"
            />
            <FormControlLabel
              control={<Checkbox  color="secondary"
{...register('ecoFriendly')} />}
              label="Eco Friendly"
            />
          </FormGroup>
        </Grid>
        <input type="hidden" {...register('services')} />
        <input type="hidden" {...register('activities')} />
        <input type="hidden" {...register('facilities')} />
        <input type="hidden" {...register('languages')} />
      </Grid>
    </Grid>
  );
}
