import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductsForAdmin,
  getProductStats,
  updateProductStatus,
  getPropertyTypes,
  getFeaturedProducts,
} from "../../controllers/product/productController.js";
import { protect, authorize } from "../../middleware/auth/authMiddleware.js";
import { uploadConfigs } from "../../middleware/upload/uploadMiddleware.js"; 
import { handleValidationErrors } from "../../middleware/validation/validationMiddleware.js";

const router = express.Router();

// Enhanced validation rules for product creation/update (including minerals)
const productValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('productType')
    .notEmpty()
    .withMessage('Product type is required')
    .isIn(['homes', 'plots', 'commercials', 'others', 'minerals']) // Added minerals
    .withMessage('Invalid product type'),
  
  body('subProductType')
    .notEmpty()
    .withMessage('Sub product type is required'),
  
  body('listingType')
    .optional()
    .isIn(['sell', 'rent'])
    .withMessage('Listing type must be either sell or rent'),
  
  body('pricing.basePrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  
  body('pricing.currency')
    .optional()
    .isIn(['ETB', 'USD', 'EUR'])
    .withMessage('Invalid currency'),
  
  // Mineral-specific validation
  body('mineralDetails.mineralName')
    .if(body('productType').equals('minerals'))
    .notEmpty()
    .withMessage('Mineral name is required for minerals'),
  
  body('mineralDetails.mineralType')
    .if(body('productType').equals('minerals'))
    .isIn(['gold', 'silver', 'copper', 'iron', 'zinc', 'lead', 'gemstones', 'coal', 'salt', 'limestone', 'marble', 'granite', 'sand', 'gravel', 'other'])
    .withMessage('Invalid mineral type'),
  
  body('mineralDetails.quality.purity')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Purity must be between 0 and 100'),
  
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  
  handleValidationErrors
];

// ================= PUBLIC ROUTES =================
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/property-types", getPropertyTypes);
router.get("/:id", getProduct);

// ================= ADMIN ROUTES =================
router.get("/admin/all", protect, authorize("admin"), getProductsForAdmin);
router.get("/admin/stats", protect, authorize("admin"), getProductStats);

// ================= SELLER ROUTES =================
router.get("/seller/my-products", protect, authorize("company", "individual", "admin"), getMyProducts);

// ================= PROTECTED ROUTES (CRUD) =================
router.post("/", protect, authorize("company", "individual", "admin"), uploadConfigs.productMedia, productValidation, createProduct);
router.put("/:id", protect, authorize("company", "individual", "admin"), uploadConfigs.productMedia, productValidation, updateProduct);
router.put("/:id/status", protect, authorize("company", "individual", "admin"), updateProductStatus);
router.delete("/:id", protect, authorize("company", "individual", "admin"), deleteProduct);


// ================= ADDITIONAL ROUTES =================

// Route to increment product views (public)
router.post(
  "/:id/views",
  async (req, res) => {
    try {
      // Simple view increment without authentication
      await Product.findByIdAndUpdate(
        req.params.id,
        { $inc: { 'analytics.views': 1 } }
      );
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update views' });
    }
  }
);

// Route to report a product (protected)
router.post(
  "/:id/report",
  protect,
  [
    body('reason')
      .notEmpty()
      .withMessage('Report reason is required')
      .isIn(['inappropriate', 'spam', 'fake', 'other'])
      .withMessage('Invalid report reason'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      // Handle product reporting logic here
      // This would typically create a report record and notify admins
      res.status(200).json({ 
        success: true, 
        message: 'Product reported successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to report product' 
      });
    }
  }
);

// Route to share product via email (protected)
router.post(
  "/:id/share",
  protect,
  [
    body('recipientEmail')
      .isEmail()
      .withMessage('Valid recipient email is required'),
    body('senderName')
      .notEmpty()
      .withMessage('Sender name is required'),
    body('message')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Message must be less than 500 characters'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      // Handle product sharing logic here
      // This would typically send an email with product details
      res.status(200).json({ 
        success: true, 
        message: 'Product shared successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to share product' 
      });
    }
  }
);

// Route to compare products (public)
router.post(
  "/compare",
  [
    body('productIds')
      .isArray({ min: 2, max: 4 })
      .withMessage('2-4 product IDs are required for comparison'),
    body('productIds.*')
      .isMongoId()
      .withMessage('Invalid product ID format'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { productIds } = req.body;
      
      const products = await Product.find({
        _id: { $in: productIds },
        status: 'active'
      }).select('title pricing propertyDetails vehicleDetails specifications media');
      
      if (products.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'At least 2 active products are required for comparison'
        });
      }
      
      res.status(200).json({
        success: true,
        data: { products }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to compare products'
      });
    }
  }
);

// Route to get related products (public)
router.get(
  "/:id/related",
  async (req, res) => {
    try {
      const productId = req.params.id;
      const limit = parseInt(req.query.limit) || 4;
      
      // Get the current product to find related ones
      const currentProduct = await Product.findById(productId);
      if (!currentProduct) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      // Find related products based on product type, location, and price range
      const relatedQuery = {
        _id: { $ne: productId },
        status: 'active',
        productType: currentProduct.productType
      };
      
      // Add location matching for real estate
      if (['homes', 'plots', 'commercials'].includes(currentProduct.productType)) {
        if (currentProduct.propertyDetails?.location?.city) {
          relatedQuery['propertyDetails.location.city'] = currentProduct.propertyDetails.location.city;
        }
      }
      
      const relatedProducts = await Product.find(relatedQuery)
        .select('title pricing media.images propertyDetails.location slug')
        .limit(limit)
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        data: { products: relatedProducts }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch related products'
      });
    }
  }
);

export default router;