import Category from '../../models/Category.js';
import Product from '../../models/Product.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: { categories }
    });
  } catch (error) {
  console.error('❌ Get categories error:', error);
  res.status(500).json({
    success: false,
    message: 'Server error while fetching categories',
    error: error.message
  });
}

};

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
      .populate('subcategories')
      .populate('parentCategory');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get product count
    const productCount = await Product.countDocuments({ 
      category: category._id, 
      status: 'active' 
    });

    res.status(200).json({
      success: true,
      data: { 
        category: {
          ...category.toObject(),
          productCount
        }
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, image, icon, seo } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parentCategory: parentCategory || null,
      image,
      icon,
      seo
    });

    // Update parent category's subcategories
    if (parentCategory) {
      await Category.findByIdAndUpdate(
        parentCategory,
        { $push: { subcategories: category._id } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Update slug if name changed
    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that has products'
      });
    }

    // Remove from parent's subcategories
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(
        category.parentCategory,
        { $pull: { subcategories: category._id } }
      );
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
};