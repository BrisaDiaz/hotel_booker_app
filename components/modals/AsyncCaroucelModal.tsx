
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
, [carouselIndex])

const handleChange=(currentIndex:number|undefined)=>{
 if(currentIndex===undefined) return
 
setCarouselIndex(currentIndex )

}
 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
const miniaturesWidth=150
const miniaturesCenter=isInSmScreen?2:0
const miniaturesMarginLeft=carouselIndex >miniaturesCenter ?(carouselIndex-miniaturesCenter)*miniaturesWidth:0


if(!isMounted) return <div/>
  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose}>
      
  
        <Box sx={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',gap:0.5,mt:'-20px'}}>

 
        
          <Box
      sx={{
        width: '100%',
        maxWidth:'900px',
        'overflow':'hidden',
        height:isInSmScreen ?'400px':'300px',
        mx:'auto'
      }}
    >
      <Carousel navButtonsAlwaysVisible={true} swipe={true} indicators={false} interval={2000} animation='slide' autoPlay={false} index={carouselIndex} cycleNavigation={false} onChange={(newIndex) =>handleChange(newIndex)}>

        {[...images,...imagePlaceholders].map((item,index) => (
         
     
              <Box key={item.image+index}   sx={{ height:isInSmScreen ?400:300, overflow: 'hidden',width:'100%','img':{objectFit:'cover'} }} >

                {item.image ?      <Image
                  src={`${item.image}`}
           
                layout='fill'
                  alt={item.title}
              
                />:
                <ImagePlaceholder/>
                
                }
           
                <ImageListItemBar title={index+1+'/'+totalImages }/>
                </Box  >
            
      
        
        ))}
    

    </Carousel>
    
        </Box>
        <Box sx={{width: '100%',maxWidth:'900px',overflow:'hidden'}}>
        <ImageList sx={ {wrap:'no-wrap',width:'max-content',height: 110, transition: '0.5s ease-in-out', transform: `translateX(-${miniaturesMarginLeft}px)`,my: 0 }} cols={totalImages} rowHeight={100}>
      {[...images,...imagePlaceholders].map((item,index) => (

        <ImageListItem key={item.image+index}   sx={{position:'relative', overflow:'hidden',width:'150px',cursor:'pointer','img':{width:'max-content'},transition:'0.2s ease-in-auto','&:hover':{opacity:0.9}}}>
              <div>
    <Box  
onClick={()=> handleChange(index)}
      sx={{position:'absolute',right:0,top:0,zIndex:100,width:'100%',height:'100%',backdropFilter:carouselIndex===index? 'unset':'brightness(0.5)',cursor:'pointer',}}
      
      /> 
      {item.image ?
       <Image
                  src={`${item.image}`}
                  layout="fill"
                  width={160}
       
                  alt={item.title}
   
        
  
            loading="lazy"
          />

    
    : <MiniaturePlaceholder/>
    }
             
          </div>
        </ImageListItem>
      
      ))}
    </ImageList>
    </Box>
    </Box>

    </FullScreenModal>
  );
}


function ImagePlaceholder(){
   const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));

return (

      
        <Box sx={{width:'100%',height:isInSmScreen?'400px':'300px',display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'contrast(0.5)'}}><CircularProgress sx={{'svg,span':{color:'#fff'}}}/>
        </Box>
  
)

}
function MiniaturePlaceholder(){


return (

      
   <Box sx={{width:'150px',height:'100px',display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'contrast(0.5)'}}><CircularProgress sx={{'svg,span':{color:'#fff'}}}/>
        </Box>
)

}