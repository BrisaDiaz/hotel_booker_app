
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';


export default function FileInput({label,sx, onChange,error,register,resetCount, size}:{label?:string,sx:any ,onChange?:(event:any)=>void,error?:boolean,register:any,resetCount?:number;size?:'small' | 'medium'}){
  const [file, setFile] = useState<File|null>(null)

  const handleChange=(e:any)=>{
    
    setFile(e.target.files[0])
     onChange && onChange(e)
  }
  ////reset file when reset is trigger
  React.useEffect(() => {
if(resetCount)  setFile(null)
  }, [resetCount])

  return(
    <Box sx={{position:'relative'}}>
{file && <Box sx={{position:'absolute',left:'50px',bottom:size==="medium"?'23px':'15px','*':{fontSize:{sm:'16px',xs:'14px'} },display:'flex'}}>
 <Typography sx={{
maxWidth:'80px',overflow: 'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'
}}>{file.name}</Typography><Typography > {file.name.split('.')[1]}</Typography>
</Box>
}

          <TextField
            fullWidth
            size={size|| 'medium'}
            {...register}
            label={label|| 'Upload File'}
            type="file"
            error={error  || false}
            onChange={handleChange}
            variant="outlined"
            sx={{
              ...sx ,
              'input':{
              position:'relative',
              opacity:0,
              '&:before':{
              position:'absolute',
              cursor:'pointer',
              content: '" "',
              background:'red',
              height:'85%',
              width:'100%',
              zIndex:10,
              bottom:'2px',
              right:'2px'
            }
              },
             }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FileUploadOutlinedIcon fontSize={size|| 'medium'} sx={{'svg':{transform:'scale(1.2)'}}}/>
                </InputAdornment>
              ),
            }}
          />
      </Box>
  )
}