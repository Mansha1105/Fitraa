export const generateWorkout = async (req, res) => {

  console.log("AI ROUTE HIT");
  console.log(req.body);

  const {
    goal,
    level,
    type,
  } = req.body;

  const userId = req.userId;

  // ✅ VALIDATION
  if (
    !userId ||
    !goal ||
    !level ||
    !type
  ) {

    return res.status(400).json({
      error:
        "Authenticated user, goal, level and type are required",
    });
  }

  try {

    let workouts = [];

    // 🔥 FAT LOSS
    if (goal === "Fat Loss") {

      // CARDIO
      if (type === "Cardio") {

        workouts = [

          {
            name: "Jumping Jacks",
            duration: "30 sec",
          },

          {
            name: "Mountain Climbers",
            duration: "30 sec",
          },

          {
            name: "High Knees",
            duration: "30 sec",
          },

          {
            name: "Burpees",
            sets: 3,
          },
        ];
      }

      // YOGA
      else if (type === "Yoga") {

        workouts = [

          {
            name: "Sun Salutation",
            duration: "1 min",
          },

          {
            name: "Warrior Pose",
            duration: "40 sec",
          },

          {
            name: "Tree Pose",
            duration: "40 sec",
          },

          {
            name: "Child Pose",
            duration: "1 min",
          },
        ];
      }

      // GYM
      else if (type === "Gym") {

        workouts = [

          {
            name: "Treadmill",
            duration: "10 min",
          },

          {
            name: "Cycling",
            duration: "10 min",
          },

          {
            name: "Rowing Machine",
            duration: "5 min",
          },

          {
            name: "Elliptical",
            duration: "8 min",
          },
        ];
      }

      // HOME
      else {

        workouts = [

          {
            name: "Jumping Jacks",
            duration: "20 sec",
          },

          {
            name: "High Knees",
            duration: "20 sec",
          },

          {
            name: "Mountain Climbers",
            duration: "20 sec",
          },

          {
            name: "Burpees",
            sets: 3,
          },
        ];
      }
    }

    // 🔥 MUSCLE GAIN
    else if (goal === "Muscle Gain") {

      // GYM
      if (type === "Gym") {

        workouts = [

          {
            name: "Bench Press",
            sets: 4,
          },

          {
            name: "Deadlift",
            sets: 4,
          },

          {
            name: "Leg Press",
            sets: 3,
          },

          {
            name: "Shoulder Press",
            sets: 3,
          },
        ];
      }

      // YOGA
      else if (type === "Yoga") {

        workouts = [

          {
            name: "Chair Pose",
            duration: "45 sec",
          },

          {
            name: "Boat Pose",
            duration: "30 sec",
          },

          {
            name: "Warrior Pose",
            duration: "45 sec",
          },

          {
            name: "Bridge Pose",
            duration: "40 sec",
          },
        ];
      }

      // HOME/CARDIO
      else {

        workouts = [

          {
            name: "Push-ups",
            sets: 3,
          },

          {
            name: "Squats",
            sets: 3,
          },

          {
            name: "Lunges",
            sets: 3,
          },

          {
            name: "Plank",
            duration: "30 sec",
          },
        ];
      }
    }

    // 🔥 WEIGHT GAIN
    else if (goal === "Weight Gain") {

      workouts = [

        {
          name: "Squats",
          sets: 4,
        },

        {
          name: "Push-ups",
          sets: 4,
        },

        {
          name: "Lunges",
          sets: 3,
        },

        {
          name: "Plank",
          duration: "40 sec",
        },
      ];
    }

    // 🔥 GENERAL FITNESS
    else {

      workouts = [

        {
          name: "Jumping Jacks",
          duration: "20 sec",
        },

        {
          name: "Push-ups",
          sets: 2,
        },

        {
          name: "Squats",
          sets: 2,
        },

        {
          name: "Stretching",
          duration: "3 min",
        },
      ];
    }

    // ✅ ENSURE EXACTLY 4
    workouts = workouts.slice(0, 4);

    // ✅ CONVERT TO SCHEMA FORMAT
    workouts = workouts.map(
      (exercise) => {

        // duration workout
        if (exercise.duration) {

          return {

            name: exercise.name,

            completed: false,

            sets: [
              {
                duration:
                  exercise.duration,

                completed: false,
              },
            ],
          };
        }

        // reps workout
        return {

          name: exercise.name,

          completed: false,

          sets: Array.from(
            {
              length:
                exercise.sets || 1,
            },

            () => ({
              reps: 10,
              completed: false,
            })
          ),
        };
      }
    );

    

    // ✅ RETURN RESPONSE
    return res.json({

      success: true,

      fallback: true,

      exercises: workouts,
    });

  } catch (err) {

    console.log(
      "WORKOUT GENERATION ERROR:",
      err
    );

    return res.status(500).json({
      error: err.message,
    });
  }
};