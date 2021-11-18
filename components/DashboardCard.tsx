import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
type Action = {
  name: string;
  callback: Function;
};
const getIcone = (title: string) => {
  const formatedTitle = title.trim().toLocaleLowerCase();
  return formatedTitle.includes('room type') ? (
    <MeetingRoomIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('room') ? (
    <VpnKeyIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('guest') ? (
    <PeopleAltIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('hotel') ? (
    <ApartmentIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('request') ? (
    <NotificationsIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('booking') ? (
    <InboxIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : formatedTitle.includes('calendar') ? (
    <CalendarTodayIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.5 }} />
  ) : null;
};
export default function DashboardCard({
  card,
  color,
}: {
  card: {
    title: string;
    actions: Action[];
    count: number;
    color?: string;
  };
  color: string;
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: '240px',

        m: '0 auto',
        backgroundColor: ` ${color || '#795548'}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          alignItems: 'center',

          p: 3,
        }}
      >
        {getIcone(card.title)}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 200 }}>
            {card.count}
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 200 }}>
            {card.title}
          </Typography>
        </Box>
      </Box>
      <Box>
        <List
          sx={{
            color: '#fff',
            background: 'rgba(0,0,0,0.1)',
            p: 0,
            display: 'flex',
          }}
        >
          {card.actions.map((action: { name: string; callback: Function }) => (
            <ListItem disablePadding onClick={() => action.callback()}>
              <ListItemButton
                sx={{ border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '40px',
                    color: '#fff',

                    opacity: 0.8,
                    textTransform: 'capitalize',
                  }}
                >
                  {action.name === 'view' ? (
                    <VisibilityIcon />
                  ) : (
                    <AddCircleIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={action.name}
                  sx={{ textTransform: 'capitalize' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
