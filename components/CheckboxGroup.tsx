import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
type Data = {
  id: number;
  name: string;
  __typename?: string;
};
export default function CheckboxLabels({ items }: { items: Data[] }) {
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          sx={{ textTransform: 'capitalize', fontSize: '14px' }}
          key={`${item.name}-${item.id}`}
          control={<Checkbox />}
          label={item.name}
        />
      ))}
    </FormGroup>
  );
}
