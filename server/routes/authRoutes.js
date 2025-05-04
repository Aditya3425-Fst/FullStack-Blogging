const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

// TODO: Add routes for logout, forgot password, reset password

module.exports = router; 