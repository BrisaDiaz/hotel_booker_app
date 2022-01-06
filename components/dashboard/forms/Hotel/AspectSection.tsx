import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { styles } from '@/components/dashboard/forms/styles';
;
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
console.log(changeEvent )
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

  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Aspect
      </Typography>
      <Grid container spacing={{ sm: 2 }} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            id="frame-image"
            label={
              errors['frameImage']?.message
                ? errors['frameImage'].message
                : 'Facade image'
            }
            type="file"
            error={errors['frameImage']?.message ? true : false}
            {...register('frameImage', {
              required: 'The facade image is required',
            })}
            onChange={(e)=>handleOnChange(e)}
            variant="outlined"
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileUploadOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="interior-image"
            label={
              errors['interiorImage']
                ? errors['interiorImage'].message
                : 'Interior image'
            }
            type="file"
            error={errors['interiorImage'] ? true : false}
            {...register('interiorImage', {
              required: 'The interior image is required',
            })}
      
            onChange={(e)=>handleOnChange(e)}
            variant="outlined"
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileUploadOutlinedIcon />
                </InputAdornment>
              ),
            }}
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
