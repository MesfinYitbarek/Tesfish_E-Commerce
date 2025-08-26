// routes/product/productRoutes.js (Updated)
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
  getFeaturedProducts
} from "../../controllers/product/productController.js";
import { protect, authorize } from "../../middleware/auth/authMiddleware.js";
import { uploadMiddleware } from "../../middleware/upload/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/property-types", getPropertyTypes);
router.get("/:id", getProduct);

// Admin routes
router.get("/admin/all", protect, authorize("admin"), getProductsForAdmin);
router.get("/admin/stats", protect, authorize("admin"), getProductStats);

// Protected routes (sellers only)
router.post(
  "/",
  protect,
  authorize("company", "individual"),
  uploadMiddleware.array("images", 10),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("company", "individual", "admin"),
  uploadMiddleware.array("images", 10),
  updateProduct
);

router.put(
  "/:id/status",
  protect,
  authorize("company", "individual", "admin"),
  updateProductStatus
);

router.delete(
  "/:id",
  protect,
  authorize("company", "individual", "admin"),
  deleteProduct
);

router.get(
  "/seller/my-products",
  protect,
  authorize("company", "individual"),
  getMyProducts
);

export default router;