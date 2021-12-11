import React, { ChangeEvent, useState } from 'react';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import InputAdornment from '@mui/material/InputAdornment';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

const styles = {
  title: {
    mb: 5,
    fontWeight: 600,
    opacity: 0.8,
  },
  card: {
    maxWidth: 400,
    mb: 1,
    mx: 'auto',
  },
  groupTitle: {
    fontWeight: 500,
    color: '#484848',
    background: '#fff',
    mb: '10px',
    px: '10px',
    width: 'max-content',
  },
  fieldset: {
    my: 4,
    pt: 1.5,
    borderRadius: 5,
    border: '1px solid  rgb(0 0 0 / 10%)',
    padding: { xs: '15px', sm: '20px', md: '25px ' },
    background: '#fff',
    boxShadow: '1px 5px 32px -12px rgb(0 0 0 / 30%)',
  },

  textField: {
    width: '100%',
    my: 1,
  },
};
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

  function handleOnChange(changeEvent: ChangeEvent) {
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
