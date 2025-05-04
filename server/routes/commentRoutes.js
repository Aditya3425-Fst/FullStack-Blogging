const express = require('express');
const {
    addComment,         // This might be better nested under blog routes
    getCommentsForBlog, // This might be better nested under blog routes
    deleteComment,
    // updateComment // TODO
} = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

// Option 1: Standalone Comment Routes
const router = express.Router();

// Note: GET /api/blogs/:blogId/comments is likely handled in blogRoutes for better structure
// Note: POST /api/blogs/:blogId/comments is likely handled in blogRoutes for better structure

// Routes for specific comments (require authentication for modification)
// These might be better if fetched via blog context, but direct routes are possible
router.delete('/:commentId', protect, deleteComment); // Requires login (Author/Admin check in controller)
// router.put('/:commentId', protect, updateComment); // TODO: Requires login (Author check in controller)

module.exports = router;

/*
// Option 2: Nested Router (More RESTful for comments belonging to a blog)
// In blogRoutes.js, you would do:
const commentRouter = require('./commentRoutes'); // Assuming this file exports the nested router
router.use('/:blogId/comments', commentRouter);

// Then, in this file (commentRoutes.js):
const router = express.Router({ mergeParams: true }); // Need mergeParams: true

router.post('/', protect, addComment);
router.get('/', getCommentsForBlog);

// You would still need separate routes for DELETE/PUT on specific comments
// e.g., DELETE /api/comments/:commentId (as implemented in Option 1)
// Or define them here as well, but accessing req.params.commentId might clash or require careful handling
// router.delete('/:commentId', protect, deleteComment); // Might need careful handling of params

module.exports = router; 
*/ 