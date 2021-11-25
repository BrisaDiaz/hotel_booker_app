import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';

import RoomBedsUI from './RoomBedsUI';

export default function RoomCard({
  room,
}: {
  room: {
    name: string;
    id: number;
    mainImage: string;
    category: string;
    lowestPrice: number;
    mts2: number;
    beds: {
      id: number;
      type: string;
      quantity: number;
    };
  };
}) {
  const router = useRouter();
  const handleRedirectToRoomPage = (roomId: number) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div key={room.id} onClick={() => handleRedirectToRoomPage(room.id)}>
      <Card
        elevation={2}
        sx={{
          maxWidth: '400px',
          minWidth: '310px',
          p: '5px',
          pb: '10px',
          borderRadius: 3,
        }}
      >
        <CardActionArea
          sx={{
            padding: '16px',
            textTransform: 'capitalize',
            borderRadius: 3,
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
                  component="h4"
                  sx={{
                    fontWeight: '600',
                    marginBottom: '8px',
                    lineHeight: 1.2,
                    opacity: 0.9,
                  }}
                >
                  {room.name}
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
                  {room.mts2} mts<sup>2</sup>
                </Typography>
              </Box>
              {RoomBedsUI(room.beds, 'small')}
            </CardContent>
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: '600', float: 'right', marginTop: '-10px' }}
          >
            USD${room.lowestPrice}
          </Typography>
        </CardActionArea>
      </Card>
    </div>
  );
}
