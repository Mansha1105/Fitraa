import mongoose from "mongoose";

const extraFoodSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  meal: String,
});

const dietLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    date: {
      type: String,
    },

    completedMeals: [String],

    extras: [extraFoodSchema],

    totalConsumedCalories: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DietLog = mongoose.model("DietLog", dietLogSchema);

export default DietLog;