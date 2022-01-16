import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Option = {
  id: number;
  name: string;
};

export default function CheckboxesTags({
  options,
  label,
  onChange,
  defaultValue,
  size
}: {
  defaultValue?: Option[];
  options: Option[];
  label: string;
  onChange: (newValues:Option[])=>void;
  sx: any;
  size?:'small' |'medium'
}) {
  return (
    <Autocomplete
      multiple
      onChange={(event, newInputValue) => onChange(newInputValue)}
      id={label}
      options={options}
      key={label}
      defaultValue={defaultValue || []}
      disableCloseOnSelect
      sx={{ textTransform: 'capitalize' }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <Box
          component="li"
          {...props}
          key={option.id}
          sx={{
            textTransform: 'capitalize',
            fontSize: '14px',
          }}
        >
          <Checkbox
               size={size}
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
     
          {...params}
             size={size}
          label={label}
          placeholder={label}
          sx={{ width: '100%', my: 1, textTransform: 'capitalize' }}
        />
      )}
    />
  );
}
