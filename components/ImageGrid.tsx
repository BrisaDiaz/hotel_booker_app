import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Theme } from '@mui/system';
import { generateImageUrl } from '@/utils/generateImageUrl';
import Image from 'next/image';
export default function StandardImageList({
  mainImages,
  miniatures,
  onClick,
  onShowMore,
  totalQuantity,
}: {
  mainImages: { image: string; title: string }[];
  miniatures: { image: string; title: string }[];
  totalQuantity: number;
  onClick: (img: { image: string; title: string }, index: number) => void;
  onShowMore: () => void;
}) {
  const isInSmScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm')
  );
  const mainImageGridHeight =
    mainImages.length === 1 && !isInSmScreen ? 300 : 400;
  const mainImagesCols = mainImages.length === 1 ? 1 : isInSmScreen ? 2 : 1;
  const rowHeight = 200;

  return (
    <Box sx={{ my: 1, background: '#e6e6e6' }}>
      <ImageList
        sx={{
          width: '100%',
          maxWidth: '900px',
          height: mainImageGridHeight,
          overflow: 'hidden',
          mb: '4px',
        }}
        cols={mainImagesCols}
        rowHeight={rowHeight}
      >
        {mainImages.map((item, index) => (
          <ImageListItem
            sx={{
              cursor: 'pointer',
              overflow: 'hidden',
              transition: '0.2s ease-in-auto',
              '&:hover': { opacity: 0.9 },
            }}
            key={item.image}
            rows={mainImages.length === 1 ? 2 : isInSmScreen ? 2 : 1}
          >
            <div>
              <Image
                src={item.image}
                layout="fill"
                placeholder="blur"
                objectFit="cover"
                blurDataURL={generateImageUrl(item.image, {
                  width: 900 / mainImagesCols,
                  height: 400,
                  quality: 10,
                })}
                alt={item.title}
                onClick={() => onClick(item, mainImages.length + index)}
              />
            </div>
          </ImageListItem>
        ))}
      </ImageList>
      {miniatures.length ? (
        <ImageList
          sx={{
            width: '100%',
            height: 80,
            overflowX: { xs: 'auto', md: 'hidden' },
            overflowY: 'hidden',
            '&::-webkit-scrollbar ': {
              display: 'none',
            },
            my: 0,
          }}
          cols={6}
          rowHeight={80}
        >
          {miniatures.map((item, index) => (
            <ImageListItem
              key={item.image}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                minWidth: '146px',
                cursor: 'pointer',
                img: { width: '100%' },
                transition: '0.2s ease-in-auto',
                '&:hover': { opacity: 0.9 },
              }}
            >
              <Box>
                {totalQuantity && index + 1 === miniatures.length ? (
                  <ShowMoreBox quantity={totalQuantity} onClick={onShowMore} />
                ) : null}
                <Image
                  objectFit="cover"
                  width={146}
                  height={80}
                  placeholder="blur"
                  src={item.image}
                  blurDataURL={generateImageUrl(item.image, {
                    width: 146,
                    height: 80,
                    quality: 10,
                  })}
                  alt={item.title}
                  onClick={() => onClick(item, index + mainImages.length)}
                />
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      ) : null}
    </Box>
  );
}
function ShowMoreBox({
  quantity,
  onClick,
}: {
  quantity: number;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 80,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'brightness(0.5)',
        cursor: 'pointer',
      }}
    >
      <Typography
        variant="h6"
        component="span"
        sx={{
          px: 2,
          color: '#fff',
          width: 'max-content',
          textDecoration: 'underline',
        }}
      >
        +{quantity} Images
      </Typography>
    </Box>
  );
}
