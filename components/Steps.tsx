import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { useMediaQuery } from '@mui/material';
import {Theme}from '@mui/system'
export default function HorizontalLabelPositionBelowStepper({
  steps,
  activeStep,
  setStep,
}: {
  steps: string[];
  activeStep: number;
  setStep: (step:number)=>void;
}) {
    const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep} sx={{'.css-ascpo7-MuiStepLabel-root':{flexDirection:isInSmScreen?'row':'column',alignContent:'center',gap:{xs:1,sm:0}}}}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={() => setStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
