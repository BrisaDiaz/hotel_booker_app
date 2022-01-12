import React from 'react';

import Box from '@mui/material/Box';
import ProgressBar from '@/components/ProgressBar'
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


export default function ImageDropzone({onChange}:{onChange:(newFiles:File[])=>void}) {

const [dropzoneState, setDropzoneState] = React.useState({
isDraging:false,
loading:false
})

const handleChange=async(e:any)=>{
setDropzoneState({...dropzoneState,loading:true})

await onChange(e)
setDropzoneState({...dropzoneState,loading:false})
  }
  const handleDragState=(isDraging:boolean)=>{
    setDropzoneState(
      {
        ...dropzoneState,
       isDraging
      }
    )
  }

  return(
    
    <Box sx={{
   position:'relative',
   cursor:'pointer',
  width:'100%',
  maxWidth:'600px',
  height:'150px',
  mx:'auto',
  transition:'0.5s ease-in-out',
  '&:hover':{
opacity:1
  },
    opacity: dropzoneState.isDraging ? 1: 0.5,
  border: '2px dashed #265985',
  background:'#f1f3f9',
  py:2,
  'input':{
    position:'absolute',
     width:'100%',
 height:'100%',
 zIndex:10,
 opacity:0,
    cursor:'pointer',
  },
 'svg':{
 
   m:'20px auto',width:'max-content',display:'flex',transform:'scale(2.5)'
 },
'h6':{
mb:4,
fontWeight:800
}
}}>

          <input type="file" multiple onChange={handleChange} onDragEnter={()=>handleDragState(true)}  onDragLeave={ ()=>handleDragState(false)} onDrop={()=>handleDragState(false)} />
           <CloudUploadIcon color="primary"/>
           <Typography variant="h6" align="center"  color="primary">Drag here your files.</Typography>
            <ProgressBar loading={dropzoneState.loading}/>
</Box>



  )
} 