import React from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import AspectSection from './AspectSection';
import AboutSection from './AboutSection';
import CapacitySection from './CapacitySection';
import FeaturesSection from './FeaturesSection';
import PriceSection from '../PriceSection';
import { styles } from '@/components/dashboard/forms/styles';
import FormBottons from '../FormBottons';
interface Feature {
  id: number;
  name: string;
}

export default function MultilineTextFields(props: {
  services: Feature[];
  amenities: Feature[];
  roomCategories: Feature[];
  bedTypes: Feature[];
  submitHandler: (formData:any)=>void;
}) {
const  [resetCount, setResetCount] = React.useState(0)
  const { services, amenities, roomCategories, submitHandler, bedTypes } =
    props;

  const {
    register,
    handleSubmit,
    setValue,
      setError,
      getValues,
clearErrors,
formState,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

React.useEffect(() => {
    if(!formState.isValidating) return 
if(!getValues('description')){
setError('description',{
  type:'required',
  message:'A description is required'
})}else{
clearErrors('description');
}
}, [formState.isValidating])

  const submitMiddleware = (data: any) => {
    const pickedBedQuantities = bedTypes
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
      cancelationFee: data.cancelationFee * 1,
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
      <AboutSection
        register={register}
        errors={errors}
        setValue={setValue}
        roomCategories={roomCategories}
      />
      <PriceSection register={register} errors={errors} sourceForm="roomForm" />
      <CapacitySection
        register={register}
        errors={errors}
        bedTypes={bedTypes}
      />
      <FeaturesSection
        register={register}
        errors={errors}
        setValue={setValue}
        services={services}
        amenities={amenities}
      />

      <AspectSection register={register} errors={errors} setError={setError} clearErrors={clearErrors} resetCount={resetCount}/>
      <FormBottons  onAbort={()=>setResetCount(resetCount+1)}/>
    </Box>
  );
}
