import * as React from 'react';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Hotel } from '@/interfaces/index';
import useMediaQuery from '@mui/material/useMediaQuery';
export default function MultiActionAreaCard({ hotel }: { hotel: Hotel }) {
  const matchesSize = useMediaQuery('(min-width:700px)');

  return (
    <Box component={Link} href={`/hotel/${hotel.id}`} passHref>
      <Card
        elevation={matchesSize ? 2 : 1}
        sx={{
          flexWrap: 'wrap',
          height: 'min-content',
          width: '100% ',
          maxWidth: '750px',
          m: '0 auto',
        }}
        key={hotel.id}
      >
        <CardActionArea
          sx={{
            width: '100% ',
            display: { sm: 'flex' },
            py: { sm: 1 },
            px: { sm: 2 },
            m: '0 auto',
            height: '100%',
          }}
        >
          <CardMedia
            sx={{
              minWidth: '220px',
              width: { sm: '50%' },
              overflow: 'hidden',
              borderRadius: { sm: '10px' },
            }}
            component="img"
            height={200}
            image={hotel.frameImage}
            alt={hotel.name}
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              sx={{
                mb: 0,
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
                mb: 1,
                fontWeight: 500,
                opacity: 0.75,
              }}
            >
              {hotel.description.substring(0, 120).concat('...')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                margin: ' 0  0 0 auto',
                mb: 0,
                maxWidth: 'fit-content',
                fontWeight: 700,

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
                mt: '-4px',
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
      </Card>
    </Box>
  );
}
