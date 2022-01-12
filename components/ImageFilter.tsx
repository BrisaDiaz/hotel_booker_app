import React from 'react';
import Image from 'next/image'
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
export default function ImageDropzone({images,onClear,onReset,onSave}:{images: {url:string,name:string}[],onClear:(mode:'all'|'selectedOnly',selectedImagesNames?:string[] )=>void,onReset:()=>void,onSave:()=>void}) {
const [visuals, setVisuals] = React.useState<{url:string,name:string}[]>(images||[])
const [selectedFilesNames, setSelectedFilesNames] = React.useState<string[]>([])

  const handleFileSelection=(e:{target:{checked:boolean,name:string}})=>{

     e.target.checked ? setSelectedFilesNames([...selectedFilesNames,e.target.name]) : 
      setSelectedFilesNames([...selectedFilesNames.filter((fileName)=> fileName !==e.target.name )])
  }
 const handleClear=(type:'all' | 'selectedOnly')=>{

  type==="all" ? onClear('all') :onClear('selectedOnly',[...selectedFilesNames])

  setSelectedFilesNames([])
 }
React.useEffect(() => {
setVisuals(images)
}, [images])
  return(
      <Box sx={{maxWidth:'1200px',mx:'auto'}}>

 <ButtonGroup   sx={{mb:2}} >
         <Button variant="contained"  size="small" onClick={onSave}>
        Save
      </Button>
         <Button variant="outlined"  size="small" onClick={onReset}>
        reset 
      </Button>
      <Button variant="outlined" size="small" disabled={visuals.length?false:true} onClick={()=>handleClear('all')}>filter All</Button>
      <Button variant="outlined"size="small" disabled={selectedFilesNames.length?false:true} onClick={()=>handleClear('selectedOnly')}>
        filter
      </Button>

    </ButtonGroup>
   <Grid container spacing={{xs:1,sm:2,}} sx={{maxHeight:'300px',overflowY:'auto',pb:1}}>
    {visuals.map((img)=> 
      <Grid
            item
            xs={6}
            sm={3}
            md={2}
       
      key={img.name} 
            alignContent="center"
   
          >
    <Box  sx={{ position:'relative' ,  mx:'auto',            boxShadow:
      '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
  
      '&:hover':{
        boxShadow:'0px 3px 20px -2px rgb(0 0 0 / 14%), 0px 3px 20px 0px rgb(0 0 0 / 8%), 0px 1px 20px 0px rgb(0 0 0 / 8%)'
      } ,
      transition:'0.2s ease-in-out',
      'span,svg':{color:'#fff'}}}>
      <Checkbox  sx={{position:'absolute',zIndex:10,top:0,left:0}} name={img.name} onChange={handleFileSelection}/>
  <Image src={img.url} width={160} height={100} layout="responsive" alt={img.name}/>
    </Box>
</Grid>
  )}
</Grid>

    </Box>      

  )
} 