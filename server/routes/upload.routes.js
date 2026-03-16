import express from 'express';
import { authGuard } from '../middleware/authGuard.js';
import cloudinary, { upload, uploadConfig } from '../config/cloudinary.js';

const router = express.Router();

const FILE_LIMITS = {
  maxSize: 25 * 1024 * 1024,  // 25MB
  allowedTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/zip',
    'text/plain', 'application/json',
    'text/javascript', 'text/x-python', 'application/javascript', 'text/x-js'
  ]
};

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    uploadStream.end(buffer);
  });
};

router.post('/', authGuard, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (req.file.size > FILE_LIMITS.maxSize) {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 25MB' });
    }

    if (!FILE_LIMITS.allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'File type not supported' });
    }

    let config = uploadConfig.files;
    let resourceType = 'raw';
    
    if (req.file.mimetype.startsWith('image/')) {
      config = uploadConfig.images;
      resourceType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      config = uploadConfig.videos;
      resourceType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      // Treat audio as video for cloudinary so it processes media duration info
      config = { folder: 'neonchat/audio', resource_type: 'video' };
      resourceType = 'video';
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: config.folder,
      resource_type: config.resource_type,
      // For raw files (JS, PY, JSON), original filename is usually kept.
      // Cloudinary handles missing format natively if resource_type: raw.
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        name: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        thumbnail: result.format ? result.secure_url.replace(`.${result.format}`, '.jpg') : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
