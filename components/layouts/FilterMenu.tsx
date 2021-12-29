import { alpha, useTheme, styled } from '@mui/material/styles';
import React, { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import CheckboxGroup from '@/components/CheckboxGroup';
import Accordion from '@/components/Acconrdion';
import SortIcon from '@mui/icons-material/Sort';
import { toCamelCase } from '@/utils/index';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '@/components/layouts/Logo';
const drawerWidth = 240;

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

    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(1),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const SortSelect = ({ handdleChange }: { handdleChange: Function }) => {
  const [sort, setSort] = React.useState('price');

  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
    handdleChange(event.target.value);
  };

  return (
    <Box
      sx={{
        maxHeight: '40px',
        margin: '16px    ',
      }}
    >
      <FormControl fullWidth>
        <Select
          labelId="select-sort"
          id="select-sort"
          value={sort}
          sx={{ maxHeight: '45px' }}
          onChange={handleChange}
          IconComponent={() => <SortIcon sx={{ mr: 1.5 }} />}
        >
          <MenuItem value="price">Lowest Price</MenuItem>
          <MenuItem value="-price">Highest Price</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

type Data = {
  id: number;
  name: string;
  hotelsCount: number;
  __typename: string;
};
export default function PersistentDrawerLeft({
  children,
  facilities,
  activities,
  languages,
  services,
  hotelCategories,
  handleSubmit,
}: {
  children: React.ReactNode;
  facilities: Data[];
  activities: Data[];
  languages: Data[];
  services: Data[];
  hotelCategories: Data[];
  handleSubmit: Function;
}) {
  const matchesSize = useMediaQuery('(min-width:900px)');
  const theme = useTheme();
  const [open, setOpen] = React.useState(matchesSize ? true : false);
  React.useEffect(() => {
    if (matchesSize) {
      return handleDrawerOpen();
    }
    handleDrawerClose();
  }, [matchesSize]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const features = [
    { id: 1, name: 'free cancelation' },
    { id: 2, name: 'accessible' },
    { id: 3, name: 'family friendly' },
    { id: 4, name: 'pet friendly' },
    { id: 5, name: 'eco friendly ' },
    { id: 6, name: 'smoker friendly' },
  ];

  interface Query {
    features: string[];
    categories: string[];
    services: string[];
    activities: string[];
    facilities: string[];
    languages: string[];
    sort: string;
    search: string | null;
  }

  const [query, setQuery] = React.useState<Query>({
    features: [],
    categories: [],
    services: [],
    activities: [],
    facilities: [],
    languages: [],
    sort: 'price',
    search: '',
  });
  const handleSort = (newValue: string) => {
    setQuery({ ...query, sort: newValue });
  };
  const handdleCategories = (checked: Boolean, value: string) => {
    if (checked) {
      return setQuery({
        ...query,
        categories: [...query.categories, value],
      });
    }
    setQuery({
      ...query,
      categories: query.categories.filter((name: string) => name === value),
    });
  };
  const handdleLanguages = (checked: Boolean, value: string) => {
    if (checked) {
      return setQuery({
        ...query,
        languages: [...query.languages, value],
      });
    }
    setQuery({
      ...query,
      languages: query.languages.filter((name: string) => name === value),
    });
  };
  const handdleActivities = (checked: Boolean, value: string) => {
    if (checked) {
      return setQuery({
        ...query,
        activities: [...query.activities, value],
      });
    }
    setQuery({
      ...query,
      activities: query.activities.filter((name: string) => name === value),
    });
  };
  const handdleFacilities = (checked: Boolean, value: string) => {
    if (checked) {
      return setQuery({
        ...query,
        facilities: [...query.facilities, value],
      });
    }
    setQuery({
      ...query,
      facilities: query.facilities.filter((name: string) => name !== value),
    });
  };
  const handdleServices = (checked: Boolean, value: string) => {
    if (checked) {
      return setQuery({
        ...query,
        services: [...query.services, value],
      });
    }
    setQuery({
      ...query,
      services: query.services.filter((name: string) => name === value),
    });
  };
  const handdleFeatures = (checked: Boolean, value: string) => {
    let valueToCamelCase = toCamelCase(value);

    if (checked) {
      return setQuery({
        ...query,
        features: [...query.features, valueToCamelCase],
      });
    }
    setQuery({
      ...query,
      features: query.features.filter(
        (name: string) => name === valueToCamelCase
      ),
    });
  };

  const handleSearchValue = (newValue: string) => {
    setQuery({ ...query, search: newValue });
  };

  const handdleSearch = () => {
    setQuery({
      features: [],
      categories: [],
      facilities: [],
      services: [],
      activities: [],
      languages: [],
      sort: 'price',
      search: query.search,
    });
    submitMiddleware();
  };
  const submitMiddleware = () => {
    handleSubmit(query);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ ...(open && { display: 'none' }) }}
          >
            <Tooltip disableFocusListener title="Filter">
              <ManageSearchIcon fontSize="large" />
            </Tooltip>
          </IconButton>
          <Box sx={{ mr: 2, display: { xs: 'none', sm: 'flex' } }}>
            <Logo />
          </Box>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onKeyPress={(e) => e.key === 'Enter' && handdleSearch()}
              placeholder="Search…"
              onChange={(e) => handleSearchValue(e.target.value)}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ background: 'primary' }}>
          <IconButton
            onClick={handleDrawerClose}
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />
        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            fontWeight: 500,
            padding: '10px 20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Sort By:
        </Typography>

        <Divider />
        <SortSelect handdleChange={handleSort} />

        <Divider />

        <Typography
          variant="subtitle2"
          color="primary"
          sx={{
            fontWeight: 500,
            padding: '10px 20px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Filter By:
        </Typography>

        <Divider />
        <Accordion title={'Category'}>
          <CheckboxGroup
            items={hotelCategories}
            handleChanges={handdleCategories}
          />
        </Accordion>
        <Divider />
        <Accordion title={'Facilities'}>
          <CheckboxGroup items={facilities} handleChanges={handdleFacilities} />
        </Accordion>
        <Divider />
        <Accordion title={'Services'}>
          <CheckboxGroup items={services} handleChanges={handdleServices} />
        </Accordion>
        <Divider />
        <Accordion title={'Activities'}>
          <CheckboxGroup items={activities} handleChanges={handdleActivities} />
        </Accordion>

        <Divider />
        <Accordion title={'Languages'}>
          <CheckboxGroup items={languages} handleChanges={handdleLanguages} />
        </Accordion>
        <Divider />

        <Accordion title={'Other Features'}>
          <CheckboxGroup items={features} handleChanges={handdleFeatures} />
        </Accordion>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: '80%',
            my: 3,
            mx: 'auto',
            p: 1,
            color: 'common.white',
          }}
          onClick={submitMiddleware}
        >
          Apply
        </Button>
      </Drawer>

      <Main open={open} sx={{ mt: { sm: 0 } }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
