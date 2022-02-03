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
  callback: () => void;
};
const getIcon = (title: string) => {
  const formattedTitle = title.trim().toLocaleLowerCase();
  return formattedTitle.includes('room type') ? (
    <MeetingRoomIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('room') ? (
    <VpnKeyIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('guest') ? (
    <PeopleAltIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('hotel') ? (
    <ApartmentIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('request') ? (
    <NotificationsIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('booking') ? (
    <InboxIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : formattedTitle.includes('calendar') ? (
    <CalendarTodayIcon sx={{ transform: 'scale(4)', opacity: 0.4, ml: 2.7 }} />
  ) : null;
};
export default function DashboardCard({
  card,
}: {
  card: {
    title: string;
    actions: Action[];
    count: number;
    color?: string;
  };
}) {
  return (
    <div key={card.title}>
      <Paper
        sx={{
          width: '240px',
          borderRadius: '20px',
          backgroundColor: ` ${card.color || '#795548'}`,
          boxShadow:
            '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
          '&:hover': {
            boxShadow:
              '0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)',
          },
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
          {getIcon(card.title)}
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
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontWeight: 200,
                textTransform: 'capitalize',
              }}
            >
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
              borderRadius: '0 0 20px 20px',
              display: 'flex',
            }}
          >
            {card.actions.map(
              (action: { name: string; callback: () => void }) => (
                <ListItem
                  disablePadding
                  onClick={() => action.callback()}
                  key={action.name}
                >
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
              )
            )}
          </List>
        </Box>
      </Paper>
    </div>
  );
}
