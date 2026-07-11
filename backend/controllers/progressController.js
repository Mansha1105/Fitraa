import DailyProgress from "../models/DailyProgress.js";
import WorkoutSession from "../models/WorkoutSession.js";
import DietLog from "../models/DietLog.js";
import User from "../models/User.js";

const calculateWorkoutStreak = async (userId) => {
  const sessions = await WorkoutSession.find({
    userId,
    status: "completed",
  }).sort({
    startedAt: -1,
  });

  if (!sessions.length) return 0;

  // One workout per day
  const completedDates = [
    ...new Set(
      sessions.map((session) =>
        new Date(session.startedAt).toLocaleDateString("en-CA")
      )
    ),
  ];

  const completedSet = new Set(completedDates);

  let streak = 0;

  let currentDate = new Date();

  const today = currentDate.toLocaleDateString("en-CA");

  // If today's workout isn't completed,
  // start checking from yesterday.
  if (!completedSet.has(today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  

  while (true) {
    const dateString = currentDate.toLocaleDateString("en-CA");

    if (completedSet.has(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
// GET TODAY'S PROGRESS
export const getTodayProgress = async (req, res) => {
  try {

    const today = new Date().toISOString().split("T")[0];

    let progress = await DailyProgress.findOne({
      userId: req.userId,
      date: today,
    });

    // CREATE NEW DAILY RECORD IF NOT EXISTS
    if (!progress) {
      progress = await DailyProgress.create({
  userId: req.userId,
  date: today,

  waterIntake: 0,

  caloriesConsumed: 0,

  caloriesBurned: 0,

  workoutsCompleted: 0,

  workoutMinutes: 0,
});
    }

    res.status(200).json(progress);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};




// UPDATE WATER INTAKE
export const updateWaterIntake = async (req, res) => {
  try {

    const { amount } = req.body;

    const today = new Date().toISOString().split("T")[0];

    let progress = await DailyProgress.findOne({
      userId: req.userId,
      date: today,
    });

    // CREATE IF NOT EXISTS
    if (!progress) {
      progress = await DailyProgress.create({
  userId: req.userId,
  date: today,

  waterIntake: 0,

  caloriesConsumed: 0,

  caloriesBurned: 0,

  workoutsCompleted: 0,

  workoutMinutes: 0,
});
    }

    progress.waterIntake += amount;

    await progress.save();

    res.status(200).json(progress);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};




// UPDATE CALORIES
export const updateCalories = async (
  req,
  res
) => {
  try {
    const { calories } = req.body;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    let progress =
      await DailyProgress.findOne({
        userId: req.userId,
        date: today,
      });

    if (!progress) {
      progress =
        await DailyProgress.create({
          userId: req.userId,
          date: today,
          waterIntake: 0,
          caloriesConsumed: 0,
          caloriesBurned: 0,
          workoutsCompleted: 0,
          workoutMinutes: 0,
        });
    }

    progress.caloriesConsumed +=
      calories;

    if (
      progress.caloriesConsumed < 0
    ) {
      progress.caloriesConsumed = 0;
    }

    await progress.save();

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

 export const getHistory = async (req, res) => {
  try {
    const history = await DailyProgress.find({
      userId: req.userId,
    })
      .sort({ date: -1 })
      .limit(7);

    const formatted = history
      .reverse()
      .map((day) => ({
        // Raw date (used for matching on frontend)
        date: day.date,

        // Display date (used for charts)
        displayDate: new Date(day.date).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
          }
        ),

        // Day name (Mon, Tue, Wed...)
        dayName: new Date(day.date).toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),

        calories: day.caloriesConsumed,
        workouts: day.workoutsCompleted,
        water: day.waterIntake,
        minutes: day.workoutMinutes,
      }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getSummary = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const todayProgress = await DailyProgress.findOne({
      userId: req.userId,
      date: today,
    });

    const totalWorkouts = await WorkoutSession.countDocuments({
      userId: req.userId,
      status: "completed",
    });

    // Current streak
    const currentStreak = await calculateWorkoutStreak(
      req.userId
    );

    // Today's diet log
    const dietLog = await DietLog.findOne({
      userId: req.userId,
      date: today,
    });

    // 🍔 Food calories (used for daily score)
    const calories =
      dietLog?.totalConsumedCalories || 0;

    // 🔥 Workout calories (display on Progress page)
    const caloriesBurned =
      todayProgress?.caloriesBurned || 0;

    const workouts =
      todayProgress?.workoutsCompleted || 0;

    let score = 0;

    // Workout Score
    if (workouts > 0) {
      score += 50;
    }

    // Diet Score
    if (
      calories > 0 &&
      calories <= user.calorieGoal
    ) {
      score += 50;
    } else if (
      calories > 0 &&
      calories <= user.calorieGoal * 1.2
    ) {
      score += 30;
    }

    res.status(200).json({
      totalWorkouts,
      currentStreak,
      calories,          // Food calories
      caloriesBurned,    // Workout calories
      dailyScore: score,
      calorieGoal: user.calorieGoal,
      workouts,
    });

  } catch (error) {
    console.error(
      "GET SUMMARY ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};