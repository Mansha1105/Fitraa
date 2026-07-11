import express from "express";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  startWorkout,
  updateSet,
  saveWorkout,
  skipWorkout,
  saveFeedback,
  getTodayWorkout,
  getRecentWorkouts,
  getWeeklyStats,
} from "../controllers/workoutController.js";


const router =
  express.Router();


// 🔥 START WORKOUT
router.post(
  "/start",
  protect,
  startWorkout
);


// 🔥 UPDATE SET STATUS
router.patch(
  "/update-set",
  protect,
  updateSet
);


// 🔥 SAVE WORKOUT
router.post(
  "/save",
  protect,
  saveWorkout
);


// 🔥 SKIP WORKOUT
router.patch(
  "/skip",
  protect,
  skipWorkout
);


// 🔥 SAVE OR UPDATE FEEDBACK
router.patch(
  "/feedback",
  protect,
  saveFeedback
);


// 🔥 GET TODAY'S WORKOUT
router.get(
  "/today",
  protect,
  getTodayWorkout
);


// 🔥 GET RECENT WORKOUTS
router.get(
  "/recent",
  protect,
  getRecentWorkouts
);


// 🔥 GET WEEKLY STATS
router.get(
  "/weekly",
  protect,
  getWeeklyStats
);


export default router;