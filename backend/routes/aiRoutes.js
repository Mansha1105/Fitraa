import express from "express";

import {
  generateWorkout,
} from "../controllers/aiController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate-workout",
  protect,
  generateWorkout
);

export default router;