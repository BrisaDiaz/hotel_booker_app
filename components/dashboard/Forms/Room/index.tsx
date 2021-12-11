import React from 'react';
import { useForm } from 'react-hook-form';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import AspectSection from './AspectSection';
import AboutSection from './AboutSection';
import CapacitySection from './CapacitySection';
import FeaturesSection from './FeaturesSection';
import PriceSection from '../PriceSection';

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
    mt: { sm: 2 },
    mb: 5,
    fontWeight: 600,
    opacity: 0.8,
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
};
interface Feature {
  id: number;
  name: string;
}

export default function MultilineTextFields(props: {
  services: Feature[];
  amenities: Feature[];
  roomCategories: Feature[];
  bedTypes: Feature[];
  submitHandler: Function;
}) {
  const matchesSize = useMediaQuery('(min-width:600px)');
  const { services, amenities, roomCategories, submitHandler, bedTypes } =
    props;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = (data: any) => {
    let pickedBedQuantities = bedTypes
      .map((bed) => ({
        type: bed.name,
        quantity: data[bed.name] * 1,
      }))
      .filter((bed) => bed.quantity > 0);

    const variables = {
      beds: pickedBedQuantities,
      services: data.services,
      amenities: data.amenities,
      name: data.name,
      description: data.description,
      smooking: data.smooking,
      freeCancelation: data.freeCancelation,
      category: data.category,
      mts2: data.mts2 * 2,
      mainImage: data.mainImage[0],
      maximunGuests: data.maximunGuests * 1,
      maximunStay: data.maximunNights * 1 || 0,
      minimunStay: data.minimunNights * 1,
      lowestPrice: data.lowestPrice * 1,
      taxesAndCharges: data.taxesAndCharges * 1,
    };

    submitHandler(variables);
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
      <AboutSection
        register={register}
        errors={errors}
        setValue={setValue}
        roomCategories={roomCategories}
      />
      <PriceSection register={register} errors={errors} />
      <CapacitySection register={register} errors={errors} />
      <FeaturesSection
        register={register}
        errors={errors}
        setValue={setValue}
        services={services}
        amenities={amenities}
        bedTypes={bedTypes}
      />

      <AspectSection register={register} errors={errors} />
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
          size={matchesSize ? 'large' : 'medium'}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
