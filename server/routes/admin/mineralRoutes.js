// routes/admin/mineralRoutes.js
import express from "express";
import { body } from "express-validator";
import {
  getMineralsForAdmin,
  createMineral,
  updateMineral,
  deleteMineral,
  getMineralStats,
  getMineralById,
  updateMineralStatus,
  getMineralTypes
} from "../../controllers/admin/adminMineralController.js";
import { protect, authorize } from "../../middleware/auth/authMiddleware.js";
import { uploadConfigs } from "../../middleware/upload/uploadMiddleware.js";
import { handleValidationErrors } from "../../middleware/validation/validationMiddleware.js";

const router = express.Router();

// Basic mineral validation
// const mineralValidation = [
//   body('title')
//     .notEmpty()
//     .withMessage('Mineral title is required')
//     .isLength({ min: 3, max: 200 })
//     .withMessage('Title must be between 3 and 200 characters'),

//   body('description')
//     .notEmpty()
//     .withMessage('Description is required'),

//   body('mineralDetails.mineralName')
//     .notEmpty()
//     .withMessage('Mineral name is required'),

//   body('mineralDetails.mineralType')
//     .isIn([
//       'gold', 'silver', 'copper', 'iron', 'zinc', 'lead',
//       'gemstones', 'coal', 'salt', 'limestone',
//       'marble', 'granite', 'sand', 'gravel', 'other'
//     ])
//     .withMessage('Invalid mineral type'),

//   body('pricing.basePrice')
//     .toFloat()
//     .isFloat({ min: 0 })
//     .withMessage('Base price must be a positive number'),

//   handleValidationErrors
// ];


// ================= ADMIN MINERAL ROUTES =================

// Get all minerals for admin
router.get("/", protect, authorize("admin"), getMineralsForAdmin);

// Get mineral statistics
router.get("/stats", protect, authorize("admin"), getMineralStats);

// Get mineral types
router.get("/types", protect, authorize("admin"), getMineralTypes);

// Get single mineral
router.get("/:id", protect, authorize("admin"), getMineralById);

// Create new mineral (admin only)
router.post("/", protect, authorize("admin"), uploadConfigs.productMedia,  createMineral);

// Update mineral
router.put("/:id", protect, authorize("admin"), uploadConfigs.productMedia,  updateMineral);

// Update mineral status
router.put("/:id/status", protect, authorize("admin"), updateMineralStatus);

// Delete mineral
router.delete("/:id", protect, authorize("admin"), deleteMineral);

export default router;