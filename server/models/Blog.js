const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Blog category is required']
  },
  tags: {
    type: [String],
    trim: true
  },
  coverImage: {
    type: String, // URL of the cover image
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  ],
  status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
  }
}, { timestamps: true });

// Indexing fields for faster querying
blogSchema.index({ title: 'text', content: 'text' }); // For text search
blogSchema.index({ author: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ createdAt: -1 }); // For sorting by date

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog; 