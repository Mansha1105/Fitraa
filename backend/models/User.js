import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ PROFILE
    age: Number,

    height: Number,

    weight: Number,

    gender: String,

    goal: String,

    workoutType: String,

    // ✅ SETTINGS / PREFERENCES
    targetWeight: Number,

    calorieGoal: {
      type: Number,
      default: 2000,
    },

    waterGoal: {
      type: Number,
      default: 3.5,
    },

    // ✅ PROFILE PHOTO
    profilePhoto: String,
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);