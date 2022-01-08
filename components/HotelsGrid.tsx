import * as React from 'react';

import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import HotelCard from './HotelCard';
import type { Hotel } from '../interfaces';

export default function ResponsiveGrid(props:{hotels:Hotel[]}) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: { xs: '100%', md: '90%', lg: '100%' },
        maxWidth: 1200,
        minHeight: '65vh',
        margin: '0 auto',
      }}
    >
      <Grid container spacing={{ xs: 2 }} justifyContent="center">
        {props.hotels.map((hotel:Hotel, index:number) => (
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            lg={10}
            key={hotel.policiesAndRules}
            alignContent="center"
          >
            <HotelCard hotel={hotel} index={index}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
