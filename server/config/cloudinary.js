import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadConfig = {
  images: {
    folder: 'neonchat/images',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    resource_type: 'image'
  },
  files: {
    folder: 'neonchat/files',
    resource_type: 'raw'
  },
  videos: {
    folder: 'neonchat/videos',
    resource_type: 'video'
  }
};

const storage = multer.memoryStorage();
export const upload = multer({ storage });
export default cloudinary;
