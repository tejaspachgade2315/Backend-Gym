const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let fileFormat;
        if (file.mimetype === 'application/pdf') {
            fileFormat = 'pdf';
        } else if (file.mimetype.startsWith('image/')) {
            fileFormat = file.mimetype.split('/')[1]; // Get file extension from mimetype
        } else {
            throw new Error('Unsupported file type');
        }

        return {
            folder: 'gym_erp',
            resource_type: fileFormat === 'pdf' ? 'raw' : 'image',
            format: fileFormat, 
            public_id: file.originalname.split('.')[0], // Use file name without extension
        };
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

module.exports = { upload };