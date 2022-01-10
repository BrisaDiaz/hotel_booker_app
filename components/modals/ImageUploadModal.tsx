import FullScreenModal from '@/components/modals/FullScreenModal'
import ImageManager from '@/components/ImageManager'

export default function ImageUploadModal({isOpen,onSubmit,onClose,albunName}:{onSubmit:(files:File[],urls?:string[])=> void,onClose:()=>void,isOpen:boolean,albunName:string}){

<FullScreenModal isOpen={isOpen} onClose={onClose} title={albunName+' Albun'}>
 <ImageManager onSubmit={onSubmit}  />
</FullScreenModal>

}