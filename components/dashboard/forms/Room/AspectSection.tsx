import React, {  useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { styles } from '@/components/dashboard/forms/styles';
import FileInput from '@/components/FileInput'
export default function AspectSection({
  register,
  setError,
clearErrors,
  errors,
  children,
  resetCount
}: {
  children?: React.ReactNode;
  register: (fieldName:string,config?:any)=>void;
    setError:(fieldName:string,error?:any)=>void;
    clearErrors:(fieldName:string)=>void;
  errors: any;
  resetCount?:number
}) {
  const defaultImage =
    'https://www.grancapitan.com.ar/wp-content/uploads/2014/10/default-img.gif';
  const [mainImage, setMainImage] = useState<string>(defaultImage);

  function handleOnChange(changeEvent: any) {
    if(!changeEvent.target.files[0]) return false

const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
 
    if(!allowedExtensions.exec(changeEvent.target.files[0].name)) return setError(changeEvent.target.name,{type:'manual',message:'Invalid image'})
    clearErrors(changeEvent.target.name)

    const reader = new FileReader();

    reader.onload = function (onLoadEvent: any) {
      setMainImage(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0] );
  }
React.useEffect(() => {
 if(resetCount){
   setMainImage(defaultImage)
 }
}, [resetCount])
  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Aspect
      </Typography>
      <Grid container spacing={{ sm: 2 }} justifyContent="center">
        <Grid item xs={12}>
          <FileInput
      onChange={handleOnChange}
          resetCount={resetCount}
           label={
              errors['mainImage']
                ? errors['mainImage'].message
                : 'Main image'
            }
            sx={styles.textField}
            error={errors['mainImage'] ? true : false}
           register={register('mainImage', {
              required: 'The main image is required',
            })}
          />
         
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 0, mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              alt="frame image"
              height="250"
              image={mainImage}
              title="frame image"
              onError={() => setMainImage(defaultImage)}
            />
          </Card>
        </Grid>
      </Grid>
      {children}
    </Grid>
  );
}
