import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Progress = ({ darkMode }) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
    fetchHistory();
  }, []);

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/progress/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/progress/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHistory(Array.isArray(res.data)? res.data: [] );
    } catch (err) {
      console.log(err);
    } 
  };

  // ===== Last 7 Calendar Days =====
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    last7Days.push({
      date: `${d.getFullYear()}-${String(
  d.getMonth() + 1
).padStart(2, "0")}-${String(
  d.getDate()
).padStart(2, "0")}`,
      day: d.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    });
  }

  const cardBg = darkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-gray-200 shadow";

  const textSub = darkMode
    ? "text-gray-400"
    : "text-gray-500";

  const axisColor = darkMode
    ? "#aaa"
    : "#555";

  const gridColor = darkMode
    ? "#444"
    : "#ddd";

  const getInsight = () => {

  if (!summary) {
    return "Loading...";
  }

  const score =
    summary.dailyScore || 0;

  const workouts =
    summary.workouts || 0;

  const calories =
    summary.calories || 0;

  const streak =
    summary.currentStreak || 0;

  const calorieGoal =
    summary.calorieGoal || 0;


  // PERFECT DAILY SCORE

  if (score === 100) {

    return "🔥 Perfect day! You completed your workout and stayed within your calorie goal.";

  }


  // WORKOUT DONE, NO FOOD LOGGED

  if (
    workouts > 0 &&
    calories === 0
  ) {

    return "🍽 Great workout! Log your meals to complete today's fitness goals.";

  }


  // FOOD LOGGED, WORKOUT NOT DONE

  if (
    workouts === 0 &&
    calories > 0
  ) {

    return "🏋 Your meals are logged. Complete today's workout to improve your daily score.";

  }


  // NOTHING COMPLETED TODAY

  if (
    workouts === 0 &&
    calories === 0
  ) {

    return "💪 Start today's progress by completing a workout or logging your meals.";

  }


  // CALORIE GOAL EXCEEDED

  if (
    calorieGoal > 0 &&
    calories >
      calorieGoal * 1.2
  ) {

    return "⚠️ Your calorie intake is above today's target. Aim for better balance tomorrow.";

  }


  // LONG WORKOUT STREAK

  if (
    streak >= 7
  ) {

    return `🔥 Amazing! You're on a ${streak}-day workout streak. Keep going!`;

  }


  // PARTIAL DAILY PROGRESS

  if (
    score >= 50
  ) {

    return "💪 Good progress! Complete the remaining goal to improve today's score.";

  }


  return "Keep moving and stay consistent.";

};
  return (
    <div
      className={`min-h-screen p-8 space-y-8 ${
        darkMode
          ? "bg-black text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          Progress 📈
        </h1>
        <p className={textSub}>
          Your fitness journey
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className={`p-5 rounded-xl border ${cardBg}`}
        >
          <p className={textSub}>Workouts</p>
          <p className="text-xl font-bold">
            {summary?.totalWorkouts || 0} 
          </p>
        </div>

        <div
          className={`p-5 rounded-xl border ${cardBg}`}
        >
          <p className={textSub}>Calories Burned</p>
          <p className="text-xl font-bold">
            {summary?.caloriesBurned || 0} kcal
          </p>
        </div>

        <div
          className={`p-5 rounded-xl border ${cardBg}`}
        >
          <p className={textSub}>Streak</p>
          <p className="text-xl font-bold">
            🔥 {summary?.currentStreak || 0}
          </p>
        </div>
      </div>

      {/* Daily Score */}
      <div
        className={`p-6 rounded-2xl border ${cardBg}`}
      >
        <h2 className="mb-2">
          Daily Score
        </h2>
        <p className="text-3xl font-bold">
          {summary?.dailyScore || 0} / 100
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories Trend */}
        <div
          className={`p-6 rounded-2xl border ${cardBg}`}
        >
          <h2 className="mb-4">
            Calories Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <LineChart data={history}>
              <XAxis
                dataKey="displayDate"
                stroke={axisColor}
              />
              <YAxis stroke={axisColor} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Activity */}
        <div
          className={`p-6 rounded-2xl border ${cardBg}`}
        >
          <h2 className="mb-4">
            Workout Activity
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart data={history}>
              <CartesianGrid
                stroke={gridColor}
              />

              <XAxis
                dataKey="displayDate"
                stroke={axisColor}
              />

              <YAxis stroke={axisColor} />

              <Tooltip />

              <Bar
                dataKey="workouts"
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Activity + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Activity */}
        <div
          className={`p-6 rounded-2xl border ${cardBg}`}
        >
          <h2 className="mb-4">
            Weekly Activity
          </h2>

          <div className="flex gap-2 flex-wrap">
            {last7Days.map((day) => {
              const completed =
                history.some(
                  (item) =>
                    item.date === day.date &&
                    item.workouts > 0
                );

              return (
                <div
                  key={day.date}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    completed
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-zinc-700"
                      : "bg-gray-300"
                  }`}
                >
                  {day.day.charAt(0)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div
          className={`p-6 rounded-2xl border ${cardBg}`}
        >
          <h2>Insights</h2>

          <p className="mt-2">
            {getInsight()}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Progress;