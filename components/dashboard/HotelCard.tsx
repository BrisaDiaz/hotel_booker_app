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
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
function EditButtom({ onClick }: { onClick: React.MouseEventHandler }) {
  return (
    <Box
      sx={{ position: 'absolute', zIndex: 10, m: 1 }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Tooltip disableFocusListener title="Edit">
        <Fab
          onClick={(e) => {
            e.stopPropagation();
            onClick(e);
          }}
          aria-label="edit"
          size="medium"
        >
          <EditIcon />
        </Fab>
      </Tooltip>
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
    <div key={hotel.id} onClick={() => handleRedirect(hotel.id)}>
      <Card sx={{ width: '300px', position: 'relative' }} elevation={2}>
        <CardActionArea>
          <EditButtom onClick={() => toggleEditMode(hotel.id)} />
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
                display: 'flex',
                gap: 1,
                mt: 2,
                px: 1,
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: '150px', opacity: 0.8 }}
              >
                Taxes and Charges USD ${hotel.taxesAndCharges}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, minWidth: 'max-content' }}
              >
                USD ${hotel.lowestPrice}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
