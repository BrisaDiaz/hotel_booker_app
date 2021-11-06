import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import Box from '@mui/material/Box';
import type { Room } from '../interfaces';

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const handleRedirectToRoomPage = (roomId: number) => {
    router.push(`/room/${roomId}`);
  };
  return (
    <div key={room.id} onClick={() => handleRedirectToRoomPage(room.id)}>
      <Card
        sx={{
          maxWidth: '480px',
          minWidth: '310px',
        }}
      >
        <CardActionArea
          sx={{
            padding: '16px',
            textTransform: 'capitalize',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <CardMedia
              component="img"
              height="100px"
              sx={{
                borderRadius: '8px',
                width: '35%',
              }}
              image={room.mainImage}
              alt={room.type}
            />
            <CardContent
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '0 10px',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: '500',
                    opacity: '0.9',
                    textTransform: 'lowercase',
                  }}
                >
                  {room.mts2} mts2
                </Typography>

                <Typography
                  color="primary"
                  sx={{ fontWeight: '400', textDecoration: 'underline' }}
                  variant="body1"
                  component="a"
                >
                  more
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: '600', marginBottom: '5px' }}
              >
                {room.category}
              </Typography>
              <Box sx={{ display: 'flex', columnGap: '8px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: '3px',
                    width: '100%',
                  }}
                >
                  <SingleBedIcon fontSize="small" color="secondary" />
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      columnGap: '3px',
                    }}
                  >
                    {room.beds.map((bed, index) => (
                      <div key={bed.type}>
                        <Typography
                          variant="body2"
                          sx={{ minWidth: 'max-content' }}
                        >
                          {bed.quantity} {bed.type}{' '}
                          {bed.quantity > 1 ? 'beds' : 'bed'}
                          {room.beds.length > 1 &&
                            index < room.beds.length - 1 && <b>{'  '}+</b>}
                        </Typography>
                      </div>
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: '600', float: 'right', marginTop: '-10px' }}
          >
            ${room.lowestPrice} USDw
          </Typography>
        </CardActionArea>
      </Card>
    </div>
  );
}
