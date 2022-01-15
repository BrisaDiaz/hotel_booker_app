import React from 'react'
import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageList from '@mui/material/ImageList';
import Box from '@mui/material/Box';
import Image from 'next/image'
import {generateImageUrl} from '@/utils/generateImageUrl'
export default function ImageSlider({
  images,
}: {
  images: {
    title: string;
    image: string;
  }[];
}) {
  const [isMounted, setIsMounted] = React.useState(false)

   React.useEffect(() => {
setIsMounted(true)
  }, [])
if(!isMounted) return <div/>
  return (
    <Box
      sx={{
        width: '100%',
 
      height:432,
      
      }}
    >
      <Carousel  navButtonsAlwaysVisible={true} swipe={true} indicators={false} interval={2000}>
        {images.map((item) => (
 
            <ImageList
             key={item.image}
              sx={{
                width: '100%',
        height:'inherit',
                overflow: 'hidden',
                objectFit: 'cover',
                alignItems: 'center',
              }}
         rowHeight={400}
              cols={1}
            >
              <ImageListItem cols={1} sx={{ alignItems: 'center' }} >
                <Image
                objectFit='cover'
                  src={item.image}
           placeholder="blur"

height={400}
           blurDataURL={generateImageUrl(item.image,{width:750,height:400,quality:10})}
                layout='fill'
                  alt={item.title}
              
                />
                <ImageListItemBar title={item.title} />
              </ImageListItem>
            </ImageList>
     
        ))}
      </Carousel>
    </Box>
  );
}
ImageSlider.prototype = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
