import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ApartmentIcon from '@mui/icons-material/Apartment';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import HikingIcon from '@mui/icons-material/Hiking';
import LanguageIcon from '@mui/icons-material/Language';
import HotelIcon from '@mui/icons-material/Hotel';
import RuleIcon from '@mui/icons-material/Rule';

import Box from '@mui/material/Box';

const DinamicIcons = (subject: string) => {
  const subjectName = subject.toLowerCase().trim();
  return subjectName == 'facilities' ? (
    <ApartmentIcon />
  ) : subjectName == 'services' ? (
    <RoomServiceIcon />
  ) : subjectName == 'activities' ? (
    <HikingIcon />
  ) : subjectName == 'languages' ? (
    <LanguageIcon />
  ) : subjectName == 'category' ? (
    <HotelIcon />
  ) : subjectName == 'other features' ? (
    <RuleIcon />
  ) : null;
};

export default function SimpleAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Accordion sx={{ boxShadow: 'none' }}>
        <AccordionSummary
          sx={{ margin: 0 }}
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`${title}-panel`}
          id={`${title}-panel`}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {DinamicIcons(title)}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 200,
                padding: '0 10px',
                opacity: '0.8',
              }}
            >
              {title}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography component="div">{children}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
