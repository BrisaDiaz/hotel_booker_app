import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useMediaQuery } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Theme} from '@mui/system';

import Image from 'next/image'
export default function StandardImageList(
  {mainImages,miniatures,onClick,onShowMore,totalQuantity}:{mainImages:{image:string,title:string}[],miniatures:{image:string,title:string}[],totalQuantity:number,onClick:(img:{image:string,title:string},index:number)=>void,onShowMore:()=>void}
  ) {



 const isInSmScreen = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));

  return (
    <Box  sx={{my:1}}>
   
     
    <ImageList sx={{ width: '100%',maxWidth:'900px', height: mainImages.length===1 || isInSmScreen ? 400:500,overflow:'hidden',mb:'4px' }} cols={mainImages.length===1 ? 1: isInSmScreen?2:1} rowHeight={mainImages.length===1 || isInSmScreen ? 200:250}>
      {mainImages.map((item,index) => (
        <ImageListItem sx={{cursor:'pointer',overflow:'hidden',transition:'0.2s ease-in-auto','&:hover':{opacity:0.9}}} key={item.image}  rows={mainImages.length===1 ? 2: isInSmScreen ?2:1}>
          <div>
            <Image
                  src={`${item.image}`}
                  layout="fill"
                  width={900}
              
                  alt={item.title}
                  onClick={()=>onClick(item,index)}
                />
       </div>
        </ImageListItem>
      ))}
    </ImageList>
    <ImageList sx={{width: '100%', height: 110,overflowX:{xs: 'auto',md:'hidden'},overflowY:'hidden',my: 0}} cols={6} rowHeight={100} >
      {miniatures.map((item,index) => (

        <ImageListItem key={item.image}   sx={{position:'relative', overflow:'hidden',minWidth:'150px',cursor:'pointer','img':{width:'100%'},transition:'0.2s ease-in-auto','&:hover':{opacity:0.9}}}>
              <Box>

      {totalQuantity && index+1 ===miniatures.length ?   <ShowMoreBox quantity={totalQuantity} onClick={onShowMore}/>:null
       }
              <Image
                  src={`${item.image}`}
                  layout="fill"
                  width={150}
       
                  alt={item.title}
          onClick={()=>onClick(item,index+mainImages.length)}
        
  
            loading="lazy"
          />

          </Box>
        </ImageListItem>
      
      ))}
    </ImageList>
    </Box>
  );
}
function ShowMoreBox({quantity,onClick}:{quantity:number,onClick:()=>void}){
  return (
    <Box  
    onClick={onClick}
      sx={{position:'absolute',right:0,top:0,zIndex:100,width:'100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'brightness(0.5)',cursor:'pointer'}}
      
      > 
      <Typography variant="h6" component="span" sx={{ px:2,color:'#fff',width:'max-content',textDecoration:'underline'}} >+{quantity} Images</Typography>
      </Box>
  )
}