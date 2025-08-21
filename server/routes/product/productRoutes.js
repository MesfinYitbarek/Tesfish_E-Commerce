import express from "express";
import mongoose from 'mongoose';
import { body } from "express-validator";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductsForAdmin,
} from "../../controllers/product/productController.js";
import { protect, authorize } from "../../middleware/auth/authMiddleware.js";
import { uploadMiddleware } from "../../middleware/upload/uploadMiddleware.js";

const router = express.Router();

// Enhanced Validation rules
const productValidation = [
  body("title").notEmpty().trim().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("productType")
    .isIn(["physical", "digital", "service", "real-estate", "rental"])
    .withMessage("Invalid product type"),

  // Robust pricing validation

  body("pricing.currency").optional().isString(),
  body("pricing.priceType")
    .optional()
    .isIn([
      "fixed",
      "starting-from",
      "per-unit",
      "per-hour",
      "per-day",
      "per-month",
    ]),
  body("pricing.isNegotiable").optional().isBoolean(),
 body('subcategory')
  .optional({ nullable: true })
  .customSanitizer(value => {
    // Convert empty string or 'null' string to actual null
    if (value === '' || value === 'null') return null;
    return value;
  })
  .custom(value => {
    // Allow null/undefined
    if (value === null || value === undefined) return true;
    
    // If value exists, validate it's a proper ObjectId
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid subcategory ID format');
    }
    return true;
  }),
  body("specifications")
    .optional()
    .custom((value) => {
      try {
        if (typeof value === "string") {
          JSON.parse(value);
        }
        return true;
      } catch {
        throw new Error("Invalid specifications format");
      }
    }),
  body("variants")
    .optional()
    .custom((value) => {
      try {
        if (typeof value === "string") {
          JSON.parse(value);
        }
        return true;
      } catch {
        throw new Error("Invalid variants format");
      }
    }),
  body("promotionExpiry")
    .optional()
    .custom((value) => {
      if (value === "null") return true;
      if (value && isNaN(new Date(value))) {
        throw new Error("Invalid date format");
      }
      return true;
    }),
];

// Public routes
router.get("/", getProducts);
router.get("/admin", getProductsForAdmin);
router.get("/:id", getProduct);

// Protected routes (sellers only)
router.post(
  "/",
  protect,
  authorize("company", "individual"),
  uploadMiddleware.array("images", 10),
  productValidation,
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("company", "individual", "admin"),
  uploadMiddleware.array("images", 10),
  productValidation,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("company", "individual"),
  deleteProduct
);

router.get(
  "/seller/my-products",
  protect,
  authorize("company", "individual"),
  getMyProducts
);

export default router;
