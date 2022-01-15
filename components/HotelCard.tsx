import * as React from 'react';

import Link from 'next/link';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import type { Hotel } from '@/interfaces/index';
import currencyFixer from '@/utils/currencyFixer'
import {generateImageUrl} from '@/utils/generateImageUrl'
import {Theme}from '@mui/system'
import Image from 'next/image'
export default function MultiActionAreaCard({ hotel ,index}: { hotel: Hotel,index:number }) {

  const [cardImage, setCardImage] = React.useState(index%2  === 0 ?  hotel.frameImage: hotel.interiorImage)
  


setTimeout(() => {
  setCardImage(cardImage ===hotel.frameImage ? hotel.interiorImage : hotel.frameImage)
}, 3000);
 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));

  return (
    <Box component={Link} href={`/hotel/${hotel.id}`} passHref >
        <Box  component="a" href="">
      <Card
  
        sx={{
          borderRadius: { sm: 2 },
          flexWrap: 'wrap',
          justifyContent: 'center',
          height: 'min-content',
          width: '100% ',
          maxWidth: '700px',
          m: '0 auto',
                 boxShadow:
      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
      '&:hover':{
        boxShadow:'0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)'
      } 
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
              maxWidth: { sm: '250px' },
              minHeight: { sm: '100%' },
              maxHeight:{xs:200,sm:220},
              width: { sm: '35%' },
              overflow: 'hidden',
              position:'relative'
            }}
          >
            <Box              sx={{
             
       
                overflow: 'hidden',
            
             display: hotel.frameImage===cardImage? 'block':'none',
    opacity: hotel.frameImage===cardImage? 1:0,
                transition: 'ease-in-out 0.5s',
                '&:hover': {
                  transform: 'scale(1.15)',
                },
             
              }}>
     <Image
            

                     blurDataURL={generateImageUrl(hotel.frameImage,{quality:10,height:500,width:500})}
              src={hotel.frameImage}
              alt={hotel.name}
              height={500}
              width={500}
            objectFit='cover'
            />
            </Box>
       <Box   sx={{

                overflow: 'hidden',
                objectFit: 'cover',
                 display: hotel.interiorImage===cardImage? 'block':'none',
                 opacity: hotel.interiorImage===cardImage? 1:0,
                transition: 'ease-in-out 0.5s',
              
                '&:hover': {
                  transform: 'scale(1.15)',
                },
                height: { xs: 250, sm: 220 },
              }}>
<Image
                 
            
          
               placeholder="blur"
 layout="fill"
           blurDataURL={generateImageUrl(hotel.interiorImage,{quality:10,height:500,width:500})}
              src={hotel.interiorImage}
              alt={hotel.name}
                     height={500}
              width={500}
            objectFit='cover'
            />
       </Box>
            
          </Box>
          <CardContent
            sx={{
              pt: { sm: 1.5 },
              px: { sm: 3 },
               pb:{xs:1,sm:0},
              width: { sm: '65%' },
            }}
          >
                 <Box sx={{ marginTop: 'auto', display: 'flex' ,ml:'-4px',mb:1}}>
              <LocationOnIcon color="secondary" fontSize="small" />
              <Typography
              title={hotel.address.holeAddress}
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  whiteSpace: 'pre',
                  textOverflow: 'ellipsis',
m:'3px 0 0 3px',
                  opacity: '0.8',
                  fontWeight: 200,
                }}
              >
                {`${hotel.address.holeAddress}`}
              </Typography>
            </Box>
            <Typography
              gutterBottom
                variant="subtitle1"
                component="h3"
              sx={{
                mb: 0,
                fontSize: { sm: '1rem' },
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre',
              maxWidth:'100%'
              }}
            >
              {hotel.name}
            </Typography>
<Box sx={{fontSize:'14px'}}  />
            <Box
            
              sx={{
                fontSize:'14px',
                my: 1,
                fontWeight: 500,
                opacity: 0.75,
                maxHeight:'50px',
           
                lineHeight:1.5,
                '& > p':{m:0,p:0},
                'h4':{ 
                  mt:0
                }
              
              }}
              dangerouslySetInnerHTML={{__html: hotel.description.substring(0, isInSmScreen?140:100).concat('...')}}
              />
           
            
            <Typography
              variant="h6"
              sx={{
                ml: 'auto',
                mb: 0,
                mt:2,
                maxWidth: 'fit-content',
                fontWeight: 700,
              }}
            >
              USD {currencyFixer(hotel.lowestPrice)}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                margin: ' 0  0 10px auto',
                maxWidth: 'fit-content',

                lineHeight: 1.3,
                fontWeight: 200,
                opacity: 0.8,
              }}
            >
             {hotel.taxesAndCharges ? `Taxes ${currencyFixer(hotel.taxesAndCharges)}`:'Taxes Included' } 
            </Typography>
       
          </CardContent>
        </CardActionArea>
      </Card>
      </Box>
    </Box>
  );
}
