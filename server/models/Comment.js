const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  // Optional: for nested comments/replies
  // parentComment: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Comment',
  //   default: null
  // }
}, { timestamps: true });

// Indexing fields
commentSchema.index({ blog: 1, createdAt: -1 }); // Get comments for a blog post quickly
commentSchema.index({ author: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 