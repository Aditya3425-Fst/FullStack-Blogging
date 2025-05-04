const User = require('../models/User');
const generateToken = require('../utils/tokenUtils');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      // Role defaults to 'user' as defined in the model
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Respond with user info (excluding password) and token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    // Basic error handling, consider more specific checks (e.g., validation errors)
    console.error("Signup Error:", error);
    res.status(400).json({ message: 'Invalid user data', error: error.message }); 
    // Pass to global error handler if implemented: next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Respond with user info (excluding password) and token
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
    // Pass to global error handler if implemented: next(error);
  }
}; 