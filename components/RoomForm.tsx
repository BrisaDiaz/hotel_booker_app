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
    pb: 4,
    pt: 2,
    px: { sm: 1 },
  },
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
interface Feature {
  id: number;
  name: string;
}

const BedsSetters = ({
  beds,
  register,
  errors,
}: {
  beds: Feature[];
  register: Function;
  errors: {
    [key: string]: {
      message: string;
    };
  };
}) => {
  return beds.map((bed) => (
    <Box
      key={bed.id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '300px',
        padding: '0 20px',
      }}
    >
      <Typography
        sx={{ mr: 1, width: 'max-content', textTransform: 'capitalize' }}
      >
        {bed.name}
        {' :'}
      </Typography>
      <Box sx={{ width: '100px' }}>
        <TextField
          sx={styles.textField}
          id="bedQuantity"
          defaultValue={0}
          {...register(`${bed.name}`, {
            min: {
              value: 0,
              message: 'Bed quantity must be positive number',
            },
          })}
          variant="outlined"
          label={
            errors[`${bed.name}`] ? errors[`${bed.name}`].message : 'Quantity'
          }
          type="number"
          error={errors[`${bed.name}`] ? true : false}
        />
      </Box>
    </Box>
  ));
};
export default function MultilineTextFields(props: {
  services: Feature[];
  amenities: Feature[];
  roomCategories: Feature[];
  bedTypes: Feature[];
  submitHandler: Function;
}) {
  const defaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDl4inIGpdEJ8gUBHlNiqLGw-9fnI5mdAcKru0oaqoEYUdqdOzB6Xh4UY1OB3XrtonuhU&usqp=CAU';
  const { services, amenities, roomCategories, submitHandler, bedTypes } =
    props;

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
    let pickedBedQuantities = bedTypes
      .map((bed) => ({
        type: bed.name,
        quantity: data[bed.name] * 1,
      }))
      .filter((bed) => bed.quantity > 0);

    const variables = {
      beds: pickedBedQuantities,
      services: servicesSelected,
      amenities: amenitiesSelected,
      name: data.name,
      description: data.description,
      smooking: data.smooking,
      freeCancelation: data.freeCancelation,
      category: categorySelected,
      mts2: data.mts2 * 2,
      mainImage: data.mainImage,
      maximunGuests: data.maximunGuests * 1,
      maximunStay: data.maximunNights * 1 || 0,
      minimunStay: data.minimunNights * 1,
      lowestPrice: data.lowestPrice * 1,
      taxesAndCharges: data.taxesAndCharges * 1,
    };

    submitHandler(variables);
  };
  const handleReset = () => {
    setServicesSelected([]);
    setAmenitiesSelected([]);
    setCategorieSelected('');
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
      <Box component="fieldset" sx={styles.fieldset}>
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
              label={errors['name'] ? errors['name'].message : 'Name/Title'}
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
      </Box>
      <Box component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Details
        </Typography>

        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="lowestPrice"
              defaultValue={0}
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
              defaultValue={0}
              id="taxesAndCharges"
              {...register('taxesAndCharges', {
                required: 'Taxes are required',
                min: {
                  value: 0,
                  message: 'Taxes ammount must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['taxesAndCharges']
                  ? errors['taxesAndCharges'].message
                  : 'Taxes&Charges'
              }
              type="number"
              error={errors['taxesAndCharges'] ? true : false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="minimunNights"
              defaultValue={1}
              {...register('minimunNights', {
                required: 'The minimun staying  is required',
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
                required: 'The mts2 are required',
                min: {
                  value: 0,
                  message: 'Meters must be positive number',
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
          <Grid item xs={12} sm={6} sx={{ width: { md: '50%' } }}>
            <TextField
              sx={styles.textField}
              id="maximunGueststs"
              defaultValue={0}
              {...register('maximunGuests', {
                required: 'The guest limit is required',
                min: {
                  value: 0,
                  message: 'the value must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['maximunGuests']
                  ? errors['maximunGuests'].message
                  : 'Maximun guest'
              }
              type="number"
              error={errors['maximunGuests'] ? true : false}
            />
          </Grid>
        </Grid>
      </Box>

      <Box component="fieldset" sx={styles.fieldset}>
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
        <Box sx={{ m: '10px 0', display: 'flex', flexWrap: 'wrap' }}>
          {BedsSetters({ beds: bedTypes, register, errors })}
        </Box>
        <FormControlLabel
          sx={{ textTransform: 'capitalize' }}
          {...register('freeCancelation')}
          control={<Checkbox />}
          label="free cancelation"
        />
        <FormControlLabel
          sx={{ textTransform: 'capitalize' }}
          {...register('smooking')}
          control={<Checkbox />}
          label="smooking"
        />
      </Box>
      <Box component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Aspect
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="start">
          <Grid item xs={12}>
            <TextField
              id="main-image"
              {...register('mainImage')}
              label={
                errors['mainImage']
                  ? errors['mainImage'].message
                  : 'Main image url'
              }
              type="text"
              error={errors['mainImage'] ? true : false}
              {...register('mainImage', {
                required: 'The Main image is required',
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
      </Box>
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
