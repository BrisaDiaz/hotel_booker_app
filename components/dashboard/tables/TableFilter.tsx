import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
export default function TableFilter({
  searchFields,
  onSearch,
}: {
  searchFields: { label: string; value: string }[];
  onSearch: Function;
}) {
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [selectedField, setSelectedField] = React.useState<string>(
    searchFields[0]?.value
  );
  const handleChange = (newValue: string) => {
    setSearchValue(newValue);
  };
  const handleFieldChange = (event: SelectChangeEvent) => {
    setSelectedField(event.target.value as string);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch(selectedField, searchValue.trim());
  };
  const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    onSearch(selectedField, '');
  };
  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        pb: 0,
        border: '1px',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        minWidth: 'max-content',
      }}
      component="form"
    >
      <IconButton
        aria-label="reset"
        size="small"
        type="reset"
        color="secondary"
        onClick={(e) => onReset(e)}
      >
        <ClearIcon fontSize="inherit" />
      </IconButton>
      <Select
        labelId="table-filter"
        id="table-filter"
        variant="standard"
        value={selectedField}
        onChange={handleFieldChange}
        label="Field"
        size="small"
        sx={{ fontSize: '14px' }}
      >
        {searchFields.map((field) => (
          <MenuItem
            key={field.value}
            sx={{ fontSize: '14px' }}
            value={field.value}
          >
            {field.label}
          </MenuItem>
        ))}
      </Select>
      <TextField
        variant="standard"
        id="outlined-search"
        label="Value"
        type="text"
        size="small"
        sx={{
          minWidth: 50,
          mb: 2,
          '& > label': { fontSize: '14px' },
          '& > *': { fontSize: '14px' },
        }}
        onChange={(e) => handleChange(e.target.value)}
      />
      <IconButton
        aria-label="submit"
        size="small"
        type="submit"
        color="primary"
        onClick={(e) => {
          onSubmit(e);
        }}
      >
        <SearchIcon fontSize="inherit" />
      </IconButton>
    </Paper>
  );
}
