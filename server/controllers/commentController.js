const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const User = require('../models/User'); // For author population


exports.addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const author = req.user.id; // From protect middleware
        const blogId = req.params.blogId;

        // Check if blog exists
        const blogExists = await Blog.findById(blogId);
        if (!blogExists) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const newComment = await Comment.create({
            text,
            author,
            blog: blogId
        });

        // Populate author details before sending response
        const populatedComment = await Comment.findById(newComment._id).populate('author', 'username profilePic');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Add Comment Error:", error);
        res.status(400).json({ message: 'Error adding comment', error: error.message });
        // next(error);
    }
};


exports.getCommentsForBlog = async (req, res, next) => {
    try {
        const blogId = req.params.blogId;

        // Check if blog exists
        const blogExists = await Blog.findById(blogId);
        if (!blogExists) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        const comments = await Comment.find({ blog: blogId })
                                      .populate('author', 'username profilePic') // Populate author info
                                      .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(comments);
    } catch (error) {
        console.error("Get Comments Error:", error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
        // next(error);
    }
};


exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id; // From protect middleware
        const userRole = req.user.role;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Authorization check: Is user the comment author or an admin?
        if (comment.author.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this comment' });
        }

        await Comment.deleteOne({ _id: commentId });

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Comment not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
        // next(error);
    }
};

