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
    taxesAndCharges: number;
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
        sx={{
          minWidth: '310px',
          p: { xs: '5px', sm: 0 },
          pb: '10px',
          borderRadius: 2,
        }}
      >
        <CardActionArea
          sx={{
            padding: '16px',
            pb: 0,
            textTransform: 'capitalize',
          }}
        >
          <Box>
            <CardMedia
              component="img"
              height="160px"
              sx={{
                borderRadius: '8px',
                width: { sm: '95%' },
                mb: 1,
                my: { sm: 1 },
                mx: 'auto',
              }}
              image={room.mainImage}
              alt={room.category}
            />
            <CardContent
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '6px 10px',
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
              <Box sx={{ ml: 'auto', width: 'fit-content', textAlign: 'end' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: '600',
                    mb: 1,
                    marginTop: '-10px',
                    opacity: 0.8,
                  }}
                >
                  USD ${room.lowestPrice}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 200,

                    marginTop: '-10px',
                    opacity: 0.8,
                  }}
                >
                  taxes USD ${room.taxesAndCharges}
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
    </div>
  );
}
