import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
type Data = {
  id: number;
  name: string;
  __typename?: string;
};
export default function CheckboxLabels({
  items,
  handleChanges,
}: {
  items: Data[];
  handleChanges: Function;
}) {
  return (
    <FormGroup>
      {items.map((item) => (
        <FormControlLabel
          sx={{
            textTransform: 'capitalize',
            ':& >  label span': {
              fontSize: '14px',
            },
          }}
          key={`${item.name}-${item.id}`}
          label={item.name}
          control={
            <Checkbox
              onChange={(e) => handleChanges(e.target.checked, item.name)}
            />
          }
        />
      ))}
    </FormGroup>
  );
}
