import React from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import AboutSection from './AboutSection';
import CapacitySection from './CapacitySection';

import PriceSection from '../PriceSection';

import FeaturesSection from './FeaturesSection';
import AspectSection from './AspectSection';
import FormBottons from '../FormBottons';
import { RoomModel } from '@/interfaces/index';
import { styles } from '@/components/dashboard/forms/styles';
import FullScreenModal from '@/components/modals/FullScreenModal';

type Feature = {
  id: number;
  name: string;
};
type SectionToEdit =
  | 'about'
  | 'capacity'
  | 'price'
  | 'aspect'
  | 'features'
  | '';

export default function MultilineTextFields({
  roomType,
  toEditSection,
  services,
  amenities,
  roomCategories,
  bedTypes,
  submitHandler,
  abortHandler,
}: {
  roomType: RoomModel;
  toEditSection: SectionToEdit;
  services: Feature[];
  amenities: Feature[];
  roomCategories: Feature[];
  bedTypes: Feature[];
  submitHandler: Function;
  abortHandler: Function;
}) {
  if (!toEditSection || !roomType) return <div></div>;
  if (toEditSection === 'features' && (!services.length || !amenities.length))
    return <div></div>;
  if (toEditSection === 'about' && !roomCategories.length) return <div></div>;
  if (toEditSection === 'capacity' && !bedTypes.length) return <div></div>;
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const submitMiddleware = (data: any, e: any) => {
    let variables: {
      [key: string]: any;
    };

    if (toEditSection === 'about') {
      variables = {
        name: data?.name,
        description: data?.description,
        category: data.category,
      };
      return submitHandler(variables);
    }
    if (toEditSection === 'capacity') {
      variables = {
        mts2: data.mts2 * 2,
        maximunGuests: data.maximunGuests * 1,
        maximunStay: data.maximunNights * 1 || 0,
        minimunStay: data.minimunNights * 1,
      };
      return submitHandler(variables);
    }
    if (toEditSection === 'price') {
      variables = {
        lowestPrice: data.lowestPrice * 1,
        taxesAndCharges: data.taxesAndCharges * 1,
      };
      return submitHandler(variables);
    }
    if (toEditSection === 'aspect') {
      variables = {
        mainImage: data?.mainImage ? data?.mainImage[0] : null,
      };
      return submitHandler(variables);
    }
    if (toEditSection === 'features') {
      let pickedBedQuantities = bedTypes
        .map((bed) => ({
          type: bed.name,
          quantity: data[bed.name] * 1,
        }))
        .filter((bed) => bed.quantity > 0);

      variables = {
        beds: pickedBedQuantities,
        services: data.services,
        amenities: data.amenities,
        smooking: data.smooking,
        freeCancelation: data.freeCancelation,
      };
      return submitHandler(variables);
    }
  };

  return (
    <FullScreenModal
      title={`Edit ${roomType?.name}`}
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
            roomCategories={roomCategories}
            errors={errors}
            defaultData={roomType}
          >
            <FormBottons onAbort={abortHandler} />
          </AboutSection>
        )}
        {toEditSection === 'price' && (
          <PriceSection
            register={register}
            errors={errors}
            defaultData={roomType}
          >
            <FormBottons onAbort={abortHandler} />
          </PriceSection>
        )}
        {toEditSection === 'capacity' && (
          <CapacitySection
            register={register}
            bedTypes={bedTypes}
            errors={errors}
            defaultData={roomType}
          >
            <FormBottons onAbort={abortHandler} />
          </CapacitySection>
        )}

        {toEditSection === 'features' && (
          <FeaturesSection
            register={register}
            services={services}
            amenities={amenities}
            defaultData={roomType}
            setValue={setValue}
            errors={errors}
          >
            <FormBottons onAbort={abortHandler} />
          </FeaturesSection>
        )}

        {toEditSection === 'aspect' && (
          <AspectSection register={register} errors={errors}>
            <FormBottons onAbort={abortHandler} />
          </AspectSection>
        )}
      </Box>
    </FullScreenModal>
  );
}
