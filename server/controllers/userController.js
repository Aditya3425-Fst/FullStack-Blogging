const User = require('../models/User');
const Blog = require('../models/Blog'); // To fetch user's blogs
const upload = require('../config/cloudinary'); // Import upload middleware


exports.getUserProfile = async (req, res, next) => {
    try {
        // Fetch user by ID from params
        const user = await User.findById(req.params.userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally fetch user's published blog posts
        const userBlogs = await Blog.find({ author: req.params.userId, status: 'published' })
                                   .sort({ createdAt: -1 })
                                   .populate('category', 'name')
                                   .limit(10); // Limit for profile view

        res.status(200).json({ user, blogs: userBlogs });
    } catch (error) {
        console.error("Get User Profile Error:", error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'User not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
        // next(error);
    }
};


exports.getMyProfile = async (req, res, next) => {
    try {
        // req.user is available from protect middleware
        const user = await User.findById(req.user.id).select('-password'); 

        if (!user) {
             return res.status(404).json({ message: 'User not found' }); // Should not happen if token is valid
        }

        // Fetch all blogs (published and drafts) for the logged-in user
        const userBlogs = await Blog.find({ author: req.user.id })
                                   .sort({ createdAt: -1 })
                                   .populate('category', 'name');

        res.status(200).json({ user, blogs: userBlogs });
    } catch (error) {
        console.error("Get My Profile Error:", error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
        // next(error);
    }
};


exports.updateMyProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { username, email, bio, socialLinks } = req.body;
        let profilePicUrl = req.body.profilePic; // Use existing URL if no new file

        // Check if a file was uploaded
        if (req.file) {
            profilePicUrl = req.file.path; // Get URL from Cloudinary via multer middleware
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if username or email is being changed and if it conflicts
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username: username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }
            user.username = username;
        }
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }
            user.email = email;
        }

        // Update other fields
        if (bio !== undefined) user.bio = bio;
        if (socialLinks) {
            user.socialLinks = { ...user.socialLinks, ...socialLinks };
        }
        // Update profile picture URL if a new one was uploaded or provided
        if (profilePicUrl !== undefined) user.profilePic = profilePicUrl;

        const updatedUser = await user.save();

        // Return updated user data (excluding password)
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("Update Profile Error:", error);
         if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Error updating profile', error: error.message });
        // next(error);
    }
};

// --- ADMIN ONLY --- 


exports.getAllUsers = async (req, res, next) => {
    try {
        // TODO: Add pagination
        const users = await User.find({}).select('-password').sort('username');
        res.status(200).json(users);
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
        // next(error);
    }
};


exports.getUserByIdAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // TODO: Optionally populate user's blogs or other relevant info for admin view
        res.status(200).json(user);
    } catch (error) {
        console.error("Get User By ID (Admin) Error:", error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'User not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error fetching user', error: error.message });
        // next(error);
    }
};

exports.updateUserAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // Fields admin can update (e.g., role, maybe username/email, bio - careful with password)
        const { username, email, role, bio, socialLinks } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (username) user.username = username; // TODO: Add conflict check
        if (email) user.email = email;       // TODO: Add conflict check
        if (role) user.role = role;         // Allow admin to change role
        if (bio !== undefined) user.bio = bio;
        if (socialLinks) user.socialLinks = { ...user.socialLinks, ...socialLinks };
        // NOTE: Password update should likely be a separate, dedicated route/process

        const updatedUser = await user.save();
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);

    } catch (error) {
        console.error("Update User (Admin) Error:", error);
        // TODO: Add more specific error handling (validation, conflicts)
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'User not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error updating user', error: error.message });
        // next(error);
    }
};


exports.deleteUserAdmin = async (req, res, next) => {
    // TODO: Decide what to do with user's content (blogs, comments) - reassign, delete, anonymize?
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves? (Optional check)
        // if (req.user.id === userId) { ... }

        await User.deleteOne({ _id: userId });
        // TODO: Handle associated content deletion/modification

        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error("Delete User (Admin) Error:", error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'User not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error deleting user', error: error.message });
        // next(error);
    }
}; 