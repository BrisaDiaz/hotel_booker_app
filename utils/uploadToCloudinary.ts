import axios from 'axios';
type UploadInfo = {
  secure_url: string;
  public_id: string;
};
export default async function upload(files: File[]): Promise<UploadInfo[]> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(file.name, file);
    });

    const { data } = await axios.post('/api/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let filesUploaded: UploadInfo[] = data.images;

    return filesUploaded;
  } catch (error) {
    console.log(error);
    throw new Error('Error: Image upload failed.');
  }
}
