import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import HotelCard from './HotelCard';
import type { Hotel } from '../interfaces';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
interface typeProps {
  hotels: Hotel[];
}
export default function ResponsiveGrid(props: typeProps) {
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 1200, minHeight: '65vh' }}>
      <Grid container spacing={{ xs: 2 }} justifyContent="flex-start">
        {props.hotels.map((hotel, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <HotelCard hotel={hotel} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
