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
          borderRadius: { sm: 2 },
          flexWrap: 'wrap',
          height: 'min-content',
          width: '100% ',
          maxWidth: '700px',
          m: '0 auto',
        }}
        key={hotel.id}
      >
        <CardActionArea
          sx={{
            width: '100% ',
            display: { sm: 'flex' },
            py: { sm: 0 },
            px: { sm: 0 },
            m: '0 auto',
            height: '100%',
          }}
        >
          <Box
            sx={{
              maxWidth: '240px',
              width: { sm: '30%' },
              overflow: 'hidden',
            }}
          >
            <CardMedia
              sx={{
                overflow: 'hidden',
                objectFit: 'cover',
                '&:hover': {
                  transform: 'scale(1.15)',
                  transition: 'ease-in-out 0.5s',
                },
              }}
              component="img"
              height={200}
              image={hotel.frameImage}
              alt={hotel.name}
            />
          </Box>
          <CardContent
            sx={{ py: { sm: 0 }, pr: { sm: 3 }, width: { sm: '70%' } }}
          >
            <Typography
              gutterBottom
              variant="subtitle1"
              sx={{
                mb: 0,
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre',
              }}
            >
              {hotel.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                my: 1,
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
              }}
            >
              USD {'$' + hotel.lowestPrice}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                margin: ' 0  0 8px auto',
                maxWidth: 'fit-content',

                lineHeight: 1.3,
                fontWeight: 200,
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
