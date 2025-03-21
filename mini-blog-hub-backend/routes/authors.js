// importing the express package for creating router
const express = require('express');
// importing authorController
const authorController = require('../controller/authorController');
// importing authentication middleware
const { authentication } = require('../middleware/authentication');

const router = express.Router();

// Test route (optional, can keep it here or move elsewhere)
router.get('/test', function (req, res) {
    res.send("hello ");
});

// Creating author
router.post('/authors', authorController.createAuthor);

// Getting authors
router.get('/authors', authentication, authorController.getAuthor);

// Login
router.post('/login', authorController.userLogin);

module.exports = router;