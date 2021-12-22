import React from 'react';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import PriceSection from '../PriceSection';
import PoliciesSection from './PoliciesSection';
import FeaturesSection from './FeaturesSection';
import AspectSection from './AspectSection';
import FormBottons from '../FormBottons';
import { Hotel } from '@/interfaces/index';
import { styles } from '@/components/dashboard/forms/styles';
type Feature = {
  id: number;
  name: string;
};
type FieldToEdit =
  | 'about'
  | 'contact'
  | 'price'
  | 'aspect'
  | 'features'
  | 'policies'
  | 'address'
  | '';
export default function MultilineTextFields(props: {
  hotel: Hotel;
  toEditField: FieldToEdit;
  services: Feature[] | [];
  activities: Feature[] | [];
  facilities: Feature[] | [];
  languages: Feature[] | [];
  hotelCategories: Feature[] | [];
  submitHandler: Function;
  abortHandler: Function;
}) {
  const {
    hotel,
    toEditField,
    services,
    activities,
    facilities,
    languages,
    hotelCategories,
    abortHandler,
  } = props;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const submitMiddleware = (data: any, e: any) => {
    let variables: { [key: string]: number | string | File };

    if (toEditField === 'policies') {
      variables = {
        checkInHour: data?.checkInHour,
        checkOutHour: data?.checkOutHour,
        policiesAndRules: data?.policiesAndRules,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'address') {
      variables = {
        holeAddress: data?.holeAddress,
        country: data?.country,
        city: data?.city,
        postalCode: data?.postalCode,
        administrativeArea: data?.administrativeArea,
        street: data?.street,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'about') {
      variables = {
        name: data?.name,

        brand: data?.brand,

        description: data?.description,

        category: data?.category,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'contact') {
      variables = {
        telephone: data?.telephone,
        email: data?.email,
        website: data?.website,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'price') {
      variables = {
        lowestPrice: data?.lowestPrice * 1,
        taxesAndCharges: data?.taxesAndCharges * 1,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'aspect') {
      variables = {
        frameImage: data?.frameImage ? data?.frameImage[0] : null,
        interiorImage: data?.interiorImage ? data?.interiorImage[0] : null,
      };
      return props.submitHandler(variables);
    }
    if (toEditField === 'features') {
      variables = {
        facilities: data?.facilities,
        services: data?.services,
        activities: data?.activities,
        languages: data?.languages,
        smokerFriendly: data?.smokerFriendly,
        familyFriendly: data?.familyFriendly,
        petFriendly: data?.petFriendly,
        ecoFriendly: data?.ecoFriendly,
        freeCancelation: data?.freeCancelation,
        accessible: data?.accessible,
      };
      return props.submitHandler(variables);
    }
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
        Edit {hotel.name}
      </Typography>

      {toEditField === 'about' && (
        <AboutSection
          register={register}
          setValue={setValue}
          hotelCategories={hotelCategories}
          errors={errors}
          defaultData={hotel}
        >
          <FormBottons onAbort={abortHandler} />
        </AboutSection>
      )}
      {toEditField === 'price' && (
        <PriceSection register={register} errors={errors} defaultData={hotel}>
          <FormBottons onAbort={abortHandler} />
        </PriceSection>
      )}
      {toEditField === 'contact' && (
        <ContactSection register={register} errors={errors} defaultData={hotel}>
          <FormBottons onAbort={abortHandler} />
        </ContactSection>
      )}
      {toEditField === 'address' && (
        <AddressSection register={register} errors={errors} defaultData={hotel}>
          <FormBottons onAbort={abortHandler} />
        </AddressSection>
      )}
      {toEditField === 'features' && (
        <FeaturesSection
          register={register}
          setValue={setValue}
          services={services}
          languages={languages}
          activities={activities}
          facilities={facilities}
          defaultData={hotel}
        >
          <FormBottons onAbort={abortHandler} />
        </FeaturesSection>
      )}
      {toEditField === 'policies' && (
        <PoliciesSection
          register={register}
          errors={errors}
          defaultData={hotel}
        >
          <FormBottons onAbort={abortHandler} />
        </PoliciesSection>
      )}
      {toEditField === 'aspect' && (
        <AspectSection register={register} errors={errors}>
          <FormBottons onAbort={abortHandler} />
        </AspectSection>
      )}
    </Box>
  );
}
