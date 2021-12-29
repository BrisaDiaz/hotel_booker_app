import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
type Data = {
  id: number;
  name: string;
  hotelsCount?: number;
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
            '& >  * ': {
              fontSize: '14px',
            },
            mb: '4px',
          }}
          key={`${item.name}-${item.id}`}
          label={
            item?.hotelsCount
              ? `${item.name} (${item.hotelsCount})`
              : ` ${item.name}`
          }
          control={
            <Checkbox
              size="small"
              color="secondary"
              onChange={(e) => handleChanges(e.target.checked, item.name)}
            />
          }
        />
      ))}
    </FormGroup>
  );
}
