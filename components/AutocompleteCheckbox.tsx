import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
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
}: {
  defaultValue?: Option[];
  options: Option[];
  label: string;
  onChange: Function;
  sx: any;
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
        <li {...props} key={option.id}>
          <Checkbox
            icon={icon}
            sx={{ textTransform: 'capitalize' }}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={label}
          sx={{ width: '100%', my: 1, textTransform: 'capitalize' }}
        />
      )}
    />
  );
}
