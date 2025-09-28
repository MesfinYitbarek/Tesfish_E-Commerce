// controllers/admin/adminMineralController.js
import { validationResult } from "express-validator";
import slugify from "slugify";
import Product from "../../models/Product.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/upload/cloudinaryService.js";

// @desc    Get all minerals for admin
// @route   GET /api/admin/minerals
// @access  Private (Admin only)
export const getMineralsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query for minerals only
    let query = { productType: 'minerals' };

    // Search
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { 'mineralDetails.mineralName': { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Mineral type filter
    if (req.query.mineralType) {
      query['mineralDetails.mineralType'] = req.query.mineralType;
    }

    // Origin region filter
    if (req.query.region) {
      query['mineralDetails.origin.region'] = new RegExp(req.query.region, 'i');
    }

    // Quality grade filter
    if (req.query.qualityGrade) {
      query['mineralDetails.quality.grade'] = req.query.qualityGrade;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query['pricing.basePrice'] = {};
      if (req.query.minPrice) {
        query['pricing.basePrice'].$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['pricing.basePrice'].$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case 'price-low':
        sort = { 'pricing.basePrice': 1 };
        break;
      case 'price-high':
        sort = { 'pricing.basePrice': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'name':
        sort = { 'mineralDetails.mineralName': 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Fetch minerals
    const minerals = await Product.find(query)
      .populate('seller', 'email displayName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        minerals,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMinerals: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        }
      },
    });
  } catch (error) {
    console.error("Get minerals for admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching minerals",
    });
  }
};

// @desc    Create new mineral
// @route   POST /api/admin/minerals
// @access  Private (Admin only)
export const createMineral = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    // Parse JSON fields
    const parsedFields = [
      "pricing",
      "inventory",
      "mineralDetails",
      "contactInfo",
      "media",
      "specifications",
      "tags",
      "imageMetadata"
    ];

    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field] ? JSON.parse(req.body[field]) : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
          // fallback default
          req.body[field] =
            field === "specifications" || field === "tags" || field === "imageMetadata"
              ? []
              : {};
        }
      }
    });

    // Normalize pricing.priceType (fix dash vs underscore mismatch)
    if (req.body.pricing && req.body.pricing.priceType) {
      req.body.pricing.priceType = req.body.pricing.priceType.replace("-", "_");
    }

    // Build mineral data
    const mineralData = {
      ...req.body,
      productType: "minerals",
      seller: req.user.id,
      sellerType: "admin",
      slug: slugify(req.body.title, { lower: true, strict: true }),
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      try {
        const imagePromises = req.files.map(async (file, index) => {
          const uploadResult = await uploadToCloudinary(file.path, "minerals");
          return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt: `${req.body.title} - Image ${index + 1}`,
            isPrimary: index === 0,
          };
        });

        mineralData.media = mineralData.media || {};
        mineralData.media.images = await Promise.all(imagePromises);
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload mineral images",
          error: uploadError.message,
        });
      }
    }

    // Generate unique slug
    let slug = mineralData.slug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${mineralData.slug}-${counter++}`;
    }
    mineralData.slug = slug;

    // Create mineral
    const mineral = await Product.create(mineralData);

    res.status(201).json({
      success: true,
      message: "Mineral created successfully",
      data: { mineral },
    });
  } catch (error) {
    console.error("Create mineral error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating mineral",
    });
  }
};


// @desc    Update mineral
// @route   PUT /api/admin/minerals/:id
// @access  Private (Admin only)
export const updateMineral = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    let mineral = await Product.findOne({ _id: req.params.id, productType: "minerals" });

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    // Parse JSON fields
    const parsedFields = [
      "pricing",
      "inventory",
      "mineralDetails",
      "contactInfo",
      "media",
      "specifications",
      "tags",
      "imageMetadata"
    ];

    parsedFields.forEach((field) => {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = req.body[field] ? JSON.parse(req.body[field]) : {};
        } catch (e) {
          console.warn(`Invalid JSON for ${field}:`, e.message);
          req.body[field] =
            field === "specifications" || field === "tags" || field === "imageMetadata"
              ? []
              : {};
        }
      }
    });

    // Normalize pricing.priceType
    if (req.body.pricing && req.body.pricing.priceType) {
      req.body.pricing.priceType = req.body.pricing.priceType.replace("-", "_");
    }

    const updateData = { ...req.body };

    // Update slug if title changed
    if (req.body.title && req.body.title !== mineral.title) {
      updateData.slug = slugify(req.body.title, { lower: true, strict: true });

      // Ensure unique slug
      let slug = updateData.slug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: mineral._id } })) {
        slug = `${updateData.slug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) =>
        uploadToCloudinary(file.path, "minerals")
      );
      const uploadedImages = await Promise.all(imagePromises);

      const newImages = uploadedImages.map((img, index) => ({
        url: img.secure_url,
        publicId: img.public_id,
        alt: `${req.body.title || mineral.title} - Image ${index + 1}`,
        isPrimary: false,
      }));

      updateData.media = {
        ...mineral.media?.toObject(),
        images: [...(mineral.media?.images || []), ...newImages],
      };
    }

    mineral = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Mineral updated successfully",
      data: { mineral },
    });
  } catch (error) {
    console.error("Update mineral error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating mineral",
    });
  }
};


// @desc    Delete mineral
// @route   DELETE /api/admin/minerals/:id
// @access  Private (Admin only)
export const deleteMineral = async (req, res) => {
  try {
    const mineral = await Product.findOne({ _id: req.params.id, productType: 'minerals' });

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    // Delete images from cloudinary
    if (mineral.media.images && mineral.media.images.length > 0) {
      const deletePromises = mineral.media.images.map((img) => {
        if (img.publicId) {
          return deleteFromCloudinary(img.publicId);
        }
      });
      await Promise.all(deletePromises);
    }

    await mineral.deleteOne();

    res.status(200).json({
      success: true,
      message: "Mineral deleted successfully",
    });
  } catch (error) {
    console.error("Delete mineral error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting mineral",
    });
  }
};

// @desc    Get mineral by ID
// @route   GET /api/admin/minerals/:id
// @access  Private (Admin only)
export const getMineralById = async (req, res) => {
  try {
    const mineral = await Product.findOne({ _id: req.params.id, productType: 'minerals' })
      .populate('seller', 'email displayName')
      .populate('category', 'name slug');

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { mineral },
    });
  } catch (error) {
    console.error("Get mineral by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching mineral",
    });
  }
};

// @desc    Update mineral status
// @route   PUT /api/admin/minerals/:id/status
// @access  Private (Admin only)
export const updateMineralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const mineral = await Product.findOne({ _id: req.params.id, productType: 'minerals' });

    if (!mineral) {
      return res.status(404).json({
        success: false,
        message: "Mineral not found",
      });
    }

    const oldStatus = mineral.status;
    mineral.status = status;

    // Update availability based on status
    if (status === 'sold' || status === 'out-of-stock') {
      mineral.availability.isAvailable = false;
    } else if (status === 'active') {
      mineral.availability.isAvailable = true;
    }

    await mineral.save();

    res.status(200).json({
      success: true,
      message: `Mineral status updated from ${oldStatus} to ${status}`,
      data: { mineral },
    });
  } catch (error) {
    console.error("Update mineral status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating mineral status",
    });
  }
};

// @desc    Get mineral statistics
// @route   GET /api/admin/minerals/stats
// @access  Private (Admin only)
export const getMineralStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { productType: 'minerals' } },
      {
        $facet: {
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalValue: { $sum: '$pricing.basePrice' }
              }
            }
          ],
          byMineralType: [
            {
              $group: {
                _id: '$mineralDetails.mineralType',
                count: { $sum: 1 },
                avgPrice: { $avg: '$pricing.basePrice' }
              }
            }
          ],
          byQualityGrade: [
            {
              $group: {
                _id: '$mineralDetails.quality.grade',
                count: { $sum: 1 },
                avgPrice: { $avg: '$pricing.basePrice' }
              }
            }
          ],
          overview: [
            {
              $group: {
                _id: null,
                totalMinerals: { $sum: 1 },
                totalValue: { $sum: '$pricing.basePrice' },
                avgPrice: { $avg: '$pricing.basePrice' },
                totalViews: { $sum: '$views' }
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    console.error("Get mineral stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching mineral statistics",
    });
  }
};

// @desc    Get mineral types
// @route   GET /api/admin/minerals/types
// @access  Private (Admin only)
export const getMineralTypes = async (req, res) => {
  try {
    const mineralTypes = await Product.aggregate([
      { $match: { productType: 'minerals', status: 'active' } },
      {
        $group: {
          _id: '$mineralDetails.mineralType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$pricing.basePrice' },
          minPrice: { $min: '$pricing.basePrice' },
          maxPrice: { $max: '$pricing.basePrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: { mineralTypes }
    });
  } catch (error) {
    console.error("Get mineral types error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching mineral types",
    });
  }
};