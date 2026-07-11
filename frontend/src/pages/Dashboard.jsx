import React, {
  useState,
  useEffect,
} from "react";

import {
  Droplets,
  Dumbbell,
  Salad,
  Target,
  User,
} from "lucide-react";

const Dashboard = ({ darkMode }) => {

  // ✅ USER DATA
  const [profile, setProfile] = useState(null);
  
  
 
  const [
  recentWorkouts,
  setRecentWorkouts] = useState([]);

  // ✅ DAILY BACKEND PROGRESS
  const [progress,
    setProgress] =
    useState({
      waterIntake: 0,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      workoutsCompleted: 0,
      workoutMinutes: 0,
    });

  // SETTINGS
 const waterGoal =
  profile?.waterGoal || 3.5;

const targetWeight =
  profile?.targetWeight || 58;

const totalCalories =
  profile?.calorieGoal || 1800;

  const [
  completedWorkoutDays,
  setCompletedWorkoutDays
] = useState([]);

const [
  skippedWorkoutDays,
  setSkippedWorkoutDays
] = useState([]);

  const totalDays = 7;

  const completedDays =
  completedWorkoutDays.length;
  

  const weeklyPercentage =
    Math.round(
      (
        completedDays /
        totalDays
      ) * 100
    );

  const days = [
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
    "S",
  ];

  // ✅ FETCH DATA
  useEffect(() => {
  fetchProfile();
  fetchTodayProgress();
}, []);

useEffect(() => {
  if (!profile) return;

  fetchWeeklyStats();
  fetchRecentWorkouts();
}, [profile]);


  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");

  const res = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    const user = await res.json();

    setProfile(user);

  } catch (error) {
    console.log("PROFILE FETCH ERROR:", error);
  }
};

  // ✅ FETCH TODAY PROGRESS
  const fetchTodayProgress =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

       const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/progress/today`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setProgress(data);

      } catch (error) {

        console.log(
          "PROGRESS FETCH ERROR:",
          error
        );
      }
    };

 const fetchWeeklyStats = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
     `${import.meta.env.VITE_API_URL}/api/workout/weekly`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setCompletedWorkoutDays(data.completedDays);
      setSkippedWorkoutDays(data.skippedDays);
    }

  } catch (err) {

    console.log("WEEKLY STATS ERROR:", err);

  }
};

  const fetchRecentWorkouts = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
     `${import.meta.env.VITE_API_URL}/api/workout/recent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      setRecentWorkouts(data.workouts);
    }

  } catch (err) {

    console.log("RECENT WORKOUT ERROR:", err);

  }
};

  const addWater = async (amount) => {
  try {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/progress/water`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
        }),
      }
    );

    const data =
      await res.json();

    console.log(
      "WATER RESPONSE:",
      data
    );

    fetchTodayProgress();

  } catch (error) {
    console.log(
      "WATER UPDATE ERROR:",
      error
    );
  }
};

  
  // ✅ CLASSES
  const cardClass =
    darkMode
      ? "bg-zinc-900 border-zinc-800 text-white"
      : "bg-white border-gray-200 text-black shadow-sm";

  const subTextClass =
    darkMode
      ? "text-gray-400"
      : "text-gray-500";

   
 return (
    <div
     className={`min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 transition-all duration-300 ${
      darkMode
    ? "bg-black text-white"
    : "bg-gray-50 text-black"
    }`}
    >

      {/* HEADER */}
      <div
        className={`flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between pb-6 border-b ${
          darkMode
            ? "border-zinc-800"
            : "border-gray-200"
        }`}
      >

        <div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Welcome {" "}
            <span
              className={
                darkMode
                  ? "text-zinc-300"
                  : "text-gray-700"
              }
            >
              {profile?.name || "User"}
            </span>
          </h1>

          <p
            className={`mt-3 text-sm tracking-wide font-medium ${subTextClass}`}
          >
            Stay consistent. Every workout counts.
          </p>
        </div>

        <div className="text-left lg:text-right">

          <p
            className={`text-sm tracking-wide uppercase ${subTextClass}`}
          >
            Today
          </p>

          <p className="text-lg font-semibold mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">

        {/* USER GOAL */}
        <div className={`rounded-3xl p-6 border ${cardClass}`}>

          <div className="flex justify-between items-center mb-4">
            <p className={subTextClass}>
              User Goal
            </p>

            <User size={18} />
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {profile?.goal || "Not Set"}
          </h2>

          <div className={`text-sm space-y-1 mt-4 ${subTextClass}`}>

            <p>
              Workout: {profile?.workoutType || "Not set"}
            </p>

            <p>
              Age: {profile?.age || "--"}
            </p>

            <p>
              Weight: {profile?.weight || "--"} kg
            </p>
          </div>
        </div>

        {/* DIET */}
<div className={`rounded-3xl p-6 border ${cardClass}`}>

  <div className="flex justify-between items-center mb-4">

    <p className={subTextClass}>
      Diet Progress
    </p>

    <Salad size={18} />
  </div>

  <h2 className="text-3xl font-bold">
    {progress.caloriesConsumed}/{totalCalories}
  </h2>

  <p className={`text-sm mt-2 ${subTextClass}`}>
    kcal completed
  </p>

  <div
    className={`w-full h-3 rounded-full mt-5 ${
      darkMode
        ? "bg-zinc-700"
        : "bg-gray-200"
    }`}
  >

    <div
      className={`h-3 rounded-full ${
        darkMode
          ? "bg-white"
          : "bg-black"
      }`}
      style={{
        width: `${Math.min(
          (progress.caloriesConsumed / totalCalories) * 100,
          100
        )}%`,
      }}
    />
  </div>
</div>

{/* WATER */}
<div className={`rounded-3xl p-6 border ${cardClass}`}>

  <div className="flex justify-between items-center mb-4">

    <p className={subTextClass}>
      Water Intake
    </p>

    <Droplets size={18} />
  </div>

  <h2 className="text-3xl font-bold">
    {progress.waterIntake}L
  </h2>

  <p className={`text-sm mt-2 ${subTextClass}`}>
    Goal: {waterGoal}L
  </p>

  <div
    className={`w-full h-3 rounded-full mt-5 ${
      darkMode
        ? "bg-zinc-700"
        : "bg-gray-200"
    }`}
  >

    <div
      className={`h-3 rounded-full ${
        darkMode
          ? "bg-white"
          : "bg-black"
      }`}
      style={{
        width: `${Math.min(
          (progress.waterIntake / waterGoal) * 100,
          100
        )}%`,
      }}
    />
  </div>

  <div className="flex flex-wrap gap-3 mt-5">

    <button
      onClick={() => addWater(0.25)}
      className={`flex-1 min-w-24 px-4 py-2 rounded-full text-sm whitespace-nowrap ${
        darkMode
          ? "bg-white text-black"
          : "bg-black text-white"
      }`}
    >
      +250ml
    </button>

    <button
      onClick={() => addWater(0.5)}
      className={`flex-1 min-w-24 px-4 py-2 rounded-full border text-sm whitespace-nowrap ${
        darkMode
          ? "border-zinc-700"
          : "border-gray-300"
      }`}
    >
      +500ml
    </button>
  </div>
</div>

        {/* GOAL */}
        <div className={`rounded-3xl p-6 border ${cardClass}`}>

          <div className="flex justify-between items-center mb-4">

            <p className={subTextClass}>
              Goal Progress
            </p>

            <Target size={18} />
          </div>

          <h2 className="text-3xl font-bold">
            {weeklyPercentage}%
          </h2>

          <p className={`text-sm mt-2 ${subTextClass}`}>
            Weekly completion
          </p>

          <div
            className={`w-full h-3 rounded-full mt-5 ${
              darkMode
                ? "bg-zinc-700"
                : "bg-gray-200"
            }`}
          >

            <div
              className={`h-3 rounded-full ${
                darkMode
                  ? "bg-white"
                  : "bg-black"
              }`}
              style={{
                width: `${Math.min(
                  weeklyPercentage,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* WEEKLY WORKOUT */}
        <div className={`rounded-3xl p-8 border ${cardClass}`}>

          <div className="flex justify-between mb-8">

            <h2 className="text-xl font-semibold">
              Weekly Workout
            </h2>

            <p className={`text-sm ${subTextClass}`}>
              {weeklyPercentage}% complete
            </p>
          </div>

          <div className="flex justify-center">

            <div className="relative w-52 h-52 sm:w-64 sm:h-64">

              <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl"></div>

              <div
                className={`absolute inset-0 rounded-full border-20 ${
                  darkMode
                    ? "border-zinc-700"
                    : "border-gray-300"
                }`}
              />

              <div
                className={`absolute inset-0 rounded-full border-20 rotate-45 ${
                  darkMode
                    ? "border-white border-r-transparent border-b-transparent"
                    : "border-black border-r-transparent border-b-transparent"
                }`}
              />

              <div
                className={`absolute inset-8 rounded-full flex flex-col items-center justify-center ${
                  darkMode
                    ? "bg-black"
                    : "bg-gray-50"
                }`}
              >

                <h1 className="text-4xl sm:text-5xl font-bold">
                  {completedDays}/{totalDays}
                </h1>

                <p className={`mt-2 ${subTextClass}`}>
                  days completed
                </p>
              </div>
            </div>
          </div>
        </div>

        
       {/* WEEKLY ACTIVITY */}

<div className={`rounded-3xl p-8 border ${cardClass}`}>

  <h2 className="text-xl font-semibold mb-8">
    Weekly Activity
  </h2>

  <div className="space-y-5">

    {[
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day, index) => {

      const completed =
        completedWorkoutDays.includes(index);

      const skipped =
        skippedWorkoutDays.includes(index);

      return (

        <div
          key={index}
          className="flex items-center justify-between gap-4"
        >

          {/* DAY NAME */}

          <span className="font-medium">
            {day}
          </span>


          {/* DAY STATUS */}

          {completed ? (

            <span className="text-green-500 font-semibold whitespace-nowrap">
              🟢 Completed
            </span>

          ) : skipped ? (

            <span className="text-red-500 font-semibold whitespace-nowrap">
              🔴 Skipped
            </span>

          ) : (

            <span
              className={`${subTextClass} whitespace-nowrap`}
            >
              ⚪ Rest Day
            </span>

          )}

        </div>

      );

    })}

  </div>

  </div>

</div>
      {/* BOTTOM */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* WEIGHT */}
        <div className={`rounded-3xl p-8 border ${cardClass}`}>

          <h2 className="text-xl font-semibold">
            Weight Progress
          </h2>

          <p className={`text-sm mt-1 ${subTextClass}`}>
            Track your body goal
          </p>

          <div className="grid grid-cols-2 gap-6 my-8">

            <div>

              <p className={`text-sm ${subTextClass}`}>
                Current
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {profile?.weight || 0}kg
              </h1>
            </div>

            <div>

              <p className={`text-sm ${subTextClass}`}>
                Target
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {targetWeight}kg
              </h1>
            </div>
          </div>

          <p className={`text-sm ${subTextClass}`}>
            Great progress toward your goal 🔥
          </p>
        </div>

        {/* RECENT WORKOUTS */}
<div
  className={`rounded-3xl p-8 border ${
    darkMode
      ? "bg-linear-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-white"
      : "bg-linear-to-br from-white to-gray-100 border-gray-200 text-black"
  }`}
>

  <div className="flex justify-between items-center mb-8">

    <div>

      <h2 className="text-2xl font-bold">
        Recent Workouts
      </h2>

      <p
        className={`text-sm mt-1 ${subTextClass}`}
      >
        YOUR LAST 3 WORKOUTS
      </p>

    </div>

    <Dumbbell size={22} />

  </div>

  <div className="space-y-3">

    {recentWorkouts.length > 0 ? (

      recentWorkouts.map(
        (workout) => (

          <div
            key={workout._id}
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-zinc-800 border-zinc-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >

            <p className="font-semibold">
              {workout.workoutName}
            </p>

            <p
              className={`text-sm mt-1 ${subTextClass}`}
            >
              {new Date(
                workout.startedAt
              ).toLocaleDateString()}
            </p>

            <p
              className={`text-sm ${subTextClass}`}
            >
              {workout.caloriesBurned} cal •{" "}
              {workout.status}
            </p>

          </div>
        )
      )

    ) : (

      <p className={subTextClass}>
        No workouts yet.
      </p>

    )}

  </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;