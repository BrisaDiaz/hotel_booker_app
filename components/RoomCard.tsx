import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import Box from '@mui/material/Box';
import type { Room } from '../interfaces';

import KingBedIcon from '@mui/icons-material/KingBed';

const DinamicBedIcone = (bedType: string) => {
  return bedType === 'californian king' ? (
    <KingBedIcon fontSize="small" color="secondary" />
  ) : bedType === 'full' || bedType === 'queen' ? (
    <KingBedIcon fontSize="small" color="secondary" />
  ) : (
    <SingleBedIcon fontSize="small" color="secondary" />
  );
};
export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();
  const handleRedirectToRoomPage = (roomId: number) => {
    router.push(`/room/${roomId}`);
  };
  return (
    <div key={room.id} onClick={() => handleRedirectToRoomPage(room.id)}>
      <Card
        sx={{
          maxWidth: '400px',
          minWidth: '310px',
          p: '5px',
          pb: '10px',
        }}
      >
        <CardActionArea
          sx={{
            padding: '16px',
            textTransform: 'capitalize',
          }}
        >
          <Box>
            <CardMedia
              component="img"
              height="160px"
              sx={{
                borderRadius: '8px',
                width: '100%',
                mb: 1,
              }}
              image={room.mainImage}
              alt={room.category}
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
                  variant="h6"
                  sx={{ fontWeight: '600', marginBottom: '5px' }}
                >
                  {room.category}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: '500',
                    opacity: '0.9',
                    marginLeft: 'Auto',
                    minWidth: 'max-content',
                    pl: 1,
                    textTransform: 'lowercase',
                  }}
                >
                  {room.mts2} mts2
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', columnGap: '8px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    columnGap: '3px',
                    width: '100%',
                  }}
                >
                  {room.beds.map((bed, index) => (
                    <div key={bed.type}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          columnGap: '3px',
                        }}
                      >
                        {DinamicBedIcone(bed.type)}
                        <Typography
                          variant="body2"
                          sx={{ minWidth: 'max-content' }}
                        >
                          {bed.quantity} {bed.type}{' '}
                          {bed.quantity > 1 ? 'beds' : 'bed'}
                          {room.beds.length > 1 &&
                            index < room.beds.length - 1 && <b>{'  '}+</b>}
                        </Typography>
                      </Box>
                    </div>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: '600', float: 'right', marginTop: '-10px' }}
          >
            ${room.lowestPrice} USD
          </Typography>
        </CardActionArea>
      </Card>
    </div>
  );
}
