import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
interface Alert {
  message: string;
}

export default function BasicAlerts({
  type,
  alerts,
}: {
  type: string;
  alerts: Alert[];
}) {
  return (
    <Stack
      sx={{ width: '100%' }}
      spacing={2}
      sx={{ position: 'absolute', zIndex: 2 }}
    >
      {alerts.map((alert) => (
        <Alert key={alert.message} severity={type}>
          {alert.message}
        </Alert>
      ))}
    </Stack>
  );
}
