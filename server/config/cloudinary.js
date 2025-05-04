const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_app', // Optional: specify a folder in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        // Optional: transformation to apply to uploads
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] 
    }
});

// Configure Multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size (e.g., 5MB)
    fileFilter: (req, file, cb) => {
        // Optional: Add custom file validation if needed
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

module.exports = upload; 