const express = require('express');
const {
    getUserProfile,
    getMyProfile,
    updateMyProfile,
    getAllUsers,        // Import admin functions
    getUserByIdAdmin,
    updateUserAdmin,
    deleteUserAdmin
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary'); // Import upload middleware

const router = express.Router();

// --- Logged-in User Routes ---
router.get('/me', protect, getMyProfile);       // Get own profile
router.put('/me', protect, upload.single('profilePic'), updateMyProfile);      // Update own profile

// --- Public Profile Route ---
router.get('/profile/:userId', getUserProfile); // Get any user's public profile

// --- Admin User Management Routes ---
router.get('/', protect, authorize('admin'), getAllUsers); 
router.get('/:id', protect, authorize('admin'), getUserByIdAdmin);
router.put('/:id', protect, authorize('admin'), updateUserAdmin);
router.delete('/:id', protect, authorize('admin'), deleteUserAdmin);

module.exports = router; 