import type { NextApiRequest, NextApiResponse } from 'next';
import React from 'react';
import { WithLayoutPage ,Album} from '@/interfaces/index';
import {
  CREATE_ALBUM,
GET_HOTEL_ALBUMS,
EDIT_ALBUM,
RENAME_ALBUM,
DELETE_ALBUM,
GET_ALBUM_IMAGES,

} from '@/queries/index';
import { getUser } from '@/graphql/utils';
import { useLazyQuery,useMutation } from '@apollo/client';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import { client } from '@/lib/apollo';
import AdminMenu from '@/components/layouts/AdminMenu';
import Head from 'next/head';
import Box from '@mui/material/Box';
import SnackBar from '@/components/SnackBar';
import Backdrop from '@/components/Backdrop';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import CollectionsIcon from '@mui/icons-material/Collections';
import FolderDirectory from '@/components/dashboard/FoldersDirectory';
import AlbumModal from '@/components/modals/AlbumModal'
import Dialog from '@/components/Dialog';
import FullScreenModal from '@/components/modals/FullScreenModal'
import ImageManager from '@/components/ImagesAlbunManager'


type PagePromps = {
userId:number,
hotelId:number,
albums:Partial<Album>[]
};
type Folder ={
  id:number;
  name:string;
  subFolders:{  id:number;
  name:string}[]
}
const RoomRequests: WithLayoutPage<PagePromps> = (props) => {
const generateFolders=(albums:Partial<Album>[])=>{
return albums.reduce((folders:Folder[],album:Partial<Album>)=>{
  const folderData ={id:album.id||0,name:album.name||''}
album.roomModelId ? folders[1].subFolders.push(folderData):folders[0].subFolders.push(folderData)
  return folders
},[{id:1,name:'Hotel Albums',subFolders:[]},{id:2,name:'Room Types Albums',subFolders:[]}])
}
const [folders, setFolders] = React.useState<Folder[]>(generateFolders(props.albums))
const [albumToEditImages, setAlbumToEditImages] = React.useState<{id:number,src:string}[]|null>(null)
const [selectedAlbum, setSelectedAlbum] = React.useState<{id:number,name:string}| null>(null)

  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error'|'warning';
    content: string;
  }>({
    type: 'success',
    content: '',
  });

  const [loading, setLoading] = React.useState<boolean>(false);

  const [modalsState, setModalsState] = React.useState<{
    createAlbum: boolean;
    renameAlbum: boolean;
       manageAlbum: boolean;
          deleteAlbum: boolean;
  }>({
    createAlbum: false,
    renameAlbum: false,
      manageAlbum: false,
       deleteAlbum: false,
  });

const [createAlbum,createAlbumRequest] = useMutation(CREATE_ALBUM,{
  onCompleted({album}:{album:{id:number,name:string}}){
    const foldersCopy=[...folders]
    foldersCopy[0].subFolders.unshift(album)
     setFolders(foldersCopy)
     handleCloseModal('createAlbum')
     setNotification({type:'success',content:'Folder created successfully'})
  },
  onError({message}){
      setNotification({type:'error',content:message})
  }
})
const [deleteAlbum,deleteAlbumRequest] = useMutation(DELETE_ALBUM,{
  onCompleted({album}:{album:{id:number,name:string}}){
  const foldersCopy=[...folders]
    const actualizedSubFolders=   foldersCopy[0].subFolders.filter(folder =>folder.id !==album.id )
    foldersCopy[0].subFolders=actualizedSubFolders
  
     setFolders(foldersCopy)
     handleCloseModal('deleteAlbum')
     setNotification({type:'success',content:'Folder deleted successfully'})
  },
  onError({message}){
      setNotification({type:'error',content:message})
  }
})
const [renameAlbum,renameAlbumRequest] = useMutation(RENAME_ALBUM,{
  onCompleted({album}:{album:{id:number,name:string}}){
  const foldersCopy=[...folders]
    const actualizedSubFolders=   foldersCopy[0].subFolders.map(folder =>folder.id ===album.id ? album:folder)
foldersCopy[0].subFolders=actualizedSubFolders
  
     setFolders(foldersCopy)
     handleCloseModal('renameAlbum')
     setNotification({type:'success',content:'Folder renamed successfully'})
  },
  onError({message}){
      setNotification({type:'error',content:message})
  }
})
const [editAlbumImgs,editAlbumImgsRequest] = useMutation(EDIT_ALBUM,{
  onCompleted({album}:{album:{id:number,name:string,images:{id:number,src:string}[]}}){

  
     setAlbumToEditImages(album.images)
     handleCloseModal('manageAlbum')
     setNotification({type:'success',content:'Album updated successfully'})
  },
  onError({message}){
      setNotification({type:'error',content:message})
  }
})

const [getAlbumImages,albumImagesRequest] = useLazyQuery(GET_ALBUM_IMAGES,{
    fetchPolicy: 'no-cache',
  })
React.useEffect(() => {
  
  if(albumImagesRequest.loading){
    return 
  }
  if(albumImagesRequest.data){
    setAlbumToEditImages(albumImagesRequest.data.images)
  handleOpenModal('manageAlbum')
  }
 if(albumImagesRequest.error){
  return  setNotification({type:'error',content:albumImagesRequest.error.message})
  }
}, [albumImagesRequest])

  const handleCloseModal = (modalName: string) => {
    setModalsState({ ...modalsState, [modalName]: false });
  };
  const handleOpenModal = (modalName: string) => {
    setModalsState({ ...modalsState, [modalName]: true });
  };
  const handleActions =async (
    action: 'createAlbum' | 'renameAlbum' |'manageAlbum'|'deleteAlbum' ,

  ) => {
    if( action === 'renameAlbum'||action==="deleteAlbum" ){
      const isHotelAlbum = folders[0].subFolders.find((folder:{name:string,id:number})=> selectedAlbum?.id===folder.id)
      
         if(  !isHotelAlbum){
return setNotification({type:"warning",content:"Room types albums cannot be renamed or deleted."
      })
     
    }
     
    }
    if(action==='manageAlbum' && selectedAlbum){

      try{
        await getAlbumImages({variables:{
    albumId:selectedAlbum.id
        }})
      }catch(error){
       console.log(error)
      }
      return
    }
   handleOpenModal(action)
  };


  const cleanNotification = () => {
    setTimeout(() => {
      setNotification({
        type: 'success',
        content: '',
      });
    }, 6000);
  };





const onSelectAlbum=(album:{id:number,name:string}|null)=>{
setSelectedAlbum(album)
}
const onEditAlbumImgs=async(toUploadFiles:File[] ,imagesFiltered?:string[])=>{
  if(!selectedAlbum)return
setLoading(true);
    try {
 const uploadedImgs= await uploadToCloudinary(toUploadFiles);
let imagesUrls= uploadedImgs.map(img=> img.secure_url)
if(imagesFiltered){
imagesUrls = [...imagesUrls,...imagesFiltered]
}

      await editAlbumImgs({
        variables: {
          userId: props.userId,
          albumId:selectedAlbum.id ,
          images: imagesUrls,
        },
      });
    } catch (err: any) {

      setLoading(false);
      setNotification({type:'error',content:"Album update couldn't be complited, try again later"});
    }
}
const onDeleteAlbum=async()=>{
     if(!selectedAlbum)return
try{
await deleteAlbum({
  variables:{
     userId:props.userId,
    albumId:selectedAlbum.id,
  }
})
}catch(error){
  console.log(error)
}
}
const onCreateAlbum=async(data:{name:string})=>{
try{
await createAlbum({
  variables:{
    userId:props.userId,
    hotelId:props.hotelId,
    name:data.name
  }
})

}catch(error){
  console.log(error)
}
}
const onRenameAbum=async(data:{name:string})=>{
    if(!selectedAlbum)return
try{
await renameAlbum({
  variables:{
    userId:props.userId,
    albumId:selectedAlbum.id,
    name:data.name
  }
})

}catch(error){
  console.log(error)
}
}
React.useEffect(() => {
  if(createAlbumRequest.loading||albumImagesRequest.loading||renameAlbumRequest.loading||editAlbumImgsRequest.loading||deleteAlbumRequest.loading){
    return setLoading(true)
  }
   setLoading(false)
}, [createAlbumRequest.loading,albumImagesRequest.loading,renameAlbumRequest.loading,editAlbumImgsRequest.loading,deleteAlbumRequest.loading])

React.useEffect(() => {
  if(notification.content){
    return cleanNotification()
  }

}, [notification])
const ACTION_BOTTOMS=[
  {
    title:'Add a new album',
    onClick:()=>handleActions('createAlbum'),
    disabled:false,
    icone:<CreateNewFolderIcon />
  },
    {
    title:'Rename album',
    onClick:()=>selectedAlbum && handleActions('renameAlbum'),
    disabled:selectedAlbum ? false:true,
    icone:<EditIcon />
  },
    {
    title:"Manage album",
    onClick:()=>selectedAlbum && handleActions('manageAlbum'),
    disabled:selectedAlbum ? false:true,
    icone:<CollectionsIcon />
  },
    {
    title:'Delete album',
    onClick:()=>selectedAlbum && handleActions('deleteAlbum'),
    disabled:selectedAlbum ? false:true,
    icone:<DeleteIcon />
  },

]
  return (
    <div>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ maxWidth: 1200 }} component="main">
 <Box sx={{width:'100%',background:'#0000000a',borderBottom:'1px solid #ddd'}}>
<Stack direction="row" justifyContent="end" spacing={1} sx={{p:1}}>

 {ACTION_BOTTOMS.map(buttom=>
  <Tooltip title={buttom.title} key={buttom.title}>
   <span>
      <IconButton disabled={buttom.disabled} onClick={buttom.onClick}>
    {buttom.icone}
  </IconButton>
  </span>
  </Tooltip>
  )}
 
     
</Stack>
  
 </Box>
 <FolderDirectory onSelect={onSelectAlbum} folders={folders}/>
      <FullScreenModal isOpen={modalsState.manageAlbum} onClose={()=>handleCloseModal('manageAlbum')}  title={selectedAlbum?.name}>
 <ImageManager onSubmit={onEditAlbumImgs}   defaultValue={albumToEditImages ? albumToEditImages.map(img=> img.src):[]}/>
</FullScreenModal>
        
            
           <AlbumModal isModalOpen={modalsState.createAlbum} closeModal={()=>handleCloseModal('createAlbum')}
           
           onSubmit={onCreateAlbum}/>
    <AlbumModal isModalOpen={modalsState.renameAlbum} defaultValue={selectedAlbum} closeModal={()=>handleCloseModal('renameAlbum')}
           
           onSubmit={onRenameAbum}/>
        <Backdrop loading={loading} />

        <Dialog
        acceptLabel={'Procced'}
        rejectLabel={'Avort'}
        title={'Are you sure?'}
        text={
          'If procced all images inside the album are going to be lost.'
        }
        isDialogOpen={modalsState.deleteAlbum}
        onAccept={onDeleteAlbum}
        onCancel={ ()=>handleCloseModal('deleteAlbum')}
      />
        {notification.content && (
          <SnackBar
            severity={notification.type}
            message={notification.content || 'Oparation succesfully complited'}
          />
        )}
      </Box>
    </div>
  );
};

RoomRequests.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminMenu activeLink="gallery">{page}</AdminMenu>;
};
export default RoomRequests;
type PageContext = {
  req: NextApiRequest;
  res: NextApiResponse;
  query: {
    hotelId: number;
  };
};
export const getServerSideProps = async ({ req, res, query }: PageContext) => {
  try {
    const user = await getUser(req, res);
    if (user.role === 'ADMIN') {
  
      const { data } = await client.query({
        query: GET_HOTEL_ALBUMS,
        variables: { hotelId: query.hotelId },
      });

      return {
        props: {
          hotelId: query.hotelId,
          userId: user.id,
        albums: data?.albums 
        },
      };
    }

    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  } catch (e:any) {
    console.log(e.networkError ? e.networkError?.result?.errors : e);

    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
      props: {},
    };
  }
};
