import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function HotelCard({
  hotel,
  onClick,
}: {
  hotel: {
    id: number;
    name: string;
    frameImage: string;
    address: {
      holeAddress: string;
    };
  };
  onClick: React.EventHandler;
}) {
  return (
    <div key={hotel.id} onClick={onClick}>
      <Card sx={{ width: '300px' }}>
        <CardActionArea sx={{ p: '20px' }}>
          <CardMedia
            component="img"
            height="150px"
            image={hotel.frameImage}
            alt={hotel.name}
          />

          <CardContent sx={{ p: '16px 0 6px' }}>
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre',
                fontWeight: 500,
              }}
            >
              {hotel.name}
            </Typography>
            <Box
              sx={{ marginTop: 'auto', display: 'flex', alignItems: 'center' }}
            >
              <LocationOnIcon color="secondary" fontSize="small" />
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  whiteSpace: 'pre',
                  textOverflow: 'ellipsis',
                  paddingTop: 1,

                  opacity: '0.8',
                  fontWeight: 200,
                }}
              >
                {hotel.address.holeAddress}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
