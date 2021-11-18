import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageList from '@mui/material/ImageList';
interface ImageObj {
  title: string;
  image: string;
}

export default function ImageSlider({ images }: { images: ImageObj[] }) {
  return (
    <div>
      <Carousel navButtonsAlwaysVisible={true} swipe={true} indicators={false}>
        {images.map((item) => (
          <div key={item.image}>
            <ImageList
              sx={{
                width: '100%',
                maxHeight: '550px',
                overflow: 'hidden',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              rowHeight={550}
              cols={1}
            >
              <ImageListItem cols={1}>
                <img
                  src={`${item.image}?w=248&fit=crop&auto=format`}
                  srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar title={item.title} />
              </ImageListItem>
            </ImageList>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
ImageSlider.prototype = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
