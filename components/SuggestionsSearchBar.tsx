import React from 'react';
import { alpha, useTheme, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('xs')]: {
    marginLeft: 'auto',
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  cursor: 'pointer',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  zIndex: 50,
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    width: '100%',
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
  },
}));

type ListOption = {
  primary: string;
  secondary: string;
};
export default function SearchBar({
  options,
  onFilter,
  onSearch,
  delay,
}: {
  options: ListOption[];
  onFilter: (search: string) => void;
  onSearch: (search: string) => void;
  delay: number;
}) {
  const [search, setSearch] = React.useState('');
  const [isListVisible, setIsListVisible] = React.useState(false);
  const [searchOptions, setSearchOptions] = React.useState(options);
  const handleFocus = () => {
    setIsListVisible(true);
  };
  const handleBlur = () => {
    setIsListVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    !e.target.value && onSearch('');
    setSearch(e.target.value);
  };
  React.useEffect(() => {
    filterOptions(search.toLocaleLowerCase().trim());
    if (!search) {
      return onFilter(search.toLocaleLowerCase().trim());
    }
    setTimeout(() => {
      onFilter(search.toLocaleLowerCase().trim());
    }, delay || 1000);
  }, [search, delay]);

  const handleSearch = (selectOption?: string) => {
    onSearch(selectOption || search.toLocaleLowerCase());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };
  const handleOptionSelected = (option: ListOption) => {
    setSearch(option.primary);
    handleBlur();
    handleSearch(option.primary);
  };
  const filterOptions = (search: string) => {
    const filteredOptions = options.filter(
      (option) =>
        option.primary.toLocaleLowerCase().includes(search) ||
        option.secondary.toLocaleLowerCase().includes(search)
    );
    setSearchOptions(filteredOptions);
  };
  React.useEffect(() => {
    setSearchOptions(options);
  }, [options]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        marginLeft: { xs: 'auto' },
        width: '100%',
        maxWidth: '320px',
      }}
    >
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={search}
          type="search"
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>

      <List
        sx={{
          transition: 'all 0.5s ease-in-out',
          position: 'absolute',
          zIndex: 50,
          marginTop: '1px',
          background: searchOptions.length ? '#fff' : 'transparent',
          borderRadius: 1,
          transform: isListVisible ? 'scale(1)' : 'scale(0)',
          opacity: isListVisible ? 1 : 0,
          color: 'initial',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {searchOptions.length
          ? searchOptions.map((option) => (
              <ListItem disablePadding key={option.primary}>
                <ListItemButton
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onClick={() => {
                    handleOptionSelected(option);
                  }}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleOptionSelected(option)
                  }
                >
                  <ListItemText
                    primary={option.primary}
                    secondary={option.secondary}
                  />
                </ListItemButton>
              </ListItem>
            ))
          : null}
      </List>
    </Box>
  );
}
