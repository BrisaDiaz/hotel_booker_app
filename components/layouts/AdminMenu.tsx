import * as React from 'react';
import NextLink from 'next/link';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import { SIGN_OUT } from '@/queries/index';
import { useAuth } from '@/context/useAuth';
import Logo from '@/components/layouts/Logo';

const drawerWidth = 240;
interface Link {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  sub: boolean;
  family?: string[];
  level?: number;
  url: string;
  query: any;
}
interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactNode;
  activeLink: string;
}
function UserMenu() {
  const [signOut] = useMutation(SIGN_OUT);
  const { resetSession } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      handleClose();
      await signOut({
        variables: { date: new Date(Date.now()).toISOString() },
      });
      resetSession();
      router.push('/signin');
    } catch (e) {
      console.log(e);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSignOut()}>Logout</MenuItem>
      </Menu>
    </>
  );
}

function NavLink({ link }: { link: Link }) {
  return (
    <Box
      component={Link}
      href={{
        pathname: link.url,
        query: link.query,
      }}
      passHref
      sx={{ cursor: 'pointer' }}
    >
      <ListItem
        component="a"
        key={link.label}
        selected={link.selected}
        sx={{
          cursor: 'pointer',
          borderRadius: '10px',
          height: '65px',
          border: `${
            link.selected
              ? '2px solid rgba(255,255,255,0.8)'
              : '1px solid rgba(255,255,255,0.3)'
          }`,
          '&:hover': {
            border: '1px solid rgba(255,255,255,0.8)',
          },
          m: '10px 0 10px 0',
          width: `${link.level === 1 ? '90%' : '100%'}`,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: '40px',

            color: '#fff',
          }}
        >
          {link.icon}
        </ListItemIcon>
        <ListItemText
          primary={link.label}
          sx={{ mr: 2, textTransform: 'capitalize' }}
        />
      </ListItem>
    </Box>
  );
}
export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const { children } = props;
  const { activeLink } = props;

  const router: {
    push: (url: string) => void;
    query: any;
  } = useRouter();

  const hotelId = 'hotelId' in router.query ? router.query.hotelId : '';

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const NAVIGATION_LINKS: Link[] = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      selected: activeLink === 'dashboard',
      sub: false,
      url: '/admin',
      query: {},
    },
    {
      label: 'hotel',
      icon: <ApartmentIcon />,
      selected: activeLink === 'hotel',
      sub: false,
      family: ['requests', 'guests', 'rooms', 'bookings', 'gallery'],
      url: hotelId ? '/admin/hotel' : '/admin',
      query: hotelId
        ? {
            hotelId: hotelId,
          }
        : {},
    },

    {
      label: 'requests',
      icon: <NotificationsIcon />,
      selected: activeLink === 'requests',
      sub: true,
      family: ['hotel'],
      level: 1,
      url: '/admin/hotel/requests',
      query: hotelId
        ? {
            hotelId: hotelId,
          }
        : {},
    },
    {
      label: 'guests',
      icon: <PeopleAltIcon />,
      selected: activeLink === 'guests',
      sub: true,
      family: ['hotel'],
      level: 1,
      url: '/admin/hotel/guests',
      query: hotelId
        ? {
            hotelId: hotelId,
          }
        : {},
    },
    {
      label: 'bookings',
      icon: <CalendarTodayIcon />,
      selected: activeLink === 'bookings',
      sub: true,
      family: ['hotel'],
      level: 1,

      url: `/admin/hotel/bookings`,
      query: hotelId
        ? {
            hotelId: hotelId,
          }
        : {},
    },
    {
      label: 'gallery',
      icon: <CollectionsIcon />,
      selected: activeLink === 'gallery',
      sub: true,
      family: ['hotel'],
      level: 1,

      url: `/admin/hotel/gallery`,
      query: hotelId
        ? {
            hotelId: hotelId,
          }
        : {},
    },
  ];

  const drawer = (
    <Box sx={{ backgroundColor: '#435b9c', color: '#fff', height: '100%' }}>
      <Box sx={{ mx: 3 }}>
        <Logo />
      </Box>
      <Box
        sx={{
          boxShadow:
            '0px 2px 4px -1px rgb(0 0 0 / 54%), 0px 4px 5px 0px rgb(0 0 0 / 54%), 0px 1px 10px 0px rgb(0 0 0 / 54%)',
          height: '1px',
          mt: '-1px',
        }}
      />
      <List sx={{ mx: '10px' }} component="nav">
        {activeLink === 'dashboard' ? (
          <NavLink link={NAVIGATION_LINKS[0]} />
        ) : (
          NAVIGATION_LINKS.map((link: Link) => (
            <NavLink key={link.label} link={link} />
          ))
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          '.css-42gggb-MuiPaper-root-MuiAppBar-root': {
            boxShadow:
              '0px 1px 2px -1px rgb(0 0 0 / 10%), 0px 4px 3px 0px rgb(0 0 0 / 8%), 0px 1px 5px 0px rgb(0 0 0 / 6%)',
          },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component={NextLink}
            href="/admin"
            passHref
            sx={{ fontWeight: 300 }}
          >
            Dashboard
          </Typography>
          <Box
            sx={{
              ml: 'auto',
            }}
          >
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of NAVIGATION_LINKS. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="div"
        sx={{
          flexGrow: 1,
          mt: { xs: '55px', sm: 8 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
