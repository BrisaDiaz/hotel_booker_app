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
import { styles } from '@/components/dashboard/forms/styles';
import FormBottons from '@/components/dashboard/forms/FormBottons';
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
  submitHandler: (formData: any) => void;
}) {
  const { services, activities, facilities, languages, hotelCategories } =
    props;
  const [resetCount, setResetCount] = React.useState(0);

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
  React.useEffect(() => {
    if (!formState.isValidating) return;
    if (!getValues('policiesAndRules')) {
      setError('policiesAndRules', {
        type: 'required',
        message: 'The policies and rules are required',
      });
    } else {
      clearErrors('policiesAndRules');
    }
    if (!getValues('description')) {
      setError('description', {
        type: 'required',
        message: 'A description is required',
      });
    } else {
      clearErrors('description');
    }
    if (
      getValues('frameImage')[0] &&
      getValues('frameImage')[0]?.name === getValues('interiorImage')[0]?.name
    ) {
      setError('interiorImage', {
        type: 'manual',
        message: 'The facade e interior images must be differents.',
      });
    } else {
      clearErrors('interiorImage');
    }
  }, [formState.isValidating]);
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
      <AboutSection
        register={register}
        setValue={setValue}
        hotelCategories={hotelCategories}
        errors={errors}
        resetCount={resetCount}
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

      <PoliciesSection
        register={register}
        errors={errors}
        setValue={setValue}
        resetCount={resetCount}
      />
      <AspectSection
        register={register}
        errors={errors}
        setError={setError}
        clearErrors={clearErrors}
        resetCount={resetCount}
      />

      <FormBottons onAbort={() => setResetCount(resetCount + 1)} />
    </Box>
  );
}
