import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import { RoomModel } from '@/interfaces/index';
import RoomBedsUI from './RoomBedsUI';

export default function RoomCard({ room }: { room: RoomModel }) {
  return (
    <>
      <Box
        component={Link}
        href={`/room/${room.id}`}
     
      >
      <Card
        sx={
          {
            minWidth: '310px',
            p: { xs: '5px', sm: 0 },
            paddingBottom: '10px',
            borderRadius: 2,
            backgroundColor: 'transparent',
                   boxShadow:
      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
      '&:hover':{
        boxShadow:'0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)'
      } 
          } as const
        }
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
              height="180px"
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
              <RoomBedsUI beds={room.beds} size="small" />

              <Box
                sx={{
                  ml: 'auto',
                  mt: 2,
                  width: 'fit-content',
                  textAlign: 'end',
                }}
              >
                <Typography
                  variant="h6"
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
      </Box>
    </>
  );
}
