import WorkoutSession from "../models/WorkoutSession.js";
import DailyProgress from "../models/DailyProgress.js";


// 🔥 START WORKOUT
export const startWorkout = async (req, res) => {

  try {

    const {
      exercises,
      goal,
      level,
      type,
    } = req.body;

    const userId = req.userId;

    // ✅ VALIDATION
    if (!userId) {

      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!exercises || exercises.length === 0) {

      return res.status(400).json({
        message: "Exercises are required",
      });
    }

    // ✅ NORMALIZE EXERCISES
    const normalizedExercises =
      exercises.map((exercise) => {

        // ✅ DURATION WORKOUT
        if (exercise.duration) {

          return {

            name: exercise.name,

            completed: false,

            sets: [
              {
                reps: 1,

                duration: exercise.duration,

                completed: false,
              },
            ],
          };
        }

        // ✅ SETS WORKOUT
        const totalSets =
          Number(exercise.sets) || 1;

        return {

          name: exercise.name,

          completed: false,

          sets: Array.from(
            { length: totalSets },

            () => ({
              reps: 10,
              duration: 0,
              completed: false,
            })
          ),
        };
      });

    // ✅ SIMPLE CALORIE LOGIC
    const caloriesBurned =
      normalizedExercises.length * 20;

    // ✅ CREATE SESSION
    const session =
      new WorkoutSession({

        userId,

        workoutName:
          `${goal} Workout`,

        goal,
        level,
        type,

        caloriesBurned,

        exercises: normalizedExercises,

        status: "in-progress",

        startedAt: new Date(),
      });

    await session.save();

    res.status(201).json({

      success: true,

      message:
        "Workout started successfully 🔥",

      session,
    });

  } catch (error) {

    console.log(
      "START WORKOUT ERROR:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
};


// 🔥 UPDATE SET
export const updateSet = async (req, res) => {

  try {

    const {
      sessionId,
      exerciseIndex,
      setIndex,
    } = req.body;

    // ✅ FIND SESSION
    const session =
      await WorkoutSession.findById(
        sessionId
      );

    if (!session) {

      return res.status(404).json({
        message: "Session not found",
      });
    }

    // ✅ PREVENT DUPLICATE COMPLETION
    const alreadyCompleted =
      session.status === "completed";

    // ✅ VALIDATE EXERCISE
    if (
      !session.exercises[exerciseIndex]
    ) {

      return res.status(400).json({
        message: "Invalid exercise index",
      });
    }

    // ✅ VALIDATE SET
    if (
      !session.exercises[exerciseIndex]
        .sets[setIndex]
    ) {

      return res.status(400).json({
        message: "Invalid set index",
      });
    }

    // ✅ TOGGLE SET
   // ✅ TOGGLE SET
const set =
  session.exercises[
    exerciseIndex
  ].sets[setIndex];

set.completed =
  !set.completed;

// ✅ EXERCISE
const exercise =
  session.exercises[
    exerciseIndex
  ];

// 🔥 MARK ALL SETS SAME AS EXERCISE
exercise.completed =
  set.completed;

exercise.sets.forEach(
  (s) => {
    s.completed =
      set.completed;
  }
);

session.markModified(
  "exercises"
);

    // ✅ WORKOUT STATUS
    session.status =
      session.exercises.every(
        (e) => e.completed
      )
        ? "completed"
        : "in-progress";

    // ✅ WORKOUT COMPLETED
    if (
      session.status === "completed" &&
      !alreadyCompleted
    ) {

      session.completedAt =
        new Date();

      // ✅ REAL WORKOUT DURATION
      session.totalDuration =
        Math.floor(
          (
            session.completedAt -
            session.startedAt
          ) / 60000
        );

      // ✅ TODAY DATE
      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      // ✅ FIND DAILY PROGRESS
      let dailyProgress =
        await DailyProgress.findOne({
          userId: session.userId,
          date: today,
        });

      // ✅ CREATE IF NOT EXISTS
      if (!dailyProgress) {

        dailyProgress =
          new DailyProgress({

            userId: session.userId,

            date: today,

            waterIntake: 0,

            caloriesConsumed: 0,

            caloriesBurned: 0,

            workoutsCompleted: 0,

            workoutMinutes: 0,
          });
      }

      // ✅ UPDATE DAILY STATS
      dailyProgress.caloriesBurned +=
        session.caloriesBurned;

      dailyProgress.workoutsCompleted += 1;

      dailyProgress.workoutMinutes +=
        session.totalDuration || 0;

      await dailyProgress.save();
    }

    // ✅ SAVE SESSION
    await session.save();

    // ✅ PROGRESS %
    const completedExercises =
      session.exercises.filter(
        (e) => e.completed
      ).length;

    const totalExercises =
      session.exercises.length;

    const progress = Math.round(
      (
        completedExercises /
        totalExercises
      ) * 100
    );

    res.json({

      success: true,

      message: "Set updated ✅",

      progress,

      status: session.status,

      session,
    });

  } catch (error) {

    console.log(
      "UPDATE SET ERROR:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
};
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
// 🔥 SAVE AI WORKOUT
export const saveWorkout =
  async (req, res) => {

    try {

      const {
        userId,
        exercises,
        goal,
        level,
        type,
      } = req.body;

      if (!userId) {

        return res.status(400).json({
          message: "User ID required",
        });
      }

      if (
        !exercises ||
        exercises.length === 0
      ) {

        return res.status(400).json({
          message: "Exercises required",
        });
      }

      // ✅ NORMALIZE
      const normalizedExercises =
        exercises.map((exercise) => ({

          name: exercise.name,

          duration:
            exercise.duration || "",

          sets:
            exercise.sets || 1,

          completed: false,
        }));

      // ✅ CREATE SESSION
      const workout =
        new WorkoutSession({

          userId,

          workoutName:
            `${goal} Workout`,

          goal,
          level,
          type,

          exercises:
            normalizedExercises,

          status: "in-progress",
        });

      await workout.save();

      res.status(201).json({

        success: true,

        message:
          "Workout saved successfully",

        workout,
      });

    } catch (error) {

      console.log(
        "SAVE WORKOUT ERROR:",
        error
      );

      res.status(500).json({
        error: error.message,
      });
    }
  };

// ✅ SKIP WORKOUT
export const skipWorkout = async (
  req,
  res
) => {

  try {

    const { sessionId } =
      req.body;

    const session =
      await WorkoutSession.findById(
        sessionId
      );

    if (!session) {

      return res.status(404).json({
        success: false,
        message:
          "Workout session not found",
      });
    }

    session.status =
      "skipped";

    await session.save();

    res.json({
      success: true,
      message:
        "Workout skipped",
      session,
    });

  } catch (error) {

    console.log(
      "SKIP WORKOUT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ✅ SAVE FEEDBACK
export const saveFeedback =
  async (req, res) => {

    try {

      const {
        sessionId,
        intensity,
        energy,
        experience,
      } = req.body;

      const session =
        await WorkoutSession.findById(
          sessionId
        );

      if (!session) {

        return res.status(404).json({
          success: false,
          message:
            "Workout session not found",
        });
      }

      session.feedback = {

        intensity,

        energy,

        experience,
      };

      await session.save();

      res.json({

        success: true,

        message:
          "Feedback saved successfully",

        feedback:
          session.feedback,
      });

    } catch (error) {

      console.log(
        "SAVE FEEDBACK ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        error:
          error.message,
      });
    }
  };
export const getTodayWorkout = async (req, res) => {
  try {
    const userId = req.userId;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ✅ FIND TODAY'S WORKOUT
    const workout = await WorkoutSession.findOne({
      userId,
      startedAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({
      startedAt: -1,
    });

    // ✅ CALCULATE CURRENT STREAK
    const streak = await calculateWorkoutStreak(userId);

    // ✅ NO WORKOUT TODAY
    if (!workout) {
      return res.json({
        success: true,
        workout: null,
        streak,
      });
    }

    // ✅ RETURN TODAY'S WORKOUT
    res.json({
      success: true,
      workout,
      streak,
    });

  } catch (error) {

    console.log(
      "GET TODAY WORKOUT ERROR:",
      error
    );

    res.status(500).json({
      error: error.message,
    });
  }
};
export const getRecentWorkouts =
  async (req, res) => {

    try {

       const userId = req.userId;

      const workouts =
        await WorkoutSession
          .find({
            userId,
          })
          .sort({
            startedAt: -1,
          })
          .limit(3);

      res.json({

        success: true,

        workouts,
      });

    } catch (error) {

      console.log(
        "GET RECENT WORKOUTS ERROR:",
        error
      );

      res.status(500).json({
        error:
          error.message,
      });
    }
  };

export const getWeeklyStats = async (req, res) => {

  try {

    // User ID comes from JWT token
    const userId = req.userId;

    const today = new Date();

    // Find the starting day of the current week
    const firstDay = new Date(today);

    firstDay.setDate(
      today.getDate() -
      today.getDay()
    );

    firstDay.setHours(
      0,
      0,
      0,
      0
    );

    // Get this week's workouts
    const workouts =
      await WorkoutSession.find({
        userId,

        startedAt: {
          $gte: firstDay,
        },
      });


    const completedDays = [];

    const skippedDays = [];


    workouts.forEach(
      (workout) => {

        // JavaScript day format:
        // Sunday = 0
        // Monday = 1
        // Tuesday = 2
        // ...
        // Saturday = 6

        const jsDay =
          new Date(
            workout.startedAt
          ).getDay();


        // Convert into Dashboard format:
        // Monday = 0
        // Tuesday = 1
        // Wednesday = 2
        // Thursday = 3
        // Friday = 4
        // Saturday = 5
        // Sunday = 6

        const day =
          (jsDay + 6) % 7;


        // COMPLETED WORKOUT
        if (
          workout.status ===
          "completed"
        ) {

          if (
            !completedDays.includes(
              day
            )
          ) {

            completedDays.push(
              day
            );
          }
        }


        // SKIPPED WORKOUT
        if (
          workout.status ===
          "skipped"
        ) {

          if (
            !skippedDays.includes(
              day
            )
          ) {

            skippedDays.push(
              day
            );
          }
        }

      }
    );


    return res.status(200).json({

      success: true,

      completedDays,

      skippedDays,

    });


  } catch (error) {

    console.log(
      "WEEKLY STATS ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      error:
        error.message,

    });

  }

};