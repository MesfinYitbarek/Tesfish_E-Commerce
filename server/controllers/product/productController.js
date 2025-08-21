import { validationResult } from "express-validator";
import slugify from "slugify";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import fs from 'fs';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/upload/cloudinaryService.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: "active" };

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query["pricing.basePrice"] = {};
      if (req.query.minPrice)
        query["pricing.basePrice"].$gte = Number(req.query.minPrice);
      if (req.query.maxPrice)
        query["pricing.basePrice"].$lte = Number(req.query.maxPrice);
    }

    // Product type
    if (req.query.productType) {
      query.productType = req.query.productType;
    }

    // Location filter for real estate
    if (req.query.city) {
      query["realEstateDetails.location.city"] = new RegExp(
        req.query.city,
        "i"
      );
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case "price-low":
        sort = { "pricing.basePrice": 1 };
        break;
      case "price-high":
        sort = { "pricing.basePrice": -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate(
        "seller",
        "companyProfile.companyName individualProfile.firstName individualProfile.lastName"
      )
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "companyProfile individualProfile sellerRating")
      .populate("category", "name slug")
      .populate("subcategory", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};


// @desc    get product
// @route   POST /api/admin
// @access  Private (admin only)

export const getProductsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Initialize empty query object (no "active" status restriction)
    let query = {};

    // Search
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
      query["pricing.basePrice"] = {};
      if (req.query.minPrice) {
        query["pricing.basePrice"].$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query["pricing.basePrice"].$lte = Number(req.query.maxPrice);
      }
    }

    // Product type
    if (req.query.productType) {
      query.productType = req.query.productType;
    }

    // Location filter for real estate
    if (req.query.city) {
      query["realEstateDetails.location.city"] = new RegExp(req.query.city, "i");
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case "price-low":
        sort = { "pricing.basePrice": 1 };
        break;
      case "price-high":
        sort = { "pricing.basePrice": -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { views: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate(
        "seller",
        "companyProfile.companyName individualProfile.firstName individualProfile.lastName"
      )
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Sellers only)

export const createProduct = async (req, res) => {
  try {
    // 1. Parse incoming fields that might be stringified JSON
    const parsedFields = [
      "pricing",
      "inventory",
      "realEstateDetails",
      "serviceDetails",
      "shipping",
      "seo",
      "specifications",
      "variants",
    ];

    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field]
            ? JSON.parse(req.body[field])
            : field === "specifications" || field === "variants"
            ? []
            : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
          req.body[field] =
            field === "specifications" || field === "variants" ? [] : {};
        }
      }
    });

    // 2. Handle empty subcategory
    if (req.body.subcategory === '' || req.body.subcategory === 'null') {
      req.body.subcategory = null;
    }

    // 3. Handle promotionExpiry
    if (req.body.promotionExpiry === "null") {
      req.body.promotionExpiry = null;
    }

    // 4. Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Clean up any uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        await Promise.all(
          req.files.map(file => 
            fs.promises.unlink(file.path).catch(console.error)
        ));
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      });
    }

    // 5. Build product data
    const productData = {
      ...req.body,
      pricing: {
        ...req.body.pricing,
        basePrice: req.convertedBasePrice || req.body.pricing.basePrice,
      },
      seller: req.user.id,
      sellerType: req.user.userType,
      slug: slugify(req.body.title, { lower: true, strict: true }),
    };

    // 6. Handle file uploads
    if (req.files && req.files.length > 0) {
      try {
        const imagePromises = req.files.map((file) =>
          uploadToCloudinary(file.path, "products")
        );
        const uploadedImages = await Promise.all(imagePromises);

        productData.media = {
          images: uploadedImages.map((img, index) => ({
            url: img.secure_url,
            publicId: img.public_id,
            alt: `${req.body.title} - Image ${index + 1}`,
            isPrimary: index === 0,
          })),
        };

        // Clean up local files after successful upload
        await Promise.all(
          req.files.map(file => 
            fs.promises.unlink(file.path).catch(console.error)
        ));
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        
        // Clean up any files that might have been uploaded
        if (productData.media?.images) {
          await Promise.all(
            productData.media.images.map(img => 
              deleteFromCloudinary(img.publicId).catch(console.error)
            )
          );
        }

        // Clean up local files
        await Promise.all(
          req.files.map(file => 
            fs.promises.unlink(file.path).catch(console.error)
        ));

        return res.status(500).json({
          success: false,
          message: "Failed to upload product images",
        });
      }
    }

    // 7. Generate unique slug
    let slug = productData.slug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${productData.slug}-${counter++}`;
    }
    productData.slug = slug;

    // 8. Save to DB
    const product = await Product.create(productData);

    // 9. Send response
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });

  } catch (error) {
    console.error("Create product error:", error);

    // Handle specific errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Duplicate product" 
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Product owner only)
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (
      product.seller.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Use the converted price from validation middleware if available
    const updateData = {
      ...req.body,
      pricing: {
        ...req.body.pricing,
        basePrice: req.convertedBasePrice || req.body.pricing.basePrice,
      },
    };

    // Update slug if title changed
    if (req.body.title && req.body.title !== product.title) {
      updateData.slug = slugify(req.body.title, { lower: true, strict: true });

      // Ensure unique slug
      let slug = updateData.slug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${updateData.slug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file) =>
        uploadToCloudinary(file.path, "products")
      );
      const uploadedImages = await Promise.all(imagePromises);

      const newImages = uploadedImages.map((img, index) => ({
        url: img.secure_url,
        alt: `${req.body.title || product.title} - Image ${index + 1}`,
        isPrimary: false,
      }));

      updateData.media = {
        ...product.media.toObject(),
        images: [...(product.media.images || []), ...newImages],
      };
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Update product error:", error);

    // Handle validation errors from Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Product owner only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check ownership
    if (
      product.seller.toString() !== req.user.id &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Delete images from cloudinary
    if (product.media.images && product.media.images.length > 0) {
      const deletePromises = product.media.images.map((img) => {
        const publicId = img.url.split("/").pop().split(".")[0];
        return deleteFromCloudinary(publicId);
      });
      await Promise.all(deletePromises);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

// @desc    Get seller's products
// @route   GET /api/products/seller/my-products
// @access  Private (Sellers only)
export const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = { seller: req.user.id };

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
        },
      },
    });
  } catch (error) {
    console.error("Get my products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your products",
    });
  }
};
