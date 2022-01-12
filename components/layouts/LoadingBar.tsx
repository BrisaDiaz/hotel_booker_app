import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function LinearIndeterminate() {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setIsRouteChanging(true);
    });
    router.events.on('routeChangeComplete', () => {
      setIsRouteChanging(false);
    });
  }, [router.pathname]);
  return (
    <Box
      sx={{
        width: '100%',
        position: 'fixed',
        top: { xs: '56px', sm: '64px' },
        visibility: isRouteChanging ? 'visible' : 'hidden',
      }}
    >
      <LinearProgress sx={{ height: '6px' }} color="secondary" />
    </Box>
  );
}
