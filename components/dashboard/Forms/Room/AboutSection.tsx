import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { styles } from '@/components/dashboard/forms/styles';

export default function ({
  register,
  errors,
  roomCategories,
  setValue,
}: {
  register: Function;
  setValue: Function;
  errors: any;
  roomCategories: Array<{
    id: number;
    name: string;
  }>;
}) {
  const [categorySelected, setCategorieSelected] = useState<string>(
    roomCategories[0].name
  );
  const handleCategoryField = (event: SelectChangeEvent) => {
    setCategorieSelected(event.target.value as string);
  };
  useEffect(() => {
    setValue('category', categorySelected);
  }, [categorySelected]);
  return (
    <Box component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        About
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            sx={styles.textField}
            id="name"
            {...register('name', {
              required: 'The name  is required',
              maxLength: {
                value: 50,
                message: 'The name must not exced the 50 character',
              },
            })}
            variant="outlined"
            label={errors['name'] ? errors['name'].message : 'Name/Title'}
            type="text"
            error={errors['name'] ? true : false}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="hotel-type">Category</InputLabel>

            <Select
              labelId="hotel-type"
              label="Category"
              value={categorySelected}
              onChange={handleCategoryField}
              sx={{ textTransform: 'capitalize' }}
            >
              {roomCategories.map((type: { name: string; id: number }) => (
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
        <input type="hidden" {...register('category')} />
      </Grid>

      <TextField
        id="description"
        multiline
        {...register('description', {
          required: 'A description is require',
        })}
        rows={10}
        label={
          errors['description'] ? errors['description'].message : 'Description'
        }
        error={errors['description'] ? true : false}
        variant="outlined"
        sx={styles.textField}
      />
    </Box>
  );
}
