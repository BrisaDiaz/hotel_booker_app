import React from 'react';

import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { styles } from '@/components/dashboard/forms/styles';
import TextEditor from '@/components/TextEditor'
export default function PoliciesSection({
  register,
  errors,
  defaultData,
  children,
setValue
}: {
  children?: React.ReactNode;
  register: (fieldName:string,config?:any)=>void;
  setValue: (fieldName:string,value:any)=>void;
  errors: any;
  defaultData?: any;
}) {

const handlePolicies =(text:string)=>{
setValue('policiesAndRules',text)
}

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
            variant="outlined"
            id="checkOutHour"
            {...register('checkOutHour')}
            label="Checkout hour"
            type="time"
            sx={styles.textField}
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
   
      <TextEditor 
        defaultData={defaultData ?defaultData.policiesAndRules:''}
        error={errors['policiesAndRules']? errors['policiesAndRules'].message:''}
        onChange= {handlePolicies}
      placeholder={
          errors['policiesAndRules']
            ? errors['policiesAndRules'].message
            : 'Policies and Rules'
        }/>
      {children}
    </Grid>
  );
}
