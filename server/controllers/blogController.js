const Blog = require('../models/Blog');
const User = require('../models/User'); // Needed potentially for author checks
const Category = require('../models/Category'); // Needed potentially for category validation
const upload = require('../config/cloudinary'); // Import upload middleware


exports.createBlog = async (req, res, next) => {
   
    try {
        const { title, content, category, tags, status } = req.body;
        const author = req.user.id; 
        let coverImageUrl = req.body.coverImage || '';

        // Check if a file was uploaded
        if (req.file) {
            coverImageUrl = req.file.path; // Get URL from Cloudinary
        }

        // Basic check if category exists (can be more robust)
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category specified' });
        }

        const newBlog = await Blog.create({
            title,
            content,
            author, 
            category,
            tags, // Should be an array
            status: status || 'draft',
            coverImage: coverImageUrl // Use URL from upload or body
        });

        res.status(201).json(newBlog);

    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(400).json({ message: 'Error creating blog post', error: error.message });
        // next(error);
    }
};

// @desc    Get all blog posts (with pagination)
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = async (req, res, next) => {
    try {
        // --- Filtering --- 
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Handle specific filters (e.g., category, author, tags)
        // Convert category name/slug to ID if filtering by name/slug is desired
        if (queryObj.category) {
           // Assuming filtering by category ID passed in query
           // If filtering by name: find category ID first
           // const category = await Category.findOne({ name: queryObj.category });
           // queryObj.category = category ? category._id : null;
        }
        if (queryObj.author) {
            // Assuming filtering by author ID passed in query
        }
        if (queryObj.tags) {
            // Assuming tags is a comma-separated string
            queryObj.tags = { $in: queryObj.tags.split(',').map(tag => tag.trim()) };
        }

        // --- Search --- (Basic text search using index)
        let searchQuery = {};
        if (req.query.search) {
            searchQuery = { $text: { $search: req.query.search } };
        }

        // Combine filters and search
        const filter = { ...queryObj, ...searchQuery, status: 'published' }; // Always filter by published status for public view

        // --- Sorting --- 
        let sortBy = '-createdAt'; // Default sort by newest
        if (req.query.sort) {
            // Allow sorting by fields like 'createdAt', 'likes', 'title'
            const allowedSortFields = ['createdAt', 'likes', 'title'];
            const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
            if (allowedSortFields.includes(sortField)) {
                 sortBy = req.query.sort.replace(',', ' '); // Mongoose expects space separation for multiple sorts
            }
        }

        // --- Pagination --- 
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10; // Default limit 10
        const skip = (page - 1) * limit;

        // Execute Query
        const blogsQuery = Blog.find(filter)
                               .populate('author', 'username profilePic')
                               .populate('category', 'name')
                               .sort(sortBy)
                               .skip(skip)
                               .limit(limit);

        const blogs = await blogsQuery;

        // --- Count total documents for pagination info ---
        const totalBlogs = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(totalBlogs / limit);

        res.status(200).json({
            results: blogs.length,
            page,
            totalPages,
            totalBlogs,
            data: blogs
        });

    } catch (error) {
        console.error("Get All Blogs Error:", error);
        res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
        // next(error);
    }
};


exports.getBlogById = async (req, res, next) => {
    try {
        console.log(`--- Getting blog by ID: ${req.params.id} ---`);
        const blog = await Blog.findById(req.params.id)
                               .populate('author', 'username email profilePic bio socialLinks role') // Ensure role is populated for author
                               .populate('category', 'name');
        
        console.log('--- Fetched Blog Data: ---', blog ? { _id: blog._id, status: blog.status, authorId: blog.author?._id } : null);
        console.log('--- Request User Data (from protect middleware): ---', req.user ? { id: req.user.id, role: req.user.role } : null);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check authorization conditions
        const isPublished = blog.status === 'published';
        const isAuthor = req.user && blog.author && req.user.id === blog.author._id.toString();
        const isAdmin = req.user && req.user.role === 'admin';
        
        console.log(`--- Authorization Check: isPublished=${isPublished}, isAuthor=${isAuthor}, isAdmin=${isAdmin} ---`);

        if (!isPublished && !isAuthor && !isAdmin) {
            console.log('--- Authorization FAILED ---');
            return res.status(404).json({ message: 'Blog post not found or not published' });
        }
        
        console.log('--- Authorization PASSED ---');
        res.status(200).json(blog);

    } catch (error) {
        console.error("Get Blog By ID Error:", error);
        // Pass error to global handler instead of direct response for non-ObjectId errors
        next(error);
    }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (Author or Admin)
exports.updateBlog = async (req, res, next) => {
    // TODO: Validate input data
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Authorization check: Is user the author or an admin?
        const userId = req.user.id;
        const userRole = req.user.role;
        if (blog.author.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to update this post' });
        }

        // Fields that can be updated
        const { title, content, category, tags, status } = req.body;
        let coverImageUrl = req.body.coverImage; // Allow updating/removing via URL

        // Check if a new file was uploaded
        if (req.file) {
            coverImageUrl = req.file.path;
            // TODO: Optionally delete the old image from Cloudinary
        }

        // Check if the category exists if provided
        if (category) {
             const categoryExists = await Category.findById(category);
             if (!categoryExists) {
                 return res.status(400).json({ message: 'Invalid category specified' });
             }
             blog.category = category;
        }

        // Update fields if they are provided in the request body
        if (title) blog.title = title;
        if (content) blog.content = content;
        if (tags) blog.tags = tags;
        if (status) blog.status = status;
        // Update cover image URL if a new one was uploaded or provided (even empty string to remove)
        if (coverImageUrl !== undefined) blog.coverImage = coverImageUrl;

        const updatedBlog = await blog.save();

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error("Update Blog Error:", error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Blog post not found (invalid ID format)' });
        }
        res.status(400).json({ message: 'Error updating blog post', error: error.message });
        // next(error);
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Author or Admin)
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Authorization check: Is user the author or an admin?
        const userId = req.user.id;
        const userRole = req.user.role;
        if (blog.author.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        // await blog.remove(); // .remove() is deprecated, use deleteOne or deleteMany
        await Blog.deleteOne({ _id: req.params.id });
        // TODO: Delete associated comments and handle image deletion from Cloudinary if needed

        res.status(200).json({ message: 'Blog post removed successfully' });
    } catch (error) {
        console.error("Delete Blog Error:", error);
         if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Blog post not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error deleting blog post', error: error.message });
        // next(error);
    }
};

// @desc    Like a blog post
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.likeBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // From protect middleware

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if already liked by this user
        if (blog.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'Post already liked by this user' });
        }

        // Add user to likedBy array and increment likes count
        blog.likedBy.push(userId);
        blog.likes = blog.likedBy.length; // Update count
        await blog.save();

        res.status(200).json({ message: 'Post liked successfully', likes: blog.likes, likedBy: blog.likedBy });

    } catch (error) {
        console.error("Like Blog Error:", error);
        // Pass error to global handler
        next(error); 
    }
};

// @desc    Unlike a blog post
// @route   PUT /api/blogs/:id/unlike
// @access  Private
exports.unlikeBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id; // From protect middleware

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Check if the user has actually liked the post
        const likedIndex = blog.likedBy.indexOf(userId);
        if (likedIndex === -1) {
            return res.status(400).json({ message: 'Post not liked by this user' });
        }

        // Remove user from likedBy array and decrement likes count
        blog.likedBy.splice(likedIndex, 1);
        blog.likes = blog.likedBy.length; // Update count
        await blog.save();

        res.status(200).json({ message: 'Post unliked successfully', likes: blog.likes, likedBy: blog.likedBy });

    } catch (error) {
        console.error("Unlike Blog Error:", error);
         // Pass error to global handler
        next(error);
    }
};

// TODO: Implement Like/Unlike functionality - RE-ADDED
// exports.likeBlog = async (req, res, next) => { ... };
// exports.unlikeBlog = async (req, res, next) => { ... }; 