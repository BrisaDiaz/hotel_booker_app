import React from 'react';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import PriceSection from '../PriceSection';
import PoliciesSection from './PoliciesSection';
import FeaturesSection from './FeaturesSection';
import AspectSection from './AspectSection';

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
type Feature = {
  id: number;
  name: string;
};
export default function MultilineTextFields(props: {
  selectedField:
    | 'about'
    | 'contanct'
    | 'price'
    | 'aspect'
    | 'features'
    | 'policies'
    | 'address';
  services?: Feature[];
  activities?: Feature[];
  facilities?: Feature[];
  languages?: Feature[];
  hotelCategories?: Feature[];
  submitHandler: Function;
}) {
  const {
    selectedField,
    services,
    activities,
    facilities,
    languages,
    hotelCategories,
  } = props;

  const matchesSize = useMediaQuery('(min-width:600px)');
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const submitMiddleware = async (data: any, e: any) => {
    e.preventDefault();

    const hotelVariables = {
      name: data?.name,
      telephone: data?.telephone,
      email: data?.email,
      website: data?.website,
      brand: data?.brand,
      checkInHour: data?.checkInHour,
      checkOutHour: data?.checkOutHour,
      lowestPrice: data?.lowestPrice * 1,
      taxesAndCharges: data?.taxesAndCharges * 1,
      description: data?.description,
      policiesAndRules: data?.policiesAndRules,
      frameImage: data?.frameImage[0],
      interiorImage: data?.interiorImage[0],
      facilities: data?.facilities,
      services: data?.services,
      activities: data?.activities,
      languages: data?.languages,
      category: data?.category,
      smokerFriendly: data?.smokerFriendly,
      familyFriendly: data?.familyFriendly,
      petFriendly: data?.petFriendly,
      ecoFriendly: data?.ecoFriendly,
      freeCancelation: data?.freeCancelation,
      accessible: data?.accessible,
      holeAddress: data?.holeAddress,
      country: data?.country,
      city: data?.city,
      postalCode: data?.postalCode,
      administrativeArea: data?.administrativeArea,
      street: data?.street,
    };

    props.submitHandler(hotelVariables);
  };

  return (
    <Box
      component="form"
      sx={styles.root}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitMiddleware)}
    >
      {selectedField === 'about' && hotelCategories && (
        <AboutSection
          register={register}
          setValue={setValue}
          hotelCategories={hotelCategories}
          errors={errors}
        />
      )}
      {selectedField === 'price' && (
        <PriceSection register={register} errors={errors} />
      )}

      <ContactSection register={register} errors={errors} />
      <AddressSection register={register} errors={errors} />
      {selectedField === 'features' &&
        services &&
        languages &&
        activities &&
        facilities && (
          <FeaturesSection
            register={register}
            setValue={setValue}
            services={services}
            languages={languages}
            activities={activities}
            facilities={facilities}
          />
        )}
      {selectedField === 'policies' && (
        <PoliciesSection register={register} errors={errors} />
      )}
      {selectedField === 'aspect' && (
        <AspectSection register={register} errors={errors} />
      )}

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
