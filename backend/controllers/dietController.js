import DietPlan from "../models/DietPlan.js";
import DietLog from "../models/DietLog.js";

export const getDietPlan = async (req, res) => {
  try {
    const userId = req.userId;

    let plan = await DietPlan.findOne({ userId });

    if (!plan) {
      plan = await DietPlan.create({
        userId,
        meals: [
          {
            meal: "Breakfast",
            items: [
              { name: "Oats", calories: 150 },
              { name: "Banana", calories: 100 },
            ],
          },
          {
            meal: "Lunch",
            items: [
              { name: "Rice", calories: 300 },
              { name: "Dal", calories: 200 },
            ],
          },
          {
            meal: "Dinner",
            items: [
              { name: "Chapati", calories: 250 },
              { name: "Vegetables", calories: 150 },
            ],
          },
        ],
      });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getTodayLog = async (req, res) => {

  try {

    const userId = req.userId;

    // GET TODAY DATE
    const today = new Date()
      .toISOString()
      .split("T")[0];

    // FIND TODAY'S LOG
    let log = await DietLog.findOne({
      userId,
      date: today,
    });

    // CREATE EMPTY LOG IF NONE
    if (!log) {

      log = await DietLog.create({
        userId,
        date: today,
        completedMeals: [],
        extras: [],
        totalConsumedCalories: 0,
      });

    }

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
export const toggleMealCompletion = async (req, res) => {

  try {

    const userId = req.userId;

    const { mealName } = req.body;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // FIND TODAY LOG
    let log = await DietLog.findOne({
      userId,
      date: today,
    });

    // CREATE IF NONE
    if (!log) {

      log = await DietLog.create({
        userId,
        date: today,
        completedMeals: [],
        extras: [],
        totalConsumedCalories: 0,
      });

    }

    // CHECK IF ALREADY COMPLETED
    const exists = log.completedMeals.includes(
      mealName
    );

    if (exists) {

      // REMOVE
      log.completedMeals =
        log.completedMeals.filter(
          (meal) => meal !== mealName
        );

    } else {

      // ADD
      log.completedMeals.push(mealName);

    }

    await log.save();

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
export const addExtraFood = async (req, res) => {

  try {

    const userId = req.userId;

    const { name, calories, meal } = req.body;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    let log = await DietLog.findOne({
      userId,
      date: today,
    });

    // CREATE LOG IF NONE
    if (!log) {

      log = await DietLog.create({
        userId,
        date: today,
        completedMeals: [],
        extras: [],
        totalConsumedCalories: 0,
      });

    }

    // ADD EXTRA
    log.extras.push({
      name,
      calories,
      meal,
    });

    await log.save();

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
export const removeExtraFood = async (req, res) => {

  try {

    const userId = req.userId;

    const { extraId } = req.params;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    // FIND TODAY LOG
    const log = await DietLog.findOne({
      userId,
      date: today,
    });

    if (!log) {

      return res.status(404).json({
        message: "Diet log not found",
      });

    }

    // REMOVE EXTRA
    log.extras = log.extras.filter(
      (extra) =>
        extra._id.toString() !== extraId
    );

    await log.save();

    res.json(log);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};