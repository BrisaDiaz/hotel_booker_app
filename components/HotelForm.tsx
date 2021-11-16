import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import LanguageIcon from '@mui/icons-material/Language';
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
  activities: Feature[];
  facilities: Feature[];
  languages: Feature[];
  hotelCategories: Feature[];
  submitHandler: Function;
}) {
  const { services, activities, facilities, languages, hotelCategories } =
    props;
  const dafaultImage =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDl4inIGpdEJ8gUBHlNiqLGw-9fnI5mdAcKru0oaqoEYUdqdOzB6Xh4UY1OB3XrtonuhU&usqp=CAU';
  const matchesSize = useMediaQuery('(min-width:600px)');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const [servicesSelected, setServicesSelected] = useState<string[]>([]);
  const [facilitiesSelected, setFacilitiesSelected] = useState<string[]>([]);
  const [activitiesSelected, setActivitiesSelected] = useState<string[]>([]);
  const [languagesSelected, setLanguageSelected] = useState<string[]>([]);
  const [categorySelected, setCategorieSelected] = useState<string>(
    hotelCategories[0].name
  );
  const [frameImage, setFrameImage] = useState<string>(dafaultImage);
  const [interiorImage, setInteriorImage] = useState<string>(dafaultImage);

  type autocompliteData = { name: string };

  const handleFacilitiesField = (data: autocompliteData[]) => {
    setFacilitiesSelected(getOptionsNames(data));
  };
  const handleServicesField = (data: autocompliteData[]) => {
    setServicesSelected(getOptionsNames(data));
  };
  const handleActivitiesField = (data: autocompliteData[]) => {
    setActivitiesSelected(getOptionsNames(data));
  };
  const handleLanguagesField = (data: autocompliteData[]) => {
    setLanguageSelected(getOptionsNames(data));
  };
  const getOptionsNames = (data: autocompliteData[]): string[] => {
    return data.map((option) => option.name);
  };

  const handleCategoryField = (event: SelectChangeEvent) => {
    setCategorieSelected(event.target.value as string);
  };
  const submitMiddleware = async (data: any, e: any) => {
    e.preventDefault();

    const hotelVariables = {
      name: data.name,
      telephone: data.telephone,
      email: data.email,
      website: data.website,
      brand: data.brand,
      checkInHour: data.checkInHour,
      checkOutHour: data.checkOutHour,
      lowestPrice: data.lowestPrice * 1,
      taxesAndCharges: data.taxesAndCharges * 1,
      description: data.description,
      policiesAndRules: data.policiesAndRules,
      frameImage: data.frameImage,
      interiorImage: data.interiorImage,
      facilities: facilitiesSelected,
      services: servicesSelected,
      activities: activitiesSelected,
      languages: languagesSelected,
      category: categorySelected,
      smokerFriendly: data.smokerFriendly,
      familyFriendly: data.familyFriendly,
      petFriendly: data.petFriendly,
      ecoFriendly: data.ecoFriendly,
      cancelationFree: data.cancelationFree,
      accessible: data.accessible,
      holeAddress: data.holeAddress,
      country: data.country,
      city: data.city,
      postalCode: data.postalCode,
      administrativeArea: data.administrativeArea,
      street: data.street,
    };

    props.submitHandler(hotelVariables);
  };
  const handleReset = () => {
    setFrameImage(dafaultImage);
    setInteriorImage(dafaultImage);
    handleFacilitiesField([]);
    handleServicesField([]);
    handleActivitiesField([]);
    handleLanguagesField([]);
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
        Add a new hotel
      </Typography>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          About
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              label={errors['name'] ? errors['name'].message : 'name'}
              type="text"
              error={errors['name'] ? true : false}
              {...register('name', {
                required: 'The name  is required',
                maxLength: {
                  value: 50,
                  message: 'The name must not exced the 50 character',
                },
              })}
              variant="outlined"
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="brand"
              {...register('brand', {
                required: 'The brand  is required',
                maxLength: {
                  value: 50,
                  message: 'The brand name must not exced the 50 character',
                },
              })}
              variant="outlined"
              label={errors['brand'] ? errors['brand'].message : 'Brand'}
              type="text"
              error={errors['brand'] ? true : false}
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
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
                {hotelCategories.map((type: { name: string; id: number }) => (
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
          rows={8}
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
          Prices
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
                  message: 'The ammount must be a positive number',
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
              id="taxesAndCharges"
              {...register('taxesAndCharges', {
                required: 'The lowest price is required',
                min: {
                  value: 0,
                  message: 'The ammount must be a positive number',
                },
              })}
              variant="outlined"
              label={
                errors['taxesAndCharges']
                  ? errors['taxesAndCharges'].message
                  : 'Taxes And Charges'
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
        </Grid>
      </Grid>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Contact
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              id="telephone"
              type="tel"
              label={
                errors['telephone'] ? errors['telephone'].message : 'Telephone'
              }
              {...register('telephone', {
                required: 'The telephone number is required',
                minLength: {
                  value: 9,
                  message: 'Invalid telephone number',
                },
                maxLength: {
                  value: 20,
                  message: 'Invalid telephone number',
                },
              })}
              error={errors['telephone'] ? true : false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CallOutlinedIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={styles.textField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="email"
              type="email"
              variant="outlined"
              label={errors['email'] ? errors['email'].message : 'Email'}
              error={errors['email'] && true}
              {...register('email', {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: 'Invalid email.',
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="website"
              variant="outlined"
              label={errors['website'] ? errors['website'].message : 'Website'}
              error={errors['website'] && true}
              {...register('website', {
                pattern: {
                  value:
                    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
                  message: 'Invalid website url',
                },
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LanguageIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Address
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              id="hole-address"
              type="text"
              {...register('holeAddress', {
                required: 'The hole address is required',
                maxLength: {
                  value: 100,
                  message: 'The address must not exced the 50 character',
                },
              })}
              label={
                errors['holeAddress']
                  ? errors['holeAddress'].message
                  : 'Hole Address'
              }
              error={errors['holeAddress'] ? true : false}
              sx={styles.textField}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="country"
              label={errors['country'] ? errors['country'].message : 'Country'}
              error={errors['country'] ? true : false}
              {...register('country', {
                maxLength: {
                  value: 25,
                  message: 'The address must not exced the 20 character',
                },
              })}
              sx={styles.textField}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="postalCode"
              type="text"
              label={
                errors['postalCode']
                  ? errors['postalCode'].message
                  : 'Zip/Postal code'
              }
              error={errors['postalCode'] ? true : false}
              {...register('postalCode', {
                required: 'The Postal code is required',
                maxLength: {
                  value: 10,
                  message: 'The Postal code must not exced the 10 character',
                },
              })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="administrativeArea"
              label={
                errors['administrativeArea']
                  ? errors['administrativeArea'].message
                  : 'State/Region/Province'
              }
              error={errors['administrativeArea'] ? true : false}
              {...register('administrativeArea', {
                required: 'The field is required',
                maxLength: {
                  value: 25,
                  message:
                    'The administrative Area  must not exced the 10 character',
                },
              })}
              type="text"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="city"
              label={errors['city'] ? errors['city'].message : 'City'}
              error={errors['city'] ? true : false}
              {...register('city', {
                maxLength: {
                  value: 25,
                  message: 'The city name must not exced the 10 character',
                },
              })}
              variant="outlined"
              type="text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={styles.textField}
              id="street"
              type="text"
              label={errors['street'] ? errors['street'].message : 'Street'}
              error={errors['street'] ? true : false}
              {...register('street', {
                required: 'The street name and nº is required',
                maxLength: {
                  value: 25,
                  message: 'The street  must not exced the 25 character',
                },
              })}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Features
        </Typography>

        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleFacilitiesField(data)}
          label="Facilities"
          options={facilities}
          value={facilitiesSelected}
          sx={styles.textField}
        />
        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleServicesField(data)}
          label="Services"
          options={services}
          value={servicesSelected}
          sx={styles.textField}
        />
        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleActivitiesField(data)}
          label="Activities"
          options={activities}
          value={activitiesSelected}
          sx={styles.textField}
        />

        <AutocompleteCheckbox
          onChange={(data: autocompliteData[]) => handleLanguagesField(data)}
          label="Languages"
          options={languages}
          value={languagesSelected}
          sx={styles.textField}
        />

        <Grid
          container
          spacing={matchesSize ? 2 : 0}
          alignItems="center"
          sx={{ mb: 1.5 }}
        >
          <Grid item xs={12} sm={6}>
            <FormGroup sx={{ px: 1 }}>
              <FormControlLabel
                control={<Checkbox {...register('cancelationFree')} />}
                label="Free Cancelation"
              />
              <FormControlLabel
                control={<Checkbox {...register('accessible')} />}
                label="Accessible"
              />
              <FormControlLabel
                control={<Checkbox {...register('familyFriendly')} />}
                label="Family Friendly"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormGroup sx={{ px: 1 }}>
              <FormControlLabel
                control={<Checkbox {...register('petFriendly')} />}
                label="Pet Friendly"
              />
              <FormControlLabel
                control={<Checkbox {...register('smokerFriendly')} />}
                label="Smoker Friendly"
              />
              <FormControlLabel
                control={<Checkbox {...register('ecoFriendly')} />}
                label="Eco Friendly"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Policies and Rules
        </Typography>

        <Grid container spacing={2} alignItems="center">
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
              defaultValue="00:00"
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
              defaultValue="00:00"
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </Grid>
        </Grid>

        <TextField
          id="policies"
          {...register('policiesAndRules', {
            required: 'The policies and rules are required',
          })}
          label={
            errors['policiesAndRules']
              ? errors['policiesAndRules'].message
              : 'Policies and Rules'
          }
          error={errors['policiesAndRules'] && true}
          multiline
          rows={8}
          variant="outlined"
          sx={styles.textField}
        />
      </Grid>
      <Grid component="fieldset" sx={styles.fieldset}>
        <Typography component="h3" variant="h6" sx={styles.groupTitle}>
          Aspect
        </Typography>
        <Grid container spacing={matchesSize ? 2 : 0} alignItems="center">
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
