import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { styles } from '@/components/dashboard/forms/styles';
import TextEditor from '@/components/TextEditor';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';
export default function AboutSection({
  register,
  errors,
  setValue,
  hotelCategories,
  defaultData,
  children,
  resetCount,
}: {
  children?: React.ReactNode;
  register: (fieldName: string, config?: any) => void;
  resetCount?: number;
  setValue: (fieldName: string, value: any) => void;
  errors: any;
  defaultData?: any;
  hotelCategories: Array<{ id: number; name: string }>;
}) {
  const [categorySelected, setCategorySelected] = useState<string>(
    defaultData?.category || hotelCategories[0]?.name
  );

  const handlePolicies = (text: string) => {
    setValue('description', text);
  };
  const handleCategoryField = (event: SelectChangeEvent) => {
    setCategorySelected(event.target.value as string);
  };
  useEffect(() => {
    setValue('category', categorySelected);
  }, [categorySelected]);
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        About
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            id="name"
            label={errors['name'] ? errors['name'].message : 'Name'}
            type="text"
            error={errors['name'] ? true : false}
            {...register('name', {
              required: 'The name  is required',
              maxLength: {
                value: 50,
                message: 'The name must not exceed the 50 character',
              },
            })}
            variant="outlined"
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            defaultValue={defaultData?.name || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            size={isInSmScreen ? 'medium' : 'small'}
            id="brand"
            {...register('brand', {
              required: 'The brand  is required',
              maxLength: {
                value: 50,
                message: 'The brand name must not exceed the 50 character',
              },
            })}
            defaultValue={defaultData?.brand || ''}
            variant="outlined"
            label={errors['brand'] ? errors['brand'].message : 'Brand'}
            type="text"
            error={errors['brand'] ? true : false}
          />
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={styles.textField}>
            <InputLabel id="hotel-type">Category</InputLabel>

            <Select
              labelId="hotel-type"
              label="Category"
              value={categorySelected}
              onChange={handleCategoryField}
              size={isInSmScreen ? 'medium' : 'small'}
              sx={{ textTransform: 'capitalize', ...styles.textField }}
            >
              {hotelCategories.map((type: { name: string; id: number }) => (
                <MenuItem
                  key={type.id}
                  value={type.name}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 1 }}>
          <input
            type="hidden"
            {...register('description', {
              require: 'A description is required',
            })}
          />

          <TextEditor
            resetCount={resetCount}
            defaultData={defaultData ? defaultData.description : ''}
            error={errors['description'] ? errors['description'].message : ''}
            onChange={handlePolicies}
            placeholder={
              errors['description']
                ? errors['description'].message
                : 'Description'
            }
          />
        </Grid>
      </Grid>

      {children}
    </Box>
  );
}
