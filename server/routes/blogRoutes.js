const express = require('express');
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    unlikeBlog
} = require('../controllers/blogController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // Import middleware
const { addComment, getCommentsForBlog } = require('../controllers/commentController'); // Import comment controllers
const upload = require('../config/cloudinary'); // Import upload middleware



const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Private routes (require authentication)
router.post('/', protect, upload.single('coverImage'), createBlog); // Apply upload middleware
router.put('/:id', protect, upload.single('coverImage'), updateBlog); // Apply upload middleware
router.delete('/:id', protect, deleteBlog); // Requires login (authorization check done in controller)

// --- Nested Comment Routes for a specific Blog ---
router.post('/:blogId/comments', protect, addComment); // Add comment to a blog
router.get('/:blogId/comments', getCommentsForBlog); // Get comments for a blog

// --- Like/Unlike Routes ---
router.put('/:id/like', protect, likeBlog);
router.put('/:id/unlike', protect, unlikeBlog);

// Example of role-specific route (if needed later, e.g., admin-only endpoint)
// router.get('/admin/stats', protect, authorize('admin'), getBlogStats); 

module.exports = router; 