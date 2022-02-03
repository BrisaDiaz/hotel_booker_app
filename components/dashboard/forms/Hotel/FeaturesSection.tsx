import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AutocompleteCheckbox from '@/components/AutocompleteCheckbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styles } from '@/components/dashboard/forms/styles';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';
type Feature = {
  id: number;
  name: string;
};
export default function FeaturesSection({
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
  register: (fieldName: string, config?: any) => void;
  setValue: (fieldName: string, value: any) => void;
  services: Feature[];
  activities: Feature[];
  facilities: Feature[];
  languages: Feature[];
  defaultData?: any;
}) {
  const getOptionsNames = (data: autocompleteData[]): string[] => {
    return data.map((option) => option.name);
  };

  const [servicesSelected, setServicesSelected] = useState<string[]>(
    defaultData?.services ? getOptionsNames(defaultData?.services) : []
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

  type autocompleteData = { name: string };

  const handleFacilitiesField = (data: autocompleteData[]) => {
    setFacilitiesSelected(getOptionsNames(data));
  };
  const handleServicesField = (data: autocompleteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleActivitiesField = (data: autocompleteData[]) => {
    setActivitiesSelected(getOptionsNames(data));
  };
  const handleLanguagesField = (data: autocompleteData[]) => {
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
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Features
      </Typography>

      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleFacilitiesField(data)}
        label="Facilities"
        options={facilities}
        defaultValue={defaultData?.facilities || []}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
        defaultValue={defaultData?.services || []}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleActivitiesField(data)}
        label="Activities"
        options={activities}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
        defaultValue={defaultData?.activities || []}
      />

      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleLanguagesField(data)}
        label="Languages"
        options={languages}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
        defaultValue={defaultData?.languages || []}
      />

      <Grid container spacing={{ sm: 2 }} alignItems="center" sx={{ mb: 1.5 }}>
        <Grid item xs={12} sm={6}>
          <FormGroup sx={{ px: 1, '& span': { fontSize: '14px' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="secondary"
                  defaultChecked={defaultData?.smocking ? true : false}
                  {...register('freeCancellation')}
                />
              }
              label="Free Cancellation"
            />
            <FormControlLabel
              control={
                <Checkbox
                  color="secondary"
                  size="small"
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
                  size="small"
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
          <FormGroup sx={{ px: 1, '& span': { fontSize: '14px' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  defaultChecked={defaultData?.smocking ? true : false}
                  color="secondary"
                  {...register('petFriendly')}
                />
              }
              label="Pet Friendly"
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
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
                  size="small"
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
