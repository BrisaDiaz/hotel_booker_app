import * as React from 'react';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Hotel } from '@/interfaces/index';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function MultiActionAreaCard({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const handleRedirectToHotelPage = (hotelId: number) => {
    router.push(`/hotel/${hotelId}`);
  };
  const matchesSize = useMediaQuery('(min-width:700px)');

  return (
    <Card
      elevation={matchesSize ? 3 : 1}
      sx={{ flexWrap: 'wrap', maxWidth: '100vw' }}
      key={hotel.id}
      onClick={() => handleRedirectToHotelPage(hotel.id)}
    >
      <CardActionArea sx={matchesSize ? { display: 'flex', p: 0 } : {}}>
        <CardMedia
          sx={matchesSize ? { width: '30%', borderRadius: '10px' } : {}}
          component="img"
          height="200"
          image={hotel.frameImage}
          alt={hotel.name}
        />
        <CardContent sx={matchesSize ? { width: '65%', mx: 0 } : { m: 0.9 }}>
          <Typography
            gutterBottom
            variant="h6"
            sx={{
              marginBottom: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre',
              color: '#212121',
            }}
          >
            {hotel.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              marginBottom: 1,
              maxHeight: 100,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '5px',
              fontWeight: 500,
              opacity: 0.75,
            }}
          >
            {hotel.description}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              margin: ' 16px 0 10px auto',
              maxWidth: 'fit-content',
              fontWeight: 700,
              paddingRight: 2,
            }}
          >
            USD${hotel.lowestPrice}
          </Typography>

          <Box sx={{ marginTop: 'auto', display: 'flex' }}>
            <LocationOnIcon color="secondary" fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                whiteSpace: 'pre',
                textOverflow: 'ellipsis',
                paddingTop: '2px',
                opacity: '0.8',
                fontWeight: 200,
              }}
            >
              {`${hotel.address.holeAddress}`}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      {!matchesSize && <CardActions></CardActions>}
    </Card>
  );
}
