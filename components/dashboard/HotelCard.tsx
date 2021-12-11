import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';

function EditButtom({ onEdit }: { onEdit: Function }) {
  return (
    <Box
      sx={{ position: 'absolute', zIndex: 30, m: 1 }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Fab
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="edit"
        size="medium"
        title="Edit"
      >
        <EditIcon />
      </Fab>
    </Box>
  );
}
export default function HotelCard({
  hotel,
  toggleEditMode,
  handleRedirect,
}: {
  hotel: {
    id: number;
    name: string;
    frameImage: string;
    lowestPrice: number;
    taxesAndCharges: number;
    address: {
      holeAddress: string;
    };
  };
  handleRedirect: Function;
  toggleEditMode: Function;
}) {
  return (
    <div onClick={() => handleRedirect(hotel.id)}>
      <Card sx={{ width: '300px', position: 'relative' }} component="article">
        <CardActionArea component="div">
          <EditButtom onEdit={() => toggleEditMode(hotel.id)} />
          <CardMedia
            component="img"
            height="150px"
            image={hotel.frameImage}
            alt={hotel.name}
          />

          <CardContent sx={{ p: 2 }}>
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

                  opacity: 0.8,
                  fontWeight: 200,
                }}
              >
                {hotel.address.holeAddress}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',

                mt: 1,
                px: 1,
                justifyContent: 'flex-end',
                textAlign: 'right',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, minWidth: 'max-content' }}
              >
                USD ${hotel.lowestPrice}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  width: 120,
                  lineHeight: 1.3,
                  fontWeight: 200,
                  opacity: 0.8,
                  alignSelf: 'center',
                }}
              >
                Taxes USD ${hotel.taxesAndCharges}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
