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
      elevation={matchesSize ? 2 : 1}
      sx={{
        flexWrap: 'wrap',
        maxWidth: 740,
        width: '100%',
        m: { sm: '0 auto', lg: 0 },
      }}
      key={hotel.id}
      onClick={() => handleRedirectToHotelPage(hotel.id)}
    >
      <CardActionArea
        sx={{
          display: { sm: 'flex' },
          py: { sm: 1, lg: 0 },
          px: { sm: 1, lg: 0 },
        }}
      >
        <CardMedia
          sx={{ width: { md: '35%', lg: '35%' }, borderRadius: { sm: '10px' } }}
          component="img"
          height="200"
          image={hotel.frameImage}
          alt={hotel.name}
        />
        <CardContent sx={{ width: { md: '60%', lg: '60%' } }}>
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
              padding: '5px',
              fontWeight: 500,
              opacity: 0.75,
            }}
          >
            {hotel.description.substring(0, 120).concat('...')}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              margin: ' 0  0 0 auto',
              maxWidth: 'fit-content',
              fontWeight: 700,
              paddingRight: 2,
              opacity: 0.8,
            }}
          >
            USD {'$' + hotel.lowestPrice}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              margin: ' 0  0 8px auto',
              maxWidth: 'fit-content',
              fontWeight: 200,
              paddingRight: 2,
              opacity: 0.8,
            }}
          >
            Taxes USD {'$' + hotel.taxesAndCharges}
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
