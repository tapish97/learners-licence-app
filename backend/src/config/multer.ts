import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const extension = file.originalname.split('.').pop();
    const isPDF = file.mimetype === 'application/pdf';

    return {
      folder: 'learner_docs',
      public_id: `${file.fieldname}-${Date.now()}.${extension}`, // ✅ keep .pdf
      resource_type: isPDF ? 'raw' : 'image', // ✅ crucial fix
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });
export default upload;
