import * as React from 'react';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
export default function TableFilter({
  searchFields,
  onSearch,
  closeModal,
  isModalOpen,
}: {
  searchFields: { label: string; value: string; type: string }[];
  onSearch: Function;
  closeModal: Function;
  isModalOpen: Boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false), closeModal();
  };
  React.useEffect(() => {
    if (isModalOpen) {
      return handleOpen();
    }
    return handleClose();
  }, [isModalOpen]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [selectedField, setSelectedField] = React.useState<string>(
    searchFields[0]?.value
  );
  const [format, setFormat] = React.useState<string>(searchFields[0].type);
  const handleChange = (newValue: string) => {
    setSearchValue(newValue);
  };
  const handleFieldChange = (field: string, format: string) => {
    setSelectedField(field);
    setFormat(format);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSearch(selectedField, searchValue.trim());
  };
  const onReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSearchValue('');
    onSearch(selectedField, '');
  };
  const [isInteracting, setIsInteracting] = React.useState(true);

  return (
    <Modal
      open={open}
      onClick={(e) => {
        !isInteracting && handleClose();
      }}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Paper
        elevation={2}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        sx={{
          p: 1,
          pb: 0,
          border: '1px',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          minWidth: 'max-content',
          maxWidth: 'max-content',
          position: 'relative',
          zIndex: 'inherit',
          transform: 'translate(-50%,-70%)',
          top: '30%',
          left: '50%',
        }}
        component="form"
      >
        <IconButton
          aria-label="reset"
          size="small"
          type="reset"
          onClick={(e) => onReset(e)}
        >
          <ClearIcon fontSize="inherit" />
        </IconButton>
        <Select
          labelId="table-filter"
          id="table-filter"
          variant="standard"
          value={selectedField}
          label="Field"
          size="small"
          sx={{
            fontSize: '14px',
          }}
        >
          {searchFields.map((field) => (
            <MenuItem
              key={field.value}
              sx={{
                fontSize: '14px',
              }}
              value={field.value}
              onClick={() => handleFieldChange(field.value, field.type)}
            >
              {field.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          variant="standard"
          id="outlined-search"
          label={format === 'date' ? '  ' : 'Value'}
          inputProps={{
            min: 0,
          }}
          type={format}
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
    </Modal>
  );
}
