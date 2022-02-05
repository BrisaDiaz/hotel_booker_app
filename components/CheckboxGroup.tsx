import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
export default function CheckboxLabels({
  items,
  handleChanges,
  value,
}: {
  items: {
    id: number;
    name: string;
    value: string;
    hotelsCount?: number | undefined;
  }[];
  handleChanges: (itemValue: string) => void;
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
            <ItemCheckbox
              checked={value.includes(item.value) ? true : false}
              value={item.value}
              onClick={() => handleChanges(item.value)}
            />
          }
        />
      ))}
    </FormGroup>
  );
}

function ItemCheckbox({
  checked,
  onClick,
  value,
}: {
  checked: boolean;
  onClick: () => void;
  value: string;
}) {
  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const handleClick = () => {
    setIsChecked(!isChecked);
    onClick();
  };
  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <Checkbox
      value={value}
      checked={isChecked}
      size="small"
      color="secondary"
      onClick={() => handleClick()}
    />
  );
}
