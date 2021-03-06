import * as React from 'react';
import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import currencyFixer from '@/utils/currencyFixer';
import { generateImageUrl } from '@/utils/generateImageUrl';
import Image from 'next/image';
function EditButton({ onEdit }: { onEdit: () => void }) {
  return (
    <Box
      sx={{ position: 'absolute', zIndex: 30, m: 1 }}
      onClick={(e) => {
        onEdit();
        e.stopPropagation();
      }}
    >
      <Fab aria-label="edit" size="medium" title="Edit">
        <EditIcon />
      </Fab>
    </Box>
  );
}
export default function HotelCard({
  hotel,
  onEdit,
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

  onEdit: (hotelId: number) => void;
}) {
  return (
    <Box sx={{ position: 'relative' }}>
      <EditButton onEdit={() => onEdit(hotel.id)} />

      <Box
        component={Link}
        href={{
          pathname: '/admin/hotel',
          query: { hotelId: hotel.id },
        }}
        passHref
      >
        <Box component="a" href="">
          <Card
            sx={{
              width: '300px',
              position: 'relative',
              background: 'transparent',
              boxShadow:
                '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
              '&:hover': {
                boxShadow:
                  '0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)',
              },
            }}
            component="article"
            elevation={2}
          >
            <CardActionArea component="div">
              <Box sx={{ height: 150, position: 'relative' }}>
                <Image
                  height={150}
                  layout="fill"
                  src={hotel.frameImage}
                  placeholder="blur"
                  blurDataURL={generateImageUrl(hotel.frameImage, {
                    height: 150,
                    quality: 10,
                  })}
                  alt={hotel.name}
                />
              </Box>
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
                  sx={{
                    marginTop: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <LocationOnIcon color="secondary" fontSize="small" />
                  <Typography
                    title={hotel.address.holeAddress}
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
                    USD {currencyFixer(hotel.lowestPrice)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      lineHeight: 1.3,
                      fontWeight: 200,
                      opacity: 0.8,
                      alignSelf: 'center',
                    }}
                  >
                    {hotel.taxesAndCharges
                      ? `Taxes ${currencyFixer(hotel.taxesAndCharges)}`
                      : 'Taxes Included'}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
