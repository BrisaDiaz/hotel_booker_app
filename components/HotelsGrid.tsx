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
    <Box sx={{ flexGrow: 1, maxWidth: 1200 }}>
      <Grid container spacing={{ xs: 2 }} justifyContent="center">
        {props.hotels.map((hotel, index) => (
          <Grid item xs={11} sm={11} md={6} key={index}>
            <HotelCard hotel={hotel} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
