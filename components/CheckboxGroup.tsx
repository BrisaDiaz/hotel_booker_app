import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxLabels({ items }: { items: string[] }) {
  return (
    <FormGroup>
      {items.map((itemName) => (
        <FormControlLabel
          sx={{ textTransform: 'capitalize', fontSize: '14px' }}
          key={itemName}
          control={<Checkbox />}
          label={itemName}
        />
      ))}
    </FormGroup>
  );
}
