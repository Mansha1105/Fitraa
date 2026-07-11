import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  Timer,
  Flame,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

const WorkoutLog = ({ darkMode }) => {


  

  // ✅ DYNAMIC WORKOUTS
  const [workouts, setWorkouts] =
    useState([]);

  const [sessionId, setSessionId] =
    useState(null);

  const [feedbackSaved,
  setFeedbackSaved] =
  useState(false);

  const [
  showFeedbackSuccess,
  setShowFeedbackSuccess
] = useState(false);

  const [
  workoutStatus,
  setWorkoutStatus
] = useState("pending");

  const [
  streak,
  setStreak
] = useState(0);

  // ✅ TODAY PROGRESS
  const [todayProgress, setTodayProgress] =
    useState(null);

  const [feedback, setFeedback] =
    useState({
      intensity: "Medium",
      energy: "Normal",
      experience: "Okay",
    });

  const [workoutStarted,
    setWorkoutStarted] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  const [
  workoutCompleted,
  setWorkoutCompleted
] = useState(false);

  

  const subText =
    darkMode
      ? "text-gray-400"
      : "text-gray-500";

  // ✅ FETCH DATA
  useEffect(() => {

  fetchLatestWorkout();

  fetchTodayProgress();

  // ✅ RESTORE TIMER
  
}, []);
  // ✅ TIMER
  useEffect(() => {

    let interval;

    if (workoutStarted) {

      interval = setInterval(() => {

        setSeconds((prev) =>
          prev + 1
        );

      }, 1000);
    }

    return () =>
      clearInterval(interval);

  }, [workoutStarted]);

  // ✅ FORMAT TIME
  const formatTime = () => {

    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ FETCH TODAY PROGRESS
  const fetchTodayProgress =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/api/progress/today`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setTodayProgress(
          res.data
        );

      } catch (err) {

        console.log(
          "FETCH PROGRESS ERROR:",
          err
        );
      }
    };

  // ✅ FETCH LATEST WORKOUT
  // ✅ FETCH LATEST WORKOUT
const fetchLatestWorkout =
  async () => {
    

    try {

      const token = localStorage.getItem("token");

const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/workout/today`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
     

      const data = await res.json();
      if (!data.workout) {

  setWorkouts([]);

  setSessionId(null);

  setWorkoutStarted(false);

  setWorkoutCompleted(false);

  setSeconds(0);

  setWorkoutStatus(
    "pending"
  );

  setFeedback({
    intensity: "Medium",
    energy: "Normal",
    experience: "Okay",
  });

  setFeedbackSaved(false);

  setStreak(
    data.streak || 0
  );

  return;
}

      if (data.success) {

        const formatted =
          data.workout.exercises.map(
            (exercise) => ({

              ...exercise,

              completed:
                exercise.completed ||
                false,
            })
          );

        console.log(
  "FORMATTED WORKOUTS:",
  formatted
);


        setWorkouts(formatted);

        setSessionId(
          data.workout._id
        );
        setStreak(
          data.streak || 0
        );
        setWorkoutStatus(
           data.workout.status ||
             "pending"
        );

        // ✅ RESTORE TIMER FROM BACKEND
        const workoutDate =
  new Date(
    data.workout.startedAt
  ).toDateString();

const todayDate =
  new Date().toDateString();

if (
  workoutDate ===
    todayDate &&
  data.workout.status ===
    "in-progress"
) {

  const elapsed =
    Math.floor(
      (
        Date.now() -
        new Date(
          data.workout.startedAt
        )
      ) / 1000
    );

  setSeconds(elapsed);

  setWorkoutStarted(true);

} else {

  setSeconds(0);

  setWorkoutStarted(false);
}

      
        // ✅ RESTORE FEEDBACK
if (workoutDate === todayDate) {

  if (data.workout.feedback) {

    setFeedback({
      intensity:
        data.workout.feedback.intensity || "Medium",

      energy:
        data.workout.feedback.energy || "Normal",

      experience:
        data.workout.feedback.experience || "Okay",
    });

    setFeedbackSaved(true);

  } else {

    setFeedback({
      intensity: "Medium",
      energy: "Normal",
      experience: "Okay",
    });

    setFeedbackSaved(false);

  }

} else {

  setFeedback({
    intensity: "Medium",
    energy: "Normal",
    experience: "Okay",
  });

  setFeedbackSaved(false);

}
        // ✅ RESTORE STATUS
        if (
          data.workout.status ===
          "completed"
        ) {

          setWorkoutCompleted(
            true
          );

          setWorkoutStarted(
            false
          );
        }

        if (
          data.workout.status ===
          "skipped"
        ) {

          setWorkoutStarted(
            false
          );
        }
      }

    } catch (err) {

      console.log(
        "FETCH WORKOUT ERROR:",
        err
      );
    }
  };
  
 
  // ✅ TOGGLE WORKOUT
  const toggleWorkout =
  async (index) => {

    const updated =
      [...workouts];

    updated[index].completed =
      !updated[index].completed;

    setWorkouts(updated);

    // ✅ BACKEND SYNC
    if (sessionId) {

      try {
        const token = localStorage.getItem("token");

        const res =
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/api/workout/update-set`,
            {
              sessionId,
              exerciseIndex:index,
              setIndex: 0,
            },
            {
               headers: {
                Authorization:
                    `Bearer ${token}`,
      },
    }
          );

        // ✅ UPDATE STATUS
        setWorkoutStatus(
          res.data.status
        );

        // ✅ REFRESH PROGRESS
        fetchTodayProgress();

        // ✅ WORKOUT COMPLETED
        if (
          res.data.status ===
          "completed"
        ) {

          setWorkoutCompleted(
            true
          );

          

          setWorkoutStarted(
            false
          );

          
        }

      } catch (err) {

        console.error(err);
      }
    }
  };


  // ✅ SKIP
  const skipWorkout =
  async () => {

    try {

      const token = localStorage.getItem("token");

      if (!sessionId) return;

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/workout/skip`,
        {
          sessionId,
        },
        {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
      );

      // ✅ UPDATE STATUS
      setWorkoutStatus(
        "skipped"
      );

      // ✅ STOP TIMER
      

      setWorkoutStarted(
        false
      );

      // ✅ REFRESH DATA
      fetchLatestWorkout();

    } catch (err) {

      console.log(
        "SKIP WORKOUT ERROR:",
        err
      );
    }
  };
  // ✅ SAVE FEEDBACK
  const saveFeedback =
  async () => {

    try {

      const token = localStorage.getItem("token");

      if (!sessionId) {

        setFeedbackSaved(false);

        return;
      }

      const res =
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/workout/feedback`,
          {
            sessionId,

            intensity:
              feedback.intensity,

            energy:
              feedback.energy,

            experience:
              feedback.experience,
          },
          {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
        );

      console.log(
        "Feedback Saved:",
        res.data
      );

      // ✅ SUCCESS MESSAGE
      // Feedback now exists in MongoDB
      setFeedbackSaved(true);

// Show temporary success message
      setShowFeedbackSuccess(true);

setTimeout(() => {
  setShowFeedbackSuccess(false);
}, 3000);
    } catch (err) {

      console.log(
        "SAVE FEEDBACK ERROR:",
        err
      );

      // Optional:
      // setFeedbackError(true);
    }
  };

  // ✅ DYNAMIC VALUES
 
  const completedCount =
    workouts.filter(
      (w) => w.completed
    ).length;

  const totalCount =
    workouts.length;

  const completionRate =
    totalCount > 0
      ? Math.round(
          (
            completedCount /
            totalCount
          ) * 100
        )
      : 0;

  // ✅ BACKEND CALORIES
  const caloriesBurned =
    todayProgress?.caloriesBurned || 0;

  // ✅ MOTIVATION
  const getMotivation =
    () => {

      if (
        completionRate === 100
      )
        return "🔥 Perfect session! You crushed every exercise.";

      if (
        completionRate >= 70
      )
        return "💪 Amazing progress today. Finish strong!";

      if (
        completionRate >= 40
      )
        return "⚡ Good momentum. Keep pushing forward.";

      if (
        feedback.intensity ===
        "Hard"
      )
        return "😵 Tough workout today — recovery matters too.";

      return "🚀 Let's get started. Every rep counts.";
    };

  // ✅ INSIGHT
  const getInsight =
    () => {

      if (
        completionRate === 100
      )
        return "🎉 All exercises completed successfully!";

      if (
        completionRate >= 70
      )
        return `${completedCount}/${totalCount} exercises completed — almost done!`;

      if (
        completionRate >= 40
      )
        return `You're halfway there. Keep moving 💪`;

      return `You've completed ${completedCount} of ${totalCount} exercises`;
    };

  // ✅ STREAK MESSAGE
  const getStreakMessage =
    () => {

      if (streak >= 30)
        return "Legend Mode ";

      if (streak >= 14)
        return "Unstoppable Beast ";

      if (streak >= 7)
        return "Strong Consistency ";

      if (streak >= 3)
        return "Nice Momentum ";

      return "Keep Going!";
    };


  return (
    <div className={`min-h-screen p-6 md:p-8 space-y-8 ${
      darkMode
        ? "bg-black text-white"
        : "bg-gray-50 text-black"
    }`}>

      {/* HEADER */}
      <div>

        <h1 className="text-3xl md:text-4xl font-bold">
          Today’s Workout 
        </h1>

        <p className={`mt-2 ${subText}`}>
          Here is your workout plan 
        </p>

        {/* START */}
        <div className="flex items-center gap-4 mt-4">

          

          {/* TIMER */}
          {workoutStarted && (

            <div className={`px-4 py-2 rounded-full text-sm ${
              darkMode
                ? "bg-zinc-800"
                : "bg-gray-200"
            }`}>

              ⏱ {formatTime()}

            </div>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className={`rounded-2xl px-6 py-4 border flex justify-between items-center ${
        darkMode
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-gray-200 shadow-sm"
      }`}>

        <div className="text-center flex-1">

          <p className="text-xs text-gray-400">
            COMPLETED
          </p>

          <p className="text-lg font-semibold">
            {completedCount}/{totalCount}
          </p>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>

        <div className="text-center flex-1">

          <p className="text-xs text-gray-400">
            STREAK
          </p>

          <p className="text-lg font-semibold">
            🔥 {streak}
          </p>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>

        <div className="text-center flex-1">

          <p className="text-xs text-gray-400">
            CALORIES
          </p>

          <p className="text-lg font-semibold">
            {caloriesBurned}
          </p>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-zinc-700"></div>

        <div className="text-center flex-1">

          <p className="text-xs text-gray-400">
            STATUS
          </p>

          <span
  className={`text-xs px-3 py-1 rounded-full ${
    workoutStatus ===
    "completed"
      ? "bg-green-500/20 text-green-400"
      : workoutStatus ===
        "skipped"
      ? "bg-red-500/20 text-red-400"
      : workoutStatus ===
        "in-progress"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-gray-500/20 text-gray-400"
  }`}
>

  {workoutStatus ===
  "completed"
    ? "Completed"
    : workoutStatus ===
      "skipped"
    ? "Skipped"
    : workoutStatus ===
      "in-progress"
    ? "In Progress"
    : "Pending"}

</span>
        </div>
      </div>

      {/* WORKOUTS */}
      <div className={`p-6 rounded-2xl border ${
        darkMode
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-gray-200"
      }`}>

        <h2 className="text-xl font-semibold mb-4">
          Workout for You
        </h2>

        <div className="space-y-3">

          {workouts.map((w, i) => (

            <div
              key={i}

              onClick={() => toggleWorkout(i)}

              className={`flex justify-between p-4 rounded-xl cursor-pointer border transition-all ${
                w.completed
                  ? "bg-green-500/10 border-green-400"
                  : darkMode
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-white border-gray-200"
              }`}
            >

              <div>

                <p>{w.name}</p>

                <p className="text-sm text-gray-400 mt-1">

                 {`${w.sets?.length || 1} set${
  w.sets?.length > 1 ? "s" : ""
}`}
                </p>

              </div>

              {w.completed && (

                <CheckCircle2 className="text-green-500" />

              )}
            </div>
          ))}
        </div>

        {workoutStatus !== "completed" &&
 workoutStatus !== "skipped" && (

  <div className="flex justify-end mt-4">

    <button
      onClick={skipWorkout}
      className="px-4 py-2 bg-red-500 text-white rounded-full"
    >
      Skip Workout
    </button>

  </div>

)}

</div>

{workoutCompleted && (

  <div
    className={`p-6 rounded-3xl border ${
      darkMode
        ? "bg-green-500/10 border-green-500"
        : "bg-green-50 border-green-300"
    }`}
  >

    <h2 className="text-2xl font-bold text-green-500">
      Workout Completed 
    </h2>

    <p className="mt-2 text-gray-400">
      Amazing work today.
      Keep your streak alive 
    </p>

  </div>

)}

      {/* FEEDBACK + MOTIVATION */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

  {/* FEEDBACK */}
  <div className={`p-6 rounded-3xl border ${
    darkMode
      ? "bg-zinc-900 border-zinc-800"
      : "bg-white border-gray-200"
  }`}>

    <div className="flex items-center justify-between mb-6">

      <div>
        <h2 className="text-xl font-bold">
          Workout Feedback
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Tell us how today’s workout felt
        </p>
      </div>

    </div>

    {/* INTENSITY */}
    <div className="mb-6">

      <p className="text-sm font-semibold mb-3">
        Intensity
      </p>

      <div className="flex gap-3">

        {["Easy", "Medium", "Hard"].map((item) => (

          <button
            key={item}

            onClick={() =>
              setFeedback({
                ...feedback,
                intensity: item,
              })
            }

            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              feedback.intensity === item
                ? "bg-blue-500 text-white"
                : darkMode
                ? "bg-zinc-800 text-gray-300"
                : "bg-gray-100 text-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* ENERGY */}
    <div className="mb-6">

      <p className="text-sm font-semibold mb-3">
        Energy Level
      </p>

      <div className="flex gap-3">

        {["Low", "Normal", "High"].map((item) => (

          <button
            key={item}

            onClick={() =>
              setFeedback({
                ...feedback,
                energy: item,
              })
            }

            className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
              feedback.energy === item
                ? "bg-green-500 text-white"
                : darkMode
                ? "bg-zinc-800 text-gray-300"
                : "bg-gray-100 text-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

    {/* EXPERIENCE */}
    <div>

      <p className="text-sm font-semibold mb-3">
        Experience
      </p>

      <div className="grid grid-cols-3 gap-3">

        {[
          " Tired",
          " Good",
          "Amazing",
        ].map((item) => (

          <button
            key={item}

            onClick={() =>
              setFeedback({
                ...feedback,
                experience: item,
              })
            }

            className={`py-3 rounded-2xl text-sm font-medium transition-all ${
              feedback.experience === item
                ? "bg-purple-500 text-white"
                : darkMode
                ? "bg-zinc-800 text-gray-300"
                : "bg-gray-100 text-black"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>

   <button
  onClick={saveFeedback}
  className="mt-8 w-full py-3 rounded-2xl font-semibold transition-all bg-white text-black hover:scale-[1.01]">
  {feedbackSaved
    ? "Update Feedback"
    : "Save Feedback"}
</button>

{showFeedbackSuccess && (
  <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500">
    <p className="text-green-500 text-sm font-medium">
      Feedback saved successfully
    </p>
  </div>
)}
  </div>

  {/* MOTIVATION */}
<div
  className={`p-6 rounded-3xl border ${
    darkMode
      ? "bg-zinc-900 border-zinc-800"
      : "bg-white border-gray-200"
  }`}
>

  {/* HEADER */}
  <div className="flex items-start justify-between">

    <div>
      <h2 className="text-xl font-bold">
        {getStreakMessage()}
      </h2>

      <p className="text-sm text-gray-400 mt-2">
        Your workout progress for today
      </p>
    </div>

    <div className="text-3xl">
      
    </div>

  </div>


  {/* MOTIVATION MESSAGE */}
  <div
    className={`mt-6 p-4 rounded-2xl ${
      darkMode
        ? "bg-zinc-800"
        : "bg-gray-100"
    }`}
  >

    <p className="text-sm leading-6">
      {getMotivation()}
    </p>

  </div>


  {/* COMPLETION */}
  <div className="mt-7">

    <div className="flex justify-between items-end mb-3">

      <div>
        <p className="text-sm text-gray-400">
          Today's Progress
        </p>

        <p className="text-4xl font-bold mt-1">
          {completionRate}%
        </p>
      </div>

      <p className="text-sm text-gray-400">
        {completedCount}/{totalCount} exercises
      </p>

    </div>


    {/* PROGRESS BAR */}
    <div
      className={`w-full h-3 rounded-full overflow-hidden ${
        darkMode
          ? "bg-zinc-700"
          : "bg-gray-200"
      }`}
    >

      <div
        style={{
          width: `${completionRate}%`,
        }}

        className="h-full bg-green-500 rounded-full transition-all duration-500"
      />

    </div>

  </div>


  {/* DYNAMIC INSIGHT */}
  <div className="mt-5">

    <p className="text-sm text-gray-400">
      {getInsight()}
    </p>

  </div>

{/* WORKOUT SUMMARY */}
<div
  className={`mt-7 p-5 rounded-2xl ${
    darkMode
      ? "bg-zinc-800"
      : "bg-gray-100"
  }`}
>

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm font-semibold">
        Today's Achievement
      </p>

      <p className="text-sm text-gray-400 mt-2">
        {completionRate === 100
          ? "You completed your entire workout plan!"
          : completionRate >= 50
          ? "You're making great progress. Keep going!"
          : "Every completed exercise moves you forward."}
      </p>

    </div>

    <div className="text-4xl">
      {completionRate === 100
        ? "🏆"
        : completionRate >= 50
        ? "🔥"
        : "🎯"}
    </div>

  </div>

</div>

</div>
    </div>
    </div>
  );
};

export default WorkoutLog;