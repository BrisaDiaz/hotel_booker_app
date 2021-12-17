import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageList from '@mui/material/ImageList';
import Box from '@mui/material/Box';

export default function ImageSlider({
  images,
}: {
  images: {
    title: string;
    image: string;
  }[];
}) {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Carousel navButtonsAlwaysVisible={true} swipe={true} indicators={false}>
        {images.map((item) => (
          <div key={item.image}>
            <ImageList
              sx={{
                width: '100%',
                maxHeight: '500px',
                overflow: 'hidden',
                objectFit: 'cover',
                alignItems: 'center',
              }}
              rowHeight={500}
              cols={1}
            >
              <ImageListItem cols={1}>
                <img
                  sx={{ alignItems: 'center' }}
                  src={`${item.image}`}
                  srcSet={`${item.image}`}
                  alt={item.title}
                  loading="lazy"
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
