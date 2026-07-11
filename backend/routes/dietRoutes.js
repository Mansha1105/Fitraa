import express from "express";
import { getDietPlan, getTodayLog, toggleMealCompletion, addExtraFood, removeExtraFood } from "../controllers/dietController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/plan", protect, getDietPlan);
router.get("/log", protect, getTodayLog);
router.put(
  "/toggle-meal",
  protect,
  toggleMealCompletion
);
router.post(
  "/add-extra",
  protect,
  addExtraFood
);
router.delete(
  "/remove-extra/:extraId",
  protect,
  removeExtraFood
);

export default router;