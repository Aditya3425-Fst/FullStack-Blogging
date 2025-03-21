// importing the express package for creating router
const express = require('express');
// importing blogController
const blogController = require('../controller/blogController');
// importing authentication and authorisation middleware
const { authentication, authorisation } = require('../middleware/authentication');

const router = express.Router();

// Creating blogs
router.post('/blogs', authentication, blogController.createBlog);

// Getting blogs
router.get('/blogs', authentication, blogController.getBlog);

// Updating blogs
router.put('/blogs/:blogId', authentication, authorisation, blogController.updateBlog);

// Deleting blogs by path params
router.delete('/blogs/:blogId', authentication, authorisation, blogController.deleteBlogByParam);

// Deleting blogs by query params
router.delete('/blogs', authentication, authorisation, blogController.deleteBlogByQuery);

module.exports = router;