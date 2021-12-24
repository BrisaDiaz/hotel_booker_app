import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AutocompleteCheckbox from '@/components/AutocompleteCheckbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styles } from '@/components/dashboard/forms/styles';
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
  defaultData,
  children,
}: {
  children?: React.ReactNode;
  register: Function;
  setValue: Function;
  services: Feature[];
  activities: Feature[];
  facilities: Feature[];
  languages: Feature[];
  defaultData?: any;
}) {
  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };

  const [servicesSelected, setServicesSelected] = useState<string[]>(
    defaultData?.sevices ? getOptionsNames(defaultData?.sevices) : []
  );
  const [facilitiesSelected, setFacilitiesSelected] = useState<string[]>(
    defaultData?.facilities ? getOptionsNames(defaultData?.facilities) : []
  );
  const [activitiesSelected, setActivitiesSelected] = useState<string[]>(
    defaultData?.activities ? getOptionsNames(defaultData?.activities) : []
  );
  const [languagesSelected, setLanguageSelected] = useState<string[]>(
    defaultData?.languages ? getOptionsNames(defaultData?.languages) : []
  );

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
        defaultValue={defaultData?.facilities || []}
        sx={styles.textField}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
        defaultValue={defaultData?.services || []}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleActivitiesField(data)}
        label="Activities"
        options={activities}
        sx={styles.textField}
        defaultValue={defaultData?.activities || []}
      />

      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleLanguagesField(data)}
        label="Languages"
        options={languages}
        sx={styles.textField}
        defaultValue={defaultData?.languages || []}
      />

      <Grid container spacing={{ sm: 2 }} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} sm={6}>
          <FormGroup sx={{ px: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  inputProps={{
                    defaultChecked: defaultData?.features?.freeCancelation
                      ? true
                      : false,
                  }}
                  {...register('freeCancelation')}
                />
              }
              label="Free Cancelation"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  {...register('accessible')}
                  inputProps={{
                    defaultChecked: defaultData?.features?.accessible
                      ? true
                      : false,
                  }}
                />
              }
              label="Accessible"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  inputProps={{
                    defaultChecked: defaultData?.features?.familyFriendly
                      ? true
                      : false,
                  }}
                  {...register('familyFriendly')}
                />
              }
              label="Family Friendly"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup sx={{ px: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    defaultChecked: defaultData?.features?.freeCancelation
                      ? true
                      : false,
                  }}
                  color="secondary"
                  {...register('petFriendly')}
                />
              }
              label="Pet Friendly"
            />
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    defaultChecked: defaultData?.features?.smokerFriendly
                      ? true
                      : false,
                  }}
                  color="secondary"
                  {...register('smokerFriendly')}
                />
              }
              label="Smoker Friendly"
            />
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{
                    defaultChecked: defaultData?.features?.ecoFriendly
                      ? true
                      : false,
                  }}
                  color="secondary"
                  {...register('ecoFriendly')}
                />
              }
              label="Eco Friendly"
            />
          </FormGroup>
        </Grid>
        <input type="hidden" {...register('services')} />
        <input type="hidden" {...register('activities')} />
        <input type="hidden" {...register('facilities')} />
        <input type="hidden" {...register('languages')} />
      </Grid>
      {children}
    </Grid>
  );
}
