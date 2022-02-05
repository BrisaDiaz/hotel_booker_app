import { alpha, useTheme, styled } from '@mui/material/styles';
import React from 'react';
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
import SuggestionsSearchBar from '@/components/SuggestionsSearchBar';
import CheckboxGroup from '@/components/CheckboxGroup';
import Accordion from '@/components/Accordion';
import SortIcon from '@mui/icons-material/Sort';
import { toCamelCase } from '@/utils/toCamelCase';
import useMediaQuery from '@mui/material/useMediaQuery';
import Logo from '@/components/layouts/Logo';

type FilterOption = {
  id: number;
  name: string;
  value: string;
  hotelsCount?: number | undefined;
};
const drawerWidth = 240;

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

const SortSelect = ({
  handleChange,
}: {
  handleChange: (sortOption: string) => void;
}) => {
  const [sort, setSort] = React.useState('price');

  const handleSortChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
    handleChange(event.target.value);
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
          onChange={handleSortChange}
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
interface Query {
  features: string[];
  categories: string[];
  services: string[];
  activities: string[];
  facilities: string[];
  languages: string[];
  sort: string;
  search: string;
}
export default function PersistentDrawerLeft({
  children,
  facilities,
  activities,
  languages,
  features,
  services,
  hotelCategories,
  handleSubmit,
  searchOptions,
  onSearchFilter,
}: {
  searchOptions: { primary: string; secondary: string }[];
  onSearchFilter: (search: string) => void;
  children: React.ReactNode;
  facilities: FilterOption[];
  activities: FilterOption[];
  languages: FilterOption[];
  services: FilterOption[];
  features: FilterOption[];
  hotelCategories: FilterOption[];
  handleSubmit: (query: Query) => void;
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

  const defaultQuery = {
    features: [],
    categories: [],
    services: [],
    activities: [],
    facilities: [],
    languages: [],
    sort: 'price',
    search: '',
  };

  const [query, setQuery] = React.useState<Query>(defaultQuery);
  const handleSort = (newValue: string) => {
    setQuery({ ...query, sort: newValue });
  };
  const handleCategories = (value: string) => {
    const checked = query.categories.includes(value);

    if (!checked) {
      return setQuery({
        ...query,
        categories: [...query.categories, value],
      });
    }
    setQuery({
      ...query,
      categories: query.categories.filter((name: string) => name !== value),
    });
  };
  const handleLanguages = (value: string) => {
    const checked = query.languages.includes(value);
    if (!checked) {
      return setQuery({
        ...query,
        languages: [...query.languages, value],
      });
    }
    setQuery({
      ...query,
      languages: query.languages.filter((name: string) => name !== value),
    });
  };
  const handleActivities = (value: string) => {
    const checked = query.activities.includes(value);
    if (!checked) {
      return setQuery({
        ...query,
        activities: [...query.activities, value],
      });
    }
    setQuery({
      ...query,
      activities: query.activities.filter((name: string) => name !== value),
    });
  };
  const handleFacilities = (value: string) => {
    const checked = query.facilities.includes(value);
    if (!checked) {
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
  const handleServices = (value: string) => {
    const checked = query.services.includes(value);
    if (!checked) {
      return setQuery({
        ...query,
        services: [...query.services, value],
      });
    }
    setQuery({
      ...query,
      services: query.services.filter((name: string) => name !== value),
    });
  };
  const handleFeatures = (value: string) => {
    const checked = query.features.includes(value);
    const valueToCamelCase = toCamelCase(value);

    if (!checked) {
      return setQuery({
        ...query,
        features: [...query.features, valueToCamelCase],
      });
    }
    setQuery({
      ...query,
      features: query.features.filter(
        (name: string) => name !== valueToCamelCase
      ),
    });
  };

  const handleSearch = (newSearch?: string) => {
    const searchParams = newSearch
      ? { ...defaultQuery, search: newSearch }
      : { ...query, search: '' };

    setQuery(searchParams);
    !matchesSize && handleDrawerClose();
    handleSubmit(searchParams);
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
          <SuggestionsSearchBar
            options={searchOptions}
            onFilter={onSearchFilter}
            onSearch={handleSearch}
            delay={100}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: 'maxContent',
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
        <SortSelect handleChange={handleSort} />

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
            value={query.categories}
            handleChanges={handleCategories}
          />
        </Accordion>
        <Divider />
        <Accordion title={'Facilities'}>
          <CheckboxGroup
            items={facilities}
            handleChanges={handleFacilities}
            value={query.facilities}
          />
        </Accordion>
        <Divider />
        <Accordion title={'Services'}>
          <CheckboxGroup
            items={services}
            handleChanges={handleServices}
            value={query.services}
          />
        </Accordion>
        <Divider />
        <Accordion title={'Activities'}>
          <CheckboxGroup
            items={activities}
            handleChanges={handleActivities}
            value={query.activities}
          />
        </Accordion>

        <Divider />
        <Accordion title={'Languages'}>
          <CheckboxGroup
            items={languages}
            handleChanges={handleLanguages}
            value={query.languages}
          />
        </Accordion>
        <Divider />

        <Accordion title={'Other Features'}>
          <CheckboxGroup
            items={features}
            handleChanges={handleFeatures}
            value={query.features}
          />
        </Accordion>
        <Divider />
        <Button
          variant="contained"
          color="secondary"
          sx={{
            width: '80%',
            margin: '0 auto',
            my: 3,
            p: 1,
            color: '#fff',
          }}
          onClick={() => handleSearch()}
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
