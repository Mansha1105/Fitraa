import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AiWorkoutPlan = ({ darkMode }) => {

  const navigate = useNavigate();

  const [goal, setGoal] =
    useState("Fat Loss");

  const [type, setType] =
    useState("Home");

  const [workout, setWorkout] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  // ✅ GENERATE WORKOUT
 const generateWorkout = async () => {

  setLoading(true);
  setSaved(false);

  try {

    const token =
      localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/ai/generate-workout`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          goal,
          level: "beginner",
          type,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Failed to generate workout"
      );
    }

    setWorkout(
      data.exercises || []
    );

  } catch (err) {

    console.log(
      "WORKOUT GENERATION ERROR:",
      err
    );

    setWorkout([
      {
        name: "Push-ups",
        sets: [
          {
            reps: 10,
            completed: false,
          },
          {
            reps: 10,
            completed: false,
          },
        ],
      },

      {
        name: "Squats",
        sets: [
          {
            reps: 10,
            completed: false,
          },
          {
            reps: 10,
            completed: false,
          },
        ],
      },

      {
        name: "Plank",
        sets: [
          {
            duration: "20 sec",
            completed: false,
          },
        ],
      },

      {
        name: "Jumping Jacks",
        sets: [
          {
            duration: "20 sec",
            completed: false,
          },
        ],
      },
    ]);

  } finally {

    setLoading(false);

  }
};
  // ✅ START WORKOUT
  const saveWorkout =
    async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) return;

        const res =
          await fetch(
             `${import.meta.env.VITE_API_URL}/api/workout/start`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
                  Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                goal,
                level:
                  "beginner",
                type,
                exercises:
                  workout,
              }),
            }
          );

        const data =
          await res.json();

        console.log(
          "Workout Started:",
          data
        );

        setSaved(true);

        // ✅ REDIRECT
        setTimeout(() => {

          navigate("/workout-log");

        }, 1000);

      } catch (err) {

        console.log(
          "SAVE WORKOUT ERROR:",
          err
        );
      }
    };

  // ✅ THEME
  const bg =
    darkMode
      ? "bg-black text-white"
      : "bg-gray-100 text-black";

  const card =
    darkMode
      ? "bg-zinc-900 border-zinc-800"
      : "bg-white border-gray-200 shadow";

  const input =
    darkMode
      ? "bg-zinc-800 border-zinc-700 text-white"
      : "bg-white border-gray-300 text-black";

  return (

    <div className={`min-h-screen p-6 space-y-6 ${bg}`}>

      <h1 className="text-3xl font-bold">
         Workout Plan Generator!
      </h1>

      {/* INPUT */}
      <div className={`p-6 rounded-2xl border ${card}`}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* GOAL */}
          <select
            value={goal}

            onChange={(e) =>
              setGoal(
                e.target.value
              )
            }

            className={`p-3 rounded-lg border ${input}`}
          >

            <option value="Fat Loss">
              Fat Loss
            </option>

            <option value="Muscle Gain">
              Muscle Gain
            </option>

            <option value="Weight Gain">
              Weight Gain
            </option>

            <option value="General Fitness">
              General Fitness
            </option>

          </select>

          {/* TYPE */}
          <select
            value={type}

            onChange={(e) =>
              setType(
                e.target.value
              )
            }

            className={`p-3 rounded-lg border ${input}`}
          >

            <option value="Home">
              Home
            </option>

            <option value="Gym">
              Gym
            </option>

            <option value="Yoga">
              Yoga
            </option>

            <option value="Cardio">
              Cardio
            </option>

          </select>
        </div>

        <button
          type="button"

          onClick={() => {

            console.log(
              "BUTTON WORKING"
            );

            generateWorkout();
          }}

          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >

          {loading
            ? "Generating..."
            : "Generate Workout"}

        </button>
      </div>

      {/* OUTPUT */}
      {workout.length > 0 && (

        <div className={`p-6 rounded-2xl border ${card}`}>

          <h2 className="mb-4 font-semibold">
            Your Plan
          </h2>

          <div className="space-y-3">

            {workout.map(
              (w, i) => (

                <div
                  key={i}

                  className={`p-4 rounded-lg border ${
                    darkMode
                      ? "bg-zinc-800"
                      : "bg-gray-100"
                  }`}
                >

                  <p className="font-medium">
                    {w.name}
                  </p>

                  <p className="text-sm text-gray-400">

                    {w.sets?.[0]?.duration
                      ? w.sets[0].duration
                      : `${w.sets?.length || 0} sets`}

                  </p>
                </div>
              )
            )}
          </div>

          <div className="flex gap-3 mt-4">

            <button
              onClick={saveWorkout}

              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Start Workout
            </button>

            <button
              onClick={generateWorkout}

              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Regenerate
            </button>
          </div>

          {/* SUCCESS */}
          {saved && (

            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500">

              <p className="text-green-400 text-sm font-medium">

                ✅ Workout started successfully

              </p>

              <p className="text-xs text-gray-400 mt-1">

                Redirecting to Workout Tracker...

              </p>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiWorkoutPlan;