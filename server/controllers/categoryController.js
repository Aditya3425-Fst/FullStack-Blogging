const Category = require('../models/Category');


exports.createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Check if category already exists (case-insensitive check)
        const existingCategory = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existingCategory) {
            return res.status(400).json({ message: `Category '${name}' already exists.` });
        }

        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        console.error("Create Category Error:", error);
        // Handle potential validation errors from Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Error creating category', error: error.message });
        // next(error);
    }
};


exports.getAllCategories = async (req, res, next) => {
    try {
        // --- Temporary Default Category Creation (for Development) ---
        const count = await Category.countDocuments();
        if (count === 0) {
            console.log('No categories found, creating default categories...');
            await Category.insertMany([
                { name: 'Technology', description: 'Latest tech news and trends' },
                { name: 'Travel', description: 'Adventures and guides' },
                { name: 'Food', description: 'Recipes and reviews' },
                { name: 'Lifestyle', description: 'Tips and inspiration' },
                { name: 'Programming', description: 'Coding tutorials and discussions' },
            ]);
            console.log('Default categories created.');
        }
        // --- End Temporary Section ---

        const categories = await Category.find().sort('name'); // Sort alphabetically by name
        res.status(200).json(categories);
    } catch (error) {
        console.error("Get All Categories Error:", error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
        // next(error);
    }
};


exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error("Get Category By ID Error:", error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Category not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error fetching category', error: error.message });
        // next(error);
    }
};


exports.updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        // Check if category exists
        let category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if new name already exists (case-insensitive, excluding current category)
        if (name) {
            const existingCategory = await Category.findOne({
                name: { $regex: `^${name}$`, $options: 'i' },
                _id: { $ne: categoryId } // Exclude the current category from the check
            });
            if (existingCategory) {
                return res.status(400).json({ message: `Another category named '${name}' already exists.` });
            }
            category.name = name;
        }

        if (description !== undefined) { // Allow setting description to empty string
             category.description = description;
        }

        const updatedCategory = await category.save();
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Update Category Error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Category not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error updating category', error: error.message });
        // next(error);
    }
};


exports.deleteCategory = async (req, res, next) => {
    // TODO: Decide how to handle blogs associated with this category (e.g., prevent deletion, set category to null, reassign to 'Uncategorized')
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Optional: Check if any blogs use this category before deleting
        // const blogsInCategory = await Blog.countDocuments({ category: categoryId });
        // if (blogsInCategory > 0) {
        //     return res.status(400).json({ message: `Cannot delete category '${category.name}' as it is associated with ${blogsInCategory} blog post(s).` });
        // }

        await Category.deleteOne({ _id: categoryId });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Delete Category Error:", error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Category not found (invalid ID format)' });
        }
        res.status(500).json({ message: 'Error deleting category', error: error.message });
        // next(error);
    }
}; 