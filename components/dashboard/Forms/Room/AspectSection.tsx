import React, { ChangeEvent, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { styles } from '@/components/dashboard/forms/styles';
import type { FileUploadEvent } from '@/interfaces/index';
export default function ({
  register,
  errors,
}: {
  register: Function;
  errors: any;
}) {
  const defaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDl4inIGpdEJ8gUBHlNiqLGw-9fnI5mdAcKru0oaqoEYUdqdOzB6Xh4UY1OB3XrtonuhU&usqp=CAU';
  const [mainImage, setMainImage] = useState<string>(defaultImage);

  function handleOnChange(changeEvent: FileUploadEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent: any) {
      setMainImage(onLoadEvent.target.result);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  return (
    <Grid component="fieldset" sx={styles.fieldset}>
      <Typography component="h3" variant="h6" sx={styles.groupTitle}>
        Aspect
      </Typography>
      <Grid container spacing={{ sm: 2 }} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            id="main-image"
            {...register('mainImage')}
            label={
              errors['mainImage']
                ? errors['mainImage'].message
                : 'Main image url'
            }
            error={errors['mainImage'] ? true : false}
            {...register('mainImage', {
              required: 'The Main image is required',
            })}
            type="file"
            onChange={handleOnChange}
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
    </Grid>
  );
}
