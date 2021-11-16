import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import Autocomplete from '@mui/material/Autocomplete';
import AutocompleteCheckbox from './AutocompleteCheckbox';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import AddLinkIcon from '@mui/icons-material/AddLink';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const styles = {
  root: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    py: 4,
    px: 1,
  },
  title: {
    mt: 0,
    mb: 4,
    fontWeight: 200,
    fontFamily: 'Raleway',
    textTransform: 'uppercase',
  },
  card: {
    maxWidth: 400,
  },
  groupTitle: {
    fontWeight: 500,
    color: '#484848',
    background: '#fff',
    mt: '-25px',
    px: '10px',
    width: 'max-content',
  },
  fieldset: {
    my: 4,
    pt: 1.5,
    borderRadious: '5px',
  },
  formBottons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: 2,
    mt: 1.5,
  },
  bottons: {
    padding: '10px 40px',
    margin: 0,
  },
  paper: {
    padding: '10px',
  },
  textField: {
    width: '100%',
    my: 1,
  },
  grid: {
    my: 2,
  },
};
type Feature = {
  id: number;
  name: string;
};
export default function MultilineTextFields(props: {
  services: Feature[];
  amenities: Feature[];
  roomCategories: Feature[];
}) {
  const defaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDl4inIGpdEJ8gUBHlNiqLGw-9fnI5mdAcKru0oaqoEYUdqdOzB6Xh4UY1OB3XrtonuhU&usqp=CAU';
  const { services, amenities, roomCategories } = props;

  const matchesSize = useMediaQuery('(min-width:600px)');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [servicesSelected, setServicesSelected] = useState<string[]>([]);
  const [amenitiesSelected, setAmenitiesSelected] = useState<string[]>([]);
  const [categorySelected, setCategorieSelected] = useState<string>(
    roomCategories[0].name
  );
  const [frameImage, setFrameImage] = useState(defaultImage);

  type autocompliteData = { name: string };

  const handleServicesField = (data: autocompliteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleAmenitiesField = (data: autocompliteData[]) => {
    setAmenitiesSelected(getOptionsNames(data));
  };
  const handleCategoryField = (event: SelectChangeEvent) => {
    setCategorieSelected(event.target.value as string);
  };
  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };
  const submitMiddleware = (data) => {
    console.log(data, servicesSelected, amenitiesSelected, categorySelected);
  };
  const handleReset = () => {
    setServicesSelected([]);
    setAmenitiesSelected([]);
    setCategorieSelected([]);
    setFrameImage(defaultImage);
  };
  return (
    <Box
      component="form"
      sx={styles.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitMiddleware)}
    >
      <Typography component="h1" variant="h4" align="center" sx={styles.title}>
        Add a new room template
      </Typography>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          About
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
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
              label={errors['brand'] ? errors['name'].message : 'Name/Title'}
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
        </Grid>

        <TextField
          id="description"
          multiline
          {...register('description', {
            required: 'A description is require',
          })}
          rows={10}
          label={
            errors['description']
              ? errors['description'].message
              : 'Description'
          }
          error={errors['description'] ? true : false}
          variant="outlined"
          sx={styles.textField}
        />
      </Grid>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Details
        </Typography>

        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="lowestPrice"
              {...register('lowestPrice', {
                required: 'The lowest price is required',
                min: {
                  value: 0,
                  message: 'The lowest price must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['lowestPrice']
                  ? errors['lowestPrice'].message
                  : 'Lowest Price'
              }
              type="number"
              error={errors['lowestPrice'] ? true : false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="maximunGues"
              {...register('maximunGues', {
                required: 'The field  is required',
                min: {
                  value: 0,
                  message: 'the value must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['maximunGues']
                  ? errors['maximunGues'].message
                  : 'Maximun guest'
              }
              type="number"
              error={errors['maximunGues'] ? true : false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="minimunNights"
              {...register('minimunNights', {
                required: 'The field  is required',
                min: {
                  value: 0,
                  message: 'the value must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['minimunNights']
                  ? errors['minimunNights'].message
                  : 'Minimun Nights'
              }
              type="number"
              error={errors['minimunNights'] ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="maximunNights"
              {...register('maximunNights', {
                required: 'The field  is required',
                min: {
                  value: 0,
                  message: 'the value must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['maximunNights']
                  ? errors['maximunNights'].message
                  : 'Maximun Nights'
              }
              type="number"
              error={errors['maximunNights'] ? true : false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="mts2"
              {...register('mts2', {
                required: 'The Meters  is required',
                min: {
                  value: 0,
                  message: 'Meters must positive number',
                },
              })}
              variant="outlined"
              label={
                errors['mts2'] ? errors['mts2'].message : 'Quadratic Meters'
              }
              type="number"
              error={errors['mts2'] ? true : false}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Features
        </Typography>

        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleAmenitiesField(data)}
          label="Amenities"
          options={amenities}
          sx={styles.textField}
        />
        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleServicesField(data)}
          label="Services"
          options={services}
          sx={styles.textField}
        />

        <FormControlLabel
          control={<Checkbox {...register('FreeCancelation')} />}
          label="Free Cancelation"
        />
      </Grid>

      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Aspect
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="start">
          <Grid item xs={12}>
            <TextField
              id="frame-image"
              {...register('frameImage')}
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
          <Grid item xs={12}>
            <Card sx={styles.card}>
              <CardMedia
                component="img"
                alt="frame image"
                width="80%"
                image={frameImage}
                onError={() => setFrameImage(defaultImage)}
                title="frame image"
              />
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={styles.formBottons}>
        <Button
          variant="contained"
          color="primary"
          size={matchesSize ? 'large' : 'medium'}
          style={{ color: '#fff' }}
          sx={styles.bottons}
          startIcon={<SaveIcon />}
          type="submit"
        >
          Save
        </Button>
        <Button
          sx={styles.bottons}
          variant="outlined"
          color="primary"
          type="reset"
          onClick={handleReset}
          size={matchesSize ? 'large' : 'medium'}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
