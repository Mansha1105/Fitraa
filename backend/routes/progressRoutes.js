import express from "express";

import {
  getTodayProgress,
  updateWaterIntake,
  updateCalories,
  getHistory,
  getSummary
} from "../controllers/progressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Progress route working");
});


// ✅ GET TODAY'S PROGRESS
router.get(
  "/today",
  protect,
  getTodayProgress
);


// ✅ UPDATE WATER
router.put(
  "/water",
  protect,
  updateWaterIntake
);


// ✅ UPDATE FOOD CALORIES
router.put(
  "/calories",
  protect,
  updateCalories
);

router.get(
  "/history",
  protect,
  getHistory
);

router.get(
  "/summary",
  protect,
  getSummary
);


export default router;