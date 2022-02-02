import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Feature } from '@/interfaces/index';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export default function CheckboxLabels({
  items,
  handleChanges,
  value,
}: {
  items: Feature[];
  handleChanges: (checked: boolean, itemName: string) => void;
  value: string[];
}) {
  return (
    <FormGroup sx={{ p: 0 }}>
      {items.map((item) => (
        <FormControlLabel
          sx={{
            textTransform: 'capitalize',
            px: 0,
          }}
          key={`${item.name}-${item.id}`}
          label={
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '170px',
                ' *': { fontSize: '14px' },
              }}
            >
              <Typography
                title={item.name}
                sx={{
                  maxWidth: '140px',
                  whiteSpace: 'nowrap',
                  fontSize: '14px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {item.name}
              </Typography>
              {item?.hotelsCount ? (
                <Typography>{`(${item.hotelsCount})`}</Typography>
              ) : null}
            </Box>
          }
          control={
            <Checkbox
              checked={value.includes(item.name) ? true : false}
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
