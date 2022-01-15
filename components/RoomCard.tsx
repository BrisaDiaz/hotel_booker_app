import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from '@mui/material/Box';
import { RoomModel } from '@/interfaces/index';
import RoomBedsUI from './RoomBedsUI';
import currencyFixer from '@/utils/currencyFixer'
import {generateImageUrl} from '@/utils/generateImageUrl'
import Image from 'next/image'
export default function RoomCard({ room }: { room: RoomModel }) {
  
  return (
   
      <Box

        component={Link}
        href={`/room/${room.id}`}
     passHref
      >
             <Box  component="a" href="">
      <Card

        sx={
          {
            minWidth: '310px',
           
       
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
            <Box   sx={{
                borderRadius: '8px',
                width: { sm: '95%' },
                mb: 1,
                my: { sm: 1 },
                mx: 'auto',
              }}>
            <Image
            layout="fill"
              height={180}
            
                   src={generateImageUrl(room.mainImage,{quality:100,height:180,width:310})}
        placeholder="blur"

           blurDataURL={generateImageUrl(room.mainImage,{quality:10,height:180,width:310})}
              alt={room.category}
            />
            </Box>
            <CardContent
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '6px 10px',
                color:'#fff',
                backdropFilter:'brightness(0.5)',
                mb:4,
               mt:1
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                title={room.name}
                  variant="h6"
                  component="h4"
                  sx={{
                    fontWeight: '600',
                    marginBottom: '8px',
                    lineHeight: 1.2,
                    opacity: 0.9,
                    maxWidth:300,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
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
                  USD {currencyFixer(room.lowestPrice)}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 200,

                    marginTop: '-10px',
                    opacity: 0.8,
                  }}
                >
                    {room.taxesAndCharges ? `Taxes ${currencyFixer(room.taxesAndCharges)}`:'Taxes Included' } 
               
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </CardActionArea>
      </Card>
      </Box>
      </Box>
   
  );
}
