import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { styles } from '@/components/dashboard/forms/styles';
import FileInput from '@/components/FileInput'
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'
export default function AspectSection({
  register,
  errors,
  children,
  setError,
  clearErrors,
  resetCount
}: {
  children?: React.ReactNode;
  register:  (fieldName:string,config?:any)=>void;
  errors: any;
  setError:(fieldName:string,error?:any)=>void;
  clearErrors:(fieldName:string)=>void;
  resetCount?:number
}) {
  const defaultImage = 'https://www.grancapitan.com.ar/wp-content/uploads/2014/10/default-img.gif';
  const [frameImage, setFrameImage] = useState<string>(defaultImage);
  const [interiorImage, setInteriorImage] = useState<string>(defaultImage);


  function handleOnChange(changeEvent: any) {

if(!changeEvent.target.files[0]) {
  return  changeEvent.target.name === 'frameImage'? setFrameImage(defaultImage):setInteriorImage(defaultImage);
      
}
const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
 
    if(!allowedExtensions.exec(changeEvent.target.files[0].name)) return setError(changeEvent.target.name,{type:'manual',message:'Invalid image'})
    clearErrors(changeEvent.target.name)
   
    const reader = new FileReader();

    reader.onload = function (onLoadEvent: any) {
     
    changeEvent.target.name === 'frameImage'? setFrameImage(onLoadEvent.target.result):setInteriorImage(onLoadEvent.target.result);
    };
  
    reader.readAsDataURL(changeEvent.target.files[0]);
  }
React.useEffect(() => {
 if(resetCount){
   setFrameImage(defaultImage)
   setInteriorImage(defaultImage);
 }
}, [resetCount])
   const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Aspect
      </Typography>
     <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FileInput 
                resetCount={resetCount}
            label={
              errors['frameImage']?.message
                ? errors['frameImage'].message
                : 'Facade image'
            }
           error={errors['frameImage']?.message ? true : false}
                 sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
           onChange={(e)=>handleOnChange(e)}
           register={register('frameImage', {
              required: 'The facade image is required',
            })
           }
          />
       
        </Grid>
        <Grid item xs={12} sm={6}>
<FileInput 
            resetCount={resetCount}
            label={
              errors['interiorImage']?.message
                ? errors['interiorImage'].message
                : 'Interior image'
            }
           error={errors['interiorImage']?.message ? true : false}
               sx={styles.textField}
            size={isInSmScreen?'medium':"small"}
           onChange={(e)=>handleOnChange(e)}
           register={register('interiorImage', {
              required: 'The facade image is required',
            })
           }
          />
          

       
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center" sx={{ mt: 0, mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              alt="frame image"
              height="250"
              image={frameImage}
              title="frame image"
              onError={() => setFrameImage(defaultImage)}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              alt="Interior image"
              height="250"
              image={interiorImage}
              title="interior image"
              onError={() => setInteriorImage(defaultImage)}
            />
          </Card>
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
}
