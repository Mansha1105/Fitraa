import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    default: 0,
  },

  // ✅ duration as string
  duration: {
    type: String,
    default: "",
  },

  weight: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  sets: [setSchema],

  completed: {
    type: Boolean,
    default: false,
  },
});

const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  workoutName: {
    type: String,
    default: "FITRAAA Workout",
  },

  goal: {
    type: String,
  },

  level: {
    type: String,
  },

  type: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  startedAt: {
    type: Date,
    default: Date.now,
  },

  completedAt: {
    type: Date,
  },

  totalDuration: {
    type: Number,
    default: 0,
  },

  caloriesBurned: {
    type: Number,
    default: 0,
  },

  exercises: [exerciseSchema],

  status: {
    type: String,
    enum: [
      "in-progress",
      "completed",
      "skipped",
    ],
    default: "in-progress",
  },

  // ✅ FEEDBACK
  feedback: {
    intensity: {
      type: String,
      default: "",
    },

    energy: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },
  },

  notes: {
    type: String,
    default: "",
  },
});

const WorkoutSession = mongoose.model(
  "WorkoutSession",
  workoutSessionSchema
);

export default WorkoutSession;