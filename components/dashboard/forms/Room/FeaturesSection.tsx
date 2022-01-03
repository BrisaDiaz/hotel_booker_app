 import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import AutocompleteCheckbox from '@/components/AutocompleteCheckbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styles } from '@/components/dashboard/forms/styles';
import { RoomModel, Feature } from '@/interfaces/index';

export default function FeaturesSection({
  register,
  errors,
  services,
  amenities,
  setValue,

  children,
  defaultData,
}: {
  defaultData?: RoomModel;
  register: (fieldName:string,config?:any)=>void;
  setValue: (fieldName:string,value:any)=>void;
  errors: any;
  services: Feature[];
  amenities: Feature[];

  children?: React.ReactNode;
}) {
  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };
  const [servicesSelected, setServicesSelected] = useState<string[]>(
    defaultData?.services ? getOptionsNames(defaultData?.services) : []
  );
  const [amenitiesSelected, setAmenitiesSelected] = useState<string[]>(
    defaultData?.amenities ? getOptionsNames(defaultData?.amenities) : []
  );

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
        defaultValue={defaultData?.amenities || []}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompliteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
        defaultValue={defaultData?.services || []}
      />
      <Box sx={{ my: 1 }}>
        <FormControlLabel
          sx={{ textTransform: 'capitalize' }}
          {...register('freeCancelation')}
          control={
            <Checkbox
              color="secondary"
              inputProps={{
                defaultChecked: defaultData?.freeCancelation ? true : false,
              }}
            />
          }
          label="free cancelation"
        />
        <FormControlLabel
          sx={{ textTransform: 'capitalize' }}
          {...register('smooking')}
          control={
            <Checkbox
              color="secondary"
              inputProps={{
                defaultChecked: defaultData?.smooking ? true : false,
              }}
            />
          }
          label="smooking"
        />
      </Box>
      <input type="hidden" {...register('services')} />
      <input type="hidden" {...register('amenities')} />
      {children}
    </Box>
  );
}
