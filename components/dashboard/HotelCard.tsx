import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
function EditMenu({ handleEdit }: { handleEdit: Function }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditSelected = (toEditField: string) => {
    handleEdit(toEditField);
    handleClose();
  };
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
            handleClick(e);
          }}
          color="secondary"
          aria-label="edit"
          size="medium"
        >
          <EditIcon />
        </Fab>
      </Tooltip>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleEditSelected('prices')}>Prices</MenuItem>
        <MenuItem onClick={() => handleEditSelected('address')}>
          Address
        </MenuItem>
        <MenuItem onClick={() => handleEditSelected('desscription')}>
          Description
        </MenuItem>
        <MenuItem onClick={() => handleEditSelected('images')}>Images</MenuItem>
      </Menu>
    </Box>
  );
}
export default function HotelCard({
  hotel,
  handleEdit,
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
  handleEdit: Function;
}) {
  return (
    <div key={hotel.id} onClick={() => handleRedirect(hotel.id)}>
      <Card sx={{ width: '300px', position: 'relative' }}>
        <CardActionArea>
          <EditMenu handleEdit={handleEdit} />
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
