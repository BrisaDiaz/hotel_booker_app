import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import AutocompleteCheckbox from '@/components/AutocompleteCheckbox';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { styles } from '@/components/dashboard/forms/styles';
import { RoomModel, Feature } from '@/interfaces/index';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';
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
  register: (fieldName: string, config?: any) => void;
  setValue: (fieldName: string, value: any) => void;
  errors: any;
  services: Feature[];
  amenities: Feature[];

  children?: React.ReactNode;
}) {
  const getOptionsNames = (data: autocompleteData[]): string[] => {
    return data.map((option) => option.name);
  };
  const [servicesSelected, setServicesSelected] = useState<string[]>(
    defaultData?.services ? getOptionsNames(defaultData?.services) : []
  );
  const [amenitiesSelected, setAmenitiesSelected] = useState<string[]>(
    defaultData?.amenities ? getOptionsNames(defaultData?.amenities) : []
  );

  type autocompleteData = { name: string };

  const handleServicesField = (data: autocompleteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleAmenitiesField = (data: autocompleteData[]) => {
    setAmenitiesSelected(getOptionsNames(data));
  };
  useEffect(() => {
    setValue('services', servicesSelected);
  }, [servicesSelected]);
  useEffect(() => {
    setValue('amenities', amenitiesSelected);
  }, [amenitiesSelected]);
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Features
      </Typography>
      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleAmenitiesField(data)}
        label="Amenities"
        options={amenities}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
        defaultValue={defaultData?.amenities || []}
      />
      <AutocompleteCheckbox
        onChange={(data: autocompleteData[]) => handleServicesField(data)}
        label="Services"
        options={services}
        sx={styles.textField}
        size={isInSmScreen ? 'medium' : 'small'}
        defaultValue={defaultData?.services || []}
      />
      <Box sx={{ my: 1 }}>
        <FormControlLabel
          sx={{ textTransform: 'capitalize', span: { fontSize: '14px' } }}
          {...register('freeCancellation')}
          control={
            <Checkbox
              color="secondary"
              size="small"
              defaultChecked={defaultData?.smocking ? true : false}
            />
          }
          label="free cancellation"
        />
        <FormControlLabel
          sx={{ textTransform: 'capitalize', span: { fontSize: '14px' } }}
          {...register('smocking')}
          control={
            <Checkbox
              defaultChecked={defaultData?.smocking ? true : false}
              color="secondary"
              size="small"
            />
          }
          label="smocking"
        />
      </Box>
      <input type="hidden" {...register('services')} />
      <input type="hidden" {...register('amenities')} />
      {children}
    </Box>
  );
}
