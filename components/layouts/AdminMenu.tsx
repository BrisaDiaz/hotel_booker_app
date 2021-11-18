import * as React from 'react';
import NextLink from 'next/link';

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
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DashboardIcon from '@mui/icons-material/Dashboard';
const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactNode;
  activeLink: string;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const { children } = props;
  const { activeLink } = props;
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { hotelId, roomTypeId } = router.query;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const links = [
    {
      label: 'Dashboard',
      icone: <DashboardIcon />,
      selected: activeLink === 'dashboard',
      sub: false,
      url: '/admin',
    },
    {
      label: 'hotel',
      icone: <ApartmentIcon />,
      selected: activeLink === 'hotel',
      sub: false,
      url: hotelId ? '/admin/hotel' : '/admin',
      query: {
        hotelId: hotelId,
      },
    },
    {
      label: 'room types',
      icone: <MeetingRoomIcon />,
      selected: activeLink === 'room types',
      parent: 'hotels',
      sub: true,
      level: 1,
      url: hotelId ? `/adimin/hotel/room-type` : '/admin',
      query: {
        hotelId: hotelId,
      },
    },
    {
      label: 'rooms',
      icone: <VpnKeyIcon />,
      selected: activeLink === 'rooms',
      sub: true,
      parent: 'room types',
      level: 2,
      url: hotelId && roomTypeId ? `/adimin/hotel/room-type/rooms` : '/admin',
      query: {
        roomTypeId: roomTypeId,
        hotelId: hotelId,
      },
    },
    {
      label: 'requests',
      icone: <NotificationsIcon />,
      selected: activeLink === 'requests',
      sub: true,
      parent: 'hotels',
      level: 1,
      url: hotelId ? 'admin/hotel/requests' : '/adimin',
      query: {
        query: {
          hotelId: hotelId,
        },
      },
    },
    {
      label: 'guests',
      icone: <PeopleAltIcon />,
      selected: activeLink === 'guests',
      sub: true,
      parent: 'hotels',
      level: 1,
      url: hotelId ? 'admin/hotel/guests' : '/admin',
      query: {
        query: {
          hotelId: hotelId,
        },
      },
    },
  ];
  const toDisplayLinks = links.filter(
    (link) => !link.sub || (link.sub && link.parent === activeLink)
  );
  const handleRedirect = (link) => {
    let buildLink: {
      pathname: string;
      query?: { [key: string]: string | number };
    } = { pathname: link.url };

    if (link?.query) {
      buildLink['query'] = link?.query;
    }

    router.push(buildLink);
  };
  const drawer = (
    <Box sx={{ backgroundColor: '#435b9c', color: '#fff', height: '100%' }}>
      <Typography
        sx={{
          height: '62px',
          backgroundColor: '#435b9c',
          fontWeight: 700,
          display: 'flex',
          p: 1.6,
          color: '#fff',
          boxShadow:
            '0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
          pl: 3,
        }}
        variant="h5"
        component="h4"
      >
        Booker{' '}
        <Typography variant="h5" sx={{ px: '5px', fontWeight: 300 }}>
          App
        </Typography>
      </Typography>

      <List sx={{ mx: '10px' }}>
        {toDisplayLinks.map(
          (field: {
            label: string;
            icone: React.ReactNode;
            selected: boolean;
            sub: boolean;
            parent?: string;
            level?: number;
            url: string;
          }) => (
            <ListItem
              button
              onClick={() => handleRedirect(field.url)}
              key={field.label}
              selected={field.selected}
              sx={{
                borderRadius: '10px',
                height: '65px',
                border: `${
                  field.selected
                    ? '2px solid rgba(255,255,255,0.8)'
                    : '1px solid rgba(255,255,255,0.3)'
                }`,

                m: '10px 0 10px 0',
                width: `${
                  field.level === 2 ? '80%' : field.level === 1 ? '90%' : '100%'
                }`,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: '40px',

                  color: '#fff',
                }}
              >
                {field.icone}
              </ListItemIcon>
              <ListItemText
                primary={field.label}
                sx={{ mr: 2, textTransform: 'capitalize' }}
              />
            </ListItem>
          )
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
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
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
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
          overflowY: 'scroll',
          mt: 10,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
