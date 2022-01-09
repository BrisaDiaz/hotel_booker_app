import {
  objectType,
  extendType,
  idArg,
  list,
  stringArg,
  nonNull,
} from 'nexus';
import { verifyIsHotelAdmin, deleteImage } from '../utils/index';
import { UserInputError } from 'apollo-server-micro';
import { prisma } from '../../lib/prisma';



export const Image = objectType({
  name:'Image',
  definition(t){
    t.id('id')
    t.string('src')
    t.int('albunId')
 
  }
})
export const Albun = objectType({
  name:'Albun',
  definition(t){
    t.id('id')
    t.string('name')
    t.string('description')
    t.int('hotelId')
    t.int('roomModelId')
    t.list.field('images',{type:"Image"})
    t.string('createdAt');
  }
})

export const Mutation = extendType({
  type:'Mutation',
  definition(t){
    t.field('createAlbun',{
      type:Albun,
      args:{
        userId:nonNull(idArg()),
        hotelId:nonNull(idArg()),
        roomModelId:idArg(),
        name:nonNull(stringArg()),
        description:stringArg(),
        images:list(stringArg())
      },
      resolve(root,args):any{
       const createAlbun = async(userId:number,hotelId:number,roomModelId:number | undefined,args:any)=>{
           verifyIsHotelAdmin(userId, hotelId);
         const albun = await prisma.albun.create({
          data:{
            hotelId:hotelId,
            roomModelId:roomModelId,
            name:args.name,
            description:args.description,
            images: args.images.length ? {create:args.images.map((imgSrc:string)=> ({src:imgSrc}))}  :undefined
          }
         })
         return albun
       }
return createAlbun(parseInt(args.userId),parseInt(args.hotelId),parseInt(args.roomModelId),args)
      }
    })
     t.field('updateAlbun',{
      type:Albun,
      args:{
        userId:nonNull(idArg()),
        albunId:nonNull(idArg()),
        roomModelId:idArg(),
        name:nonNull(stringArg()),
        description:stringArg(),
        images:list(stringArg())
      },
      resolve(root,args):any{
       const createAlbun = async(userId:number,albunId:number,roomModelId:number | undefined,args:any)=>{
         const albunFound = await prisma.albun.findUnique({
           where:{
             id:albunId
           },
           include:{
             images:true
           }
         })
         if(!albunFound) throw new UserInputError('Invalid albun identifier') 
           verifyIsHotelAdmin(userId, albunFound.hotelId);
      const toDeleteImgs:{id:number,src:string}[]=[];
        const storagedUrls:string[]=[];
      const toCreateImagesUrls:string[]=[];
   

albunFound.images.forEach((img:{id:number,src:string}) => {
 !args.images.includes(img.src)  && toDeleteImgs.push(img)
 storagedUrls.push(img.src)
});
 args.images.forEach((url:string)=>{ !storagedUrls.includes(url) && toCreateImagesUrls.push(url) })
     
   
          

  
//// delete the removed images
  await Promise.all(toDeleteImgs.map(async(img:{src:string,id:number})=> {
              await prisma.image.delete({
              where:{id:img.id}
            })
            await deleteImage(img.src)
          
          }))

/// create added images
  await Promise.all(
    toCreateImagesUrls.map(async(url:string)=>{
      await prisma.image.create({
        data:{
           albunId:albunFound.id,
           src:url
        }
      })
    })
  )

         const albun = await prisma.albun.update({
           where:{
             id:albunId
           },
          data:{
            hotelId: albunFound.hotelId,
            roomModelId:roomModelId,
            name:args.name,
            description:args.description,
          }
         })
         return albun
       }
return createAlbun(parseInt(args.userId),parseInt(args.albunId),parseInt(args.roomModelId),args)
      }
    })
  }
})

export const Query = extendType({
  type: 'Query',
  definition(t) {
t.field('roomModelAlbun',{
  type:Albun,
  args:{
    roomModelId:nonNull(idArg())
  },
  resolve(root,args):any{
    return prisma.albun.findUnique({
      where:{
        id:parseInt(args.roomModelId)
      }
    })
  }
}),
t.field('hotelAlbuns',{
  type:Albun,
  args:{
    hotelId:nonNull(idArg())
  },
  resolve(root,args):any{
    return prisma.albun.findUnique({
      where:{
        id:parseInt(args.hotelId)
      }
    })
  }
})
  }
})