import * as React from 'react';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export default function Logo() {
  return (
    <Box component={Link} href={'/search'} passHref>
      <Typography
        sx={{
          height: '62px',
          backgroundColor: '#435b9c',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
        }}
        variant="h5"
        component="a"
      >
        Booker{' '}
        <Typography
          variant="h5"
          component="span"
          sx={{ px: '5px', fontWeight: 300 }}
        >
          App
        </Typography>
      </Typography>
    </Box>
  );
}
