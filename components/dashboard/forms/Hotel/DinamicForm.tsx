import React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import AddressSection from './AddressSection';
import PriceSection from '../PriceSection';
import PoliciesSection from './PoliciesSection';
import FeaturesSection from './FeaturesSection';
import AspectSection from './AspectSection';
import FormBottons from '@/components/dashboard/forms/FormBottons';
import { Hotel } from '@/interfaces/index';
import { styles } from '@/components/dashboard/forms/styles';
import FullScreenModal from '@/components/modals/FullScreenModal';
type Feature = {
  id: number;
  name: string;
};
type SectionToEdit =
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
  toEditSection: SectionToEdit;
  services: Feature[] | [];
  activities: Feature[] | [];
  facilities: Feature[] | [];
  languages: Feature[] | [];
  hotelCategories: Feature[] | [];
  submitHandler: (formData:any)=>void;
  abortHandler: ()=>void;
}) {
  const {
    hotel,
    toEditSection,
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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const submitMiddleware = (data: any) => {
    let variables: { [key: string]: number | string | File };

    if (toEditSection === 'policies') {
      if(!data.policiesAndRules)return setError('policiesAndRules',{
  type:'required',
  message:'The policies and rules are required'
})
clearErrors('policiesAndRules')
      variables = {
        checkInHour: data?.checkInHour,
        checkOutHour: data?.checkOutHour,
        policiesAndRules: data?.policiesAndRules,
      };
      return props.submitHandler(variables);
    }
    if (toEditSection === 'address') {
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
    if (toEditSection === 'about') {
            if(!data.description)return setError('description',{
  type:'required',
  message:'A description required'
})
clearErrors('description')
      variables = {
        name: data?.name,

        brand: data?.brand,

        description: data?.description,

        category: data?.category,
      };
      return props.submitHandler(variables);
    }
    if (toEditSection === 'contact') {
      variables = {
        telephone: data?.telephone,
        email: data?.email,
        website: data?.website,
      };
      return props.submitHandler(variables);
    }
    if (toEditSection === 'price') {
      variables = {
        lowestPrice: data?.lowestPrice * 1,
        taxesAndCharges: data?.taxesAndCharges * 1,
      };
      return props.submitHandler(variables);
    }
    if (toEditSection === 'aspect') {
      variables = {
        frameImage: data?.frameImage ? data?.frameImage[0] : null,
        interiorImage: data?.interiorImage ? data?.interiorImage[0] : null,
      };
      return props.submitHandler(variables);
    }
    if (toEditSection === 'features') {
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
    <FullScreenModal
      title={`Edit ${hotel?.name}`}
      onClose={abortHandler}
      isOpen={toEditSection ? true : false}
    >
      <Box
        component="form"
        sx={styles.root}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(submitMiddleware)}
      >
        {toEditSection === 'about' && (
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
        {toEditSection === 'price' && (
          <PriceSection register={register} errors={errors} defaultData={hotel}>
            <FormBottons onAbort={abortHandler} />
          </PriceSection>
        )}
        {toEditSection === 'contact' && (
          <ContactSection
            register={register}
            errors={errors}
            defaultData={hotel}
          >
            <FormBottons onAbort={abortHandler} />
          </ContactSection>
        )}
        {toEditSection === 'address' && (
          <AddressSection
            register={register}
            errors={errors}
            defaultData={hotel}
          >
            <FormBottons onAbort={abortHandler} />
          </AddressSection>
        )}
        {toEditSection === 'features' && (
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
        {toEditSection === 'policies' && (
          <PoliciesSection
            setValue={setValue}  
            register={register}
            errors={errors}
            defaultData={hotel}
     
          >
            <FormBottons onAbort={abortHandler} />
          </PoliciesSection>
        )}
        {toEditSection === 'aspect' && (
          <AspectSection register={register} errors={errors} setError={setError} clearErrors={clearErrors}>
            <FormBottons onAbort={abortHandler} />
          </AspectSection>
        )}
      </Box>
    </FullScreenModal>
  );
}
