import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DinamicFieldIcone from '@/components/DinamicFieldIcone';
import Box from '@mui/material/Box';

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
          sx={{ margin: 0, maxHeight: '48px' }}
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls={`${title}-panel`}
          id={`${title}-panel`}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {DinamicFieldIcone(title)}
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
          <Box component="div">{children}</Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
