import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function LinearIndeterminate() {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  useEffect(() => {
    router.events.on('routeChangeStart', (url, { shallow }) => {
      setIsRouteChanging(true);
    });
    router.events.on('routeChangeComplete', (url, { shallow }) => {
      setIsRouteChanging(false);
    });
  }, [router.pathname]);
  return (
    <Box
      sx={{
        width: '100%',
        position: 'absolute',
        top: '64px',
        visibility: isRouteChanging ? 'visible' : 'hidden',
      }}
    >
      <LinearProgress sx={{ height: '6px' }} color="secondary" />
    </Box>
  );
}
