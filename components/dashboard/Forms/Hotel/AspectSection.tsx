import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import InputAdornment from '@mui/material/InputAdornment';

import AddLinkIcon from '@mui/icons-material/AddLink';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

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
  const dafaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDl4inIGpdEJ8gUBHlNiqLGw-9fnI5mdAcKru0oaqoEYUdqdOzB6Xh4UY1OB3XrtonuhU&usqp=CAU';
  const [frameImage, setFrameImage] = useState<string>(dafaultImage);
  const [interiorImage, setInteriorImage] = useState<string>(dafaultImage);
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
              errors['frameImage']
                ? errors['frameImage'].message
                : 'Frame image url'
            }
            type="text"
            error={errors['frameImage'] ? true : false}
            {...register('frameImage', {
              required: 'The frame image is required',
            })}
            onChange={(e) => setFrameImage(e.target.value)}
            variant="outlined"
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddLinkIcon />
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
                : 'Interior image url'
            }
            type="text"
            error={errors['interiorImage'] ? true : false}
            {...register('interiorImage', {
              required: 'The interior image is required',
            })}
            onChange={(e) => setInteriorImage(e.target.value)}
            variant="outlined"
            sx={styles.textField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AddLinkIcon />
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
              onError={() => setFrameImage(dafaultImage)}
              title="frame image"
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
              onError={() => setInteriorImage(dafaultImage)}
              title="interior image"
            />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
