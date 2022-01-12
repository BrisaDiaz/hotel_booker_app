

import React from 'react';



import FolderIcon from '@mui/icons-material/Folder';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';


import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


function Folder({folder,isOpen,onClick}:{folder:{id:number,name:string},isOpen:boolean,onClick:()=>void}){
  return(
     <ListItemButton sx={{cursor:'pointer',
        color: isOpen? 'primary.main':'inherit',
'span':{
 
    transition:'0.2s ease-in-out',
    fontSize:{xs:'14px',sm:'16px'}
},
      
        '.MuiListItemIcon-root':{color:isOpen? 'primary.main':'default',    transition:'0.2s ease-in-out'},
        '&:hover':{color:'primary.main','.MuiListItemIcon-root':{color:'primary.main',opacity: isOpen? 1:0.8}}}} onClick={onClick}>
                  <ListItemIcon>
                 {  isOpen ?<FolderOpenIcon/> :<FolderIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={folder.name}
            
                  />
                </ListItemButton>
  )
}
function ContainerFolder({name,children,isOpen,onClick}:{name:string,children:React.ReactNode,isOpen:boolean,onClick:()=>void}){
return(
  <>
        <ListItemButton sx={{cursor:'pointer',
        color: isOpen? 'primary.main':'default',
'span':{

    transition:'0.2s ease-in-out',
    fontSize:{xs:'14px',sm:'16px'}
},
 '.MuiListItemIcon-root':{color:isOpen ? 'primary.main':'default',    transition:'0.2s ease-in-out'},
        '&:hover':{color:'primary.main','.MuiListItemIcon-root':{color:'primary.main',opacity: isOpen? 1:0.8}}}} onClick={onClick}>
   
                  <ListItemIcon>
                 {  isOpen ?<FolderOpenIcon/> :<FolderIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
            
                  />
            

        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{pl:2}}>
    {children}
        </List>
      </Collapse>
      </>
)
  
}
type Folder ={
  id:number;
  name:string;
  subFolders?:{  id:number;
  name:string}[]
}
export default function FolderDirectory({folders,onSelect}:{folders:Folder[],onSelect:(folder:{id:number,name:string}|null) =>void}){
const generateFoldersContainersState=(folders:Folder[])=>{
 return folders.reduce( (foldersInicialStates:{[key:string]:boolean }|null,folder)=>{
  
    if('subFolders' in folder) return {...foldersInicialStates,[folder.id]:false}
    return foldersInicialStates

  } ,{})
}
const [selectedFolder, setSelectedFolder] = React.useState<{id:number,name:string}| null>(null)
const [containersFoldersState, setContainersFoldersStates] = React.useState<{[key:string]:boolean }|null>(generateFoldersContainersState(folders))
const handleSelected=(folder:{id:number,name:string})=>{
selectedFolder && selectedFolder?.id===folder.id ? setSelectedFolder(null) :setSelectedFolder(folder)

}

const toggleFolder=(folderId:number)=>{
  if(!containersFoldersState) return 
setContainersFoldersStates({...containersFoldersState,[folderId]: !containersFoldersState[folderId]})
}
React.useEffect(() => {
onSelect(selectedFolder)
}, [selectedFolder])
  return (
     <List  sx={{p:0}}>
    {folders.map(folder=> 
      folder?.subFolders ? <ContainerFolder  key={folder.id} name={folder.name} isOpen={ containersFoldersState &&containersFoldersState[folder.id] ? true:false} onClick={()=>toggleFolder(folder.id)}>
{folder.subFolders.map(subFolder=> 
  <Folder key={subFolder.id} isOpen={selectedFolder?.id===subFolder.id} folder={subFolder} onClick={()=> handleSelected(subFolder)}/>
  )}
      </ContainerFolder> :<Folder key={folder.id} folder={folder} isOpen={selectedFolder?.id===folder.id} onClick={()=> handleSelected(folder)} />


      
      )}
  
            </List>
  )
}