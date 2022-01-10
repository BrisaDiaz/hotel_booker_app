import React from 'react';
import Image from 'next/image'
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
type Image = {url:string,name:string}
export default function ImageDropzone({images,onClear,onReset}:{images:Image[],onClear:(mode:'all'|'selectedOnly',selectedImagesNames?:string[] )=>void,onReset:()=>void}) {
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
      <>

 <Stack direction="row" spacing={1} sx={{my:2,flexWrap:'wrap',width:'max-content','button':{textTransform:'capitalize'}}} >
  
      <Button variant="outlined" size="small" disabled={visuals.length?false:true} onClick={()=>handleClear('all')}>filter All</Button>
      <Button variant="outlined"size="small" disabled={selectedFilesNames.length?false:true} onClick={()=>handleClear('selectedOnly')}>
        filter
      </Button>
    
    </Stack>
   <Grid container spacing={{xs:1,sm:2}} sx={{maxHeight:'350px',overflowY:'auto',pb:2}}>
    {visuals.map((img)=> 
      <Grid
            item
            xs={6}
            sm={4}
            md={3}
         
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
 <Stack direction="row" spacing={0.5} sx={{my:2,flexWrap:'wrap',mx:'auto',width:'max-content','button':{textTransform:'capitalize'}}} >
     <Button variant="contained"  size="small" >
        Save
      </Button>
         <Button variant="contained"  size="small" onClick={onReset}>
        reset changes
      </Button>
    
    </Stack>
    </>      

  )
} 