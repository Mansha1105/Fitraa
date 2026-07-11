import mongoose from "mongoose";

const dailyProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    // 💧 WATER
    waterIntake: {
      type: Number,
      default: 0,
    },

    // 🍔 FOOD CALORIES
    caloriesConsumed: {
      type: Number,
      default: 0,
    },

    // 🔥 WORKOUT CALORIES
    caloriesBurned: {
      type: Number,
      default: 0,
    },

    // 🏋️ TOTAL WORKOUTS
    workoutsCompleted: {
      type: Number,
      default: 0,
    },

    // ⏱️ TOTAL WORKOUT TIME (minutes)
    workoutMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DailyProgress = mongoose.model(
  "DailyProgress",
  dailyProgressSchema
);

export default DailyProgress;