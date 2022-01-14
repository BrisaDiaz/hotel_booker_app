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
      }}
    >
      <Carousel navButtonsAlwaysVisible={true} swipe={true} indicators={false} interval={2000}>
        {images.map((item) => (
          <div key={item.image}>
            <ImageList
              sx={{
                width: '100%',
                maxHeight: '400px',
                overflow: 'hidden',
                objectFit: 'cover',
                alignItems: 'center',
              }}
              rowHeight={400}
              cols={1}
            >
              <ImageListItem cols={1} sx={{ alignItems: 'center','img':{objectFit:'cover'} }} >
                <Image
                  src={generateImageUrl(item.image,{width:800,height:400})}
           
                layout='fill'
                  alt={item.title}
              
                />
                <ImageListItemBar title={item.title} />
              </ImageListItem>
            </ImageList>
          </div>
        ))}
      </Carousel>
    </Box>
  );
}
ImageSlider.prototype = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
