
import * as React from 'react';

import Carousel from 'react-material-ui-carousel';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress';
import { useMediaQuery } from '@mui/material';
import {Theme} from '@mui/system';
import FullScreenModal from '@/components/modals/FullScreenModal'
import {generateImageUrl} from '@/utils/generateImageUrl'
export default function SimpleBackdrop({
  images,
  isOpen,
  onClose,
  requireMore,
  defaultIndex,
    totalImages
}: {
  images: {
    title: string;
    image: string;
  }[];
  defaultIndex?:number,
   totalImages:number,
  isOpen:boolean;
  onClose:()=>void;
  requireMore:()=>void;
}) {
const [isMounted, setIsMounted] = React.useState(false)
const [carouselIndex, setCarouselIndex] = React.useState(defaultIndex ? defaultIndex:0)
const unLoadedImagesCount = totalImages-images.length 
const  imagePlaceholders=unLoadedImagesCount? new Array(unLoadedImagesCount).fill({image:'',title:'loading image'}):[]
   React.useEffect(() => {
setIsMounted(true)
  }, [])
  
   React.useEffect(() => {
setCarouselIndex(defaultIndex ? defaultIndex:0)
  }, [defaultIndex])


React.useEffect(() => {
  if(!carouselIndex) return
 const fetchIndex= images.length -4 
if(fetchIndex === carouselIndex && unLoadedImagesCount ){
 requireMore()
}
}
, [carouselIndex,images])

const handleChange=(currentIndex:number|undefined)=>{
 if(currentIndex===undefined) return
 
setCarouselIndex(currentIndex )

}
 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'))
const carouselHeight= 450
const miniaturesWidth=isInSmScreen ? 150: 100
const miniaturesHeight=isInSmScreen ? 100: 50
const miniaturesCenter=isInSmScreen?2:0
const miniaturesMarginLeft=carouselIndex >miniaturesCenter ?(carouselIndex-miniaturesCenter)*miniaturesWidth:0


if(!isMounted) return <div/>
  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose}>
      
  
        <Box sx={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:0.5,mt:'-20px',}}>

 
        
          <Box
      sx={{
        width: '100%',
        maxWidth:'900px',
 mt:2,
        'overflow':'hidden',

        mx:'auto',
          '.css-78trlr-MuiButtonBase-root-MuiIconButton-root':{
          p:{xs:0 ,sm:0.5}
        },
  
        
      }}
    >
      <Carousel navButtonsAlwaysVisible={true} swipe={true} indicators={false} animation='slide' autoPlay={false} index={carouselIndex||0} cycleNavigation={false} onChange={(newIndex) =>handleChange(newIndex)}>

        {[...images,...imagePlaceholders].map((item,index) => (
         
     
              <Box key={item.image+index}   sx={{     position:'relative',overflow: 'hidden',width:'100%' }} >

                {item.image ?      <Image
                
                  src={item.image}
           placeholder="blur"

           blurDataURL={generateImageUrl(item.image,{height:carouselHeight,quality:10})}
             layout='responsive'
                width={ 900}
             
                height={carouselHeight}
                 objectFit='contain'
                  alt={item.title}
              loading="eager"
                />:
                <ImagePlaceholder/>
                
                }
           
                <Box sx={{position:'absolute',height:'min-content', zIndex:20,bottom:0,p:1,px:2,color:'#181818',width:'100%',background:'#0000001c',textAlign:'end',fontWeight:800}} >{index+1+'/'+totalImages }</Box>
                </Box  >
            
      
        
        ))}
    

    </Carousel>
    
        </Box>
        <Box sx={{position:'relative',width: '100%',maxWidth:'900px',overflow:'hidden',}}>
        <ImageList sx={ {wrap:'no-wrap',width:'max-content',height: miniaturesHeight, transition: '0.5s ease-in-out', transform: `translateX(-${miniaturesMarginLeft}px)`,my: 0 }} cols={totalImages} rowHeight={miniaturesHeight}>
      {[...images,...imagePlaceholders].map((item,index) => (

        <ImageListItem key={item.image+index}   sx={{position:'relative', overflow:'hidden',width:miniaturesWidth ,cursor:'pointer','img':{width:'max-content'},transition:'0.2s ease-in-auto','&:hover':{opacity:0.9}}}>
      
    <Box  
onClick={()=> handleChange(index)}
      sx={{position:'absolute',right:0,top:0,zIndex:100,width:miniaturesWidth,height:miniaturesHeight,backdropFilter:carouselIndex===index? 'unset':'brightness(0.5)',cursor:'pointer',}}
      
      >
      {item.image ?
       <Image
                  src={item.image}
                  layout="responsive"
                  height={miniaturesHeight}
                  width={miniaturesWidth}
        placeholder="blur"
        objectFit="cover"
           blurDataURL={generateImageUrl(item.image,{width:miniaturesWidth,height:100,quality:10})}
                  alt={item.title}
        
        
  
          />

    
    : <MiniaturePlaceholder/>
    }
             
  </Box>
        </ImageListItem>
      
      ))}
    </ImageList>
    </Box>
    </Box>

    </FullScreenModal>
  );
}


function ImagePlaceholder(){

return (

      
        <Box sx={{width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'contrast(0.5)'}}><CircularProgress sx={{'svg,span':{color:'#fff'}}}/>
        </Box>
  
)

}
function MiniaturePlaceholder(){
 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
const miniaturesWidth=isInSmScreen ? 150: 100
const miniaturesHeight=isInSmScreen ? 100: 50
return (

      
   <Box sx={{width:miniaturesWidth,height:miniaturesHeight,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'contrast(0.5)'}}><CircularProgress sx={{'svg,span':{color:'#fff'}}}/>
        </Box>
)

}