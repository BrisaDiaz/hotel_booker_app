import React from 'react';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import PriceSection from '../PriceSection';
import PoliciesSection from './PoliciesSection';
import FeaturesSection from './FeaturesSection';
import AspectSection from './AspectSection';
import { styles } from '@/components/dashboard/forms/styles';
import FormBottons from '../FormBottons';
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

  const matchesSize = useMediaQuery('(min-width:600px)');
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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
      frameImage: data.frameImage[0],
      interiorImage: data.interiorImage[0],
      facilities: data.facilities,
      services: data.services,
      activities: data.activities,
      languages: data.languages,
      category: data.category,
      smokerFriendly: data.smokerFriendly,
      familyFriendly: data.familyFriendly,
      petFriendly: data.petFriendly,
      ecoFriendly: data.ecoFriendly,
      freeCancelation: data.freeCancelation,
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
      <AboutSection
        register={register}
        setValue={setValue}
        hotelCategories={hotelCategories}
        errors={errors}
      />
      <PriceSection register={register} errors={errors} />
      <ContactSection register={register} errors={errors} />
      <AddressSection register={register} errors={errors} />
      <FeaturesSection
        register={register}
        setValue={setValue}
        services={services}
        languages={languages}
        activities={activities}
        facilities={facilities}
      />
      <PoliciesSection register={register} errors={errors} />
      <AspectSection register={register} errors={errors} />

      <FormBottons />
    </Box>
  );
}
