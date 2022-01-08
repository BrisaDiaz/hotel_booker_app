import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { RoomModel } from '@/interfaces/index';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { styles } from '@/components/dashboard/forms/styles';
import TextEditor from '@/components/TextEditor'
export default function AboutSection({
  register,
  errors,
  roomCategories,
  setValue,
  children,
  defaultData,
  resetCount
}: {
  defaultData?: RoomModel;
  children?: React.ReactNode;
  register: (fieldName:string,config?:any)=>void;
  setValue: (fieldName:string,value:any)=>void;
  errors: any;
  roomCategories: Array<{
    id: number;
    name: string;
  }>;
      resetCount?:number
}) {
  const [categorySelected, setCategorieSelected] = useState<string>(
   defaultData?defaultData.category: roomCategories[0].name
  );

const handlePolicies =(text:string)=>{
setValue('description',text)
}
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
            defaultValue={defaultData? defaultData.name:''}
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
          <FormControl fullWidth    sx={styles.textField}>
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

       
            <Grid item xs={12} sx={{mt:1}}>
      <input type="hidden"  {...register('description')}/>
   
      <TextEditor 
        resetCount={resetCount}
        defaultData={defaultData ?defaultData.description:''}
        error={errors['description']? errors['description'].message:''}
        onChange= {handlePolicies}
      placeholder={
          errors['description']
            ? errors['description'].message
            : 'Description'
        }/>
      </Grid>
      {children}
    </Box>
  );
}
