import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';
import TextEditor from '@/components/TextEditor'
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'
export default function PoliciesSection({
  register,
  errors,
  defaultData,
  children,
setValue,
  resetCount
}: {
  children?: React.ReactNode;
  register: (fieldName:string,config?:any)=>void;
  setValue: (fieldName:string,value:any)=>void;
  errors: any;
  defaultData?: any;
  resetCount?:number
}) {

const handlePolicies =(text:string)=>{
setValue('policiesAndRules',text)
}
   const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Policies and Rules
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={ { mb:1}}>
        <Grid item xs={6}>
          <TextField
          
            id="checkInHour"
            label="Checkin hour"
            type="time"
            {...register('checkInHour')}
            variant="outlined"
                  sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={defaultData?.checkInHour || '00:00'}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
                          sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
            variant="outlined"
            id="checkOutHour"
            {...register('checkOutHour')}
            label="Checkout hour"
            type="time"
  
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={defaultData?.checkOutHour || '00:00'}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </Grid>
      </Grid>
<input type="hidden"  {...register('policiesAndRules',{
  require:'The policies and rules are required'
})}/>
   <Box sx={{mb:1}}>
      <TextEditor 
      
        defaultData={defaultData ?defaultData.policiesAndRules:''}
        error={errors['policiesAndRules']? errors['policiesAndRules'].message:''}
        onChange= {handlePolicies}
          resetCount={resetCount}
      placeholder={
          errors['policiesAndRules']
            ? errors['policiesAndRules'].message
            : 'Policies and Rules'
        }/>
        </Box>
      {children}
    </Grid>
  );
}
