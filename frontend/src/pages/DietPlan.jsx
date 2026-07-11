import React, { useState, useEffect } from "react";
import axios from "axios";

const DietPlan = ({darkMode}) => {

  const [meals, setMeals] = useState([]);
  const [extras, setExtras] = useState([]);

  const [loading, setLoading] = useState(true);

  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");

  const [calorieGoal,setCalorieGoal,] = useState(1800);
const pageBg = darkMode
  ? "bg-black text-white"
  : "bg-gray-100 text-black";

const cardBg = darkMode
  ? "bg-zinc-900 border-zinc-800"
  : "bg-white border-gray-200 shadow";

const inputBg = darkMode
  ? "bg-zinc-800 border-zinc-700 text-white"
  : "bg-gray-100 border-gray-300 text-black";

// Main text (Headings, Values)
const textColor = darkMode
  ? "text-white"
  : "text-black";

// Secondary text (Labels, Descriptions)
const subText = darkMode
  ? "text-gray-400"
  : "text-gray-600";

  // ===== FETCH DIET PLAN + LOG =====
  // ===== FETCH PROFILE + DIET PLAN + LOG =====

useEffect(() => {

  const fetchDietPlan = async () => {

    try {

      const token =
        localStorage.getItem("token");


      // ===== FETCH USER PROFILE =====

      const profileResponse =
        await axios.get(

          `${import.meta.env.VITE_API_URL}/api/auth/profile`,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


      // GET PERSONAL CALORIE GOAL

      setCalorieGoal(

        profileResponse.data.calorieGoal ||
        1800

      );


      // ===== FETCH DIET PLAN =====

      const planResponse =
        await axios.get(

          `${import.meta.env.VITE_API_URL}/api/diet/plan`,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


      // ===== FETCH TODAY'S DIET LOG =====

      const logResponse =
        await axios.get(

          `${import.meta.env.VITE_API_URL}/api/diet/log`,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


      // SAFE COMPLETED MEALS

      const completedMeals =

        logResponse.data.completedMeals ||

        [];


      // RESTORE EXTRA FOODS

      setExtras(

        logResponse.data.extras ||

        []

      );


      // SAFE DIET PLAN

      const planMeals =

        planResponse.data.meals ||

        [];


      // MERGE DIET PLAN
      // WITH TODAY'S COMPLETION

      const mealsWithCompletion =

        planMeals.map(

          (meal) => ({

            ...meal,

            completed:

              completedMeals.includes(

                meal.meal

              ),

          })

        );


      setMeals(

        mealsWithCompletion

      );

    }

    catch (error) {

      console.log(

        "DIET FETCH ERROR:",

        error

      );

    }

    finally {

      setLoading(

        false

      );

    }

  };


  fetchDietPlan();


}, []);

  // ===== TOGGLE MEAL =====
  const toggleMeal = async (index) => {
  try {
    const token = localStorage.getItem("token");

    const mealName = meals[index].meal;

    const mealCalories =
      meals[index].items.reduce(
        (sum, item) =>
          sum + item.calories,
        0
      );

    const { data } = await axios.put(
     `${import.meta.env.VITE_API_URL}/api/diet/toggle-meal`,
      {
        mealName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updated = [...meals];

    updated[index].completed =
      data.completedMeals.includes(
        mealName
      );

    setMeals(updated);

    await axios.put(
     `${import.meta.env.VITE_API_URL}/api/progress/calories`,
      {
        calories:
          updated[index].completed
            ? mealCalories
            : -mealCalories,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

  // ===== ADD EXTRA FOOD =====
  const addFood = async () => {

    try {

      const calories =
  Number(foodCalories);

if (
  !foodName.trim() ||
  !calories ||
  calories <= 0
) {
  return;
}

      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/diet/add-extra`,
        {
          name: foodName.trim(),
          calories,
          meal: selectedMeal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // UPDATE EXTRAS
      setExtras(data.extras);

      await axios.put(
  `${import.meta.env.VITE_API_URL}/api/progress/calories`,
  {
    calories: Number(foodCalories),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setFoodName("");
      setFoodCalories("");

    } catch (error) {

      console.log(error);

    }
  };

  // ===== REMOVE EXTRA =====
 const removeExtra = async (
  extraId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const food = extras.find(
      (e) => e._id === extraId
    );

    const { data } =
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/diet/remove-extra/${extraId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    setExtras(data.extras);

    if (food) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/progress/calories`,
        {
          calories:
            -food.calories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  // ===== COMPLETED MEAL CALORIES =====
  const completedMealCalories = meals
    .filter((meal) => meal.completed)
    .reduce(
      (sum, meal) =>
        sum +
        meal.items.reduce(
          (mSum, item) => mSum + item.calories,
          0
        ),
      0
    );

  // ===== EXTRA CALORIES =====
  const extraCalories = extras.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  // ===== TOTAL CONSUMED =====
  const totalCalories =
    completedMealCalories + extraCalories;

  // ===== COMPLETED COUNT =====
  const completedMeals = meals.filter(
    (m) => m.completed
  ).length;

  // ===== STATUS =====
  const getStatus = () => {

    if (totalCalories > calorieGoal)
      return "Over";

    if (totalCalories > calorieGoal * 0.6)
      return "On Track";

    return "Low";
  };

  // ===== FEEDBACK =====
  const getFeedback = () => {

    if (totalCalories > calorieGoal)
      return "⚠️ You exceeded your calorie goal";

    if (totalCalories > calorieGoal * 0.8)
      return "👍 You're close to your goal";

    return "💡 You can eat a bit more today";
  };

  // ===== LOADING =====
  if (loading) {

    return (
      <div
        className={`min-h-screen flex items-center justify-center ${pageBg}`}>
        Loading Diet Plan...
      </div>
    );
  }  
  return (
    <div className={`min-h-screen p-8 ${pageBg}`}>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-4xl font-bold ${textColor}`}>
          Track your daily nutrition :)
        </h1>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT */}
        <div className="space-y-8">

          {/* MEALS */}
          <div className={`p-6 rounded-2xl border ${cardBg}`}>

            <h2 className="text-lg font-semibold mb-6">
              Meals
            </h2>

            <div className="space-y-5">

              {meals.map((m, i) => (

                <div
                  key={i}
                  onClick={() => toggleMeal(i)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${m.completed
                               ? "bg-green-900/20 border-green-500"
                               : darkMode
                              ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                               : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`}
                >

                  <div className="flex justify-between">

                    <h3 className={`text-lg font-semibold ${textColor}`}>
                      {m.meal}
                    </h3>

                    {m.completed && (
                      <span className="text-green-400">
                        ✔
                      </span>
                    )}

                  </div>

                  {/* ITEMS */}
                  <div className={`mt-3 text-sm ${subText} space-y-1`}>

                    {m.items.map((item, idx) => (

                      <p key={idx}>
                        {item.name} — {item.calories} kcal
                      </p>

                    ))}

                    {/* EXTRAS */}
                    {extras
                      .filter((e) => e.meal === m.meal)
                      .map((item) => (

                        <div
                          key={item._id}
                          className="flex justify-between text-blue-400"
                        >

                          <span>
                            + {item.name} — {item.calories} kcal
                          </span>

                          <button
                            onClick={(e) => {

                              e.stopPropagation();

                              removeExtra(item._id);

                            }}
                            className="text-red-400 ml-2"
                          >
                            ✕
                          </button>

                        </div>

                      ))}

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ADD FOOD */}
<div className={`p-6 rounded-2xl border ${cardBg}`}>

  <h2 className="text-lg font-semibold mb-4">
    Add Food
  </h2>

  <div className="flex gap-3 flex-wrap">

    <input
      value={foodName}
      onChange={(e) => setFoodName(e.target.value)}
      placeholder="Food"
      className={`flex-1 p-3 rounded-xl border outline-none
      ${inputBg}
      ${darkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500"}`}
    />

    <input
      value={foodCalories}
      onChange={(e) => setFoodCalories(e.target.value)}
      placeholder="kcal"
      type="number"
      className={`w-24 p-3 rounded-xl border outline-none
      ${inputBg}
      ${darkMode ? "placeholder:text-gray-400" : "placeholder:text-gray-500"}`}
    />

    <select
      value={selectedMeal}
      onChange={(e) => setSelectedMeal(e.target.value)}
      className={`p-3 rounded-xl border outline-none ${inputBg}`}
    >
      <option
        className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}
      >
        Breakfast
      </option>

      <option
        className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}
      >
        Lunch
      </option>

      <option
        className={darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"}
      >
        Dinner
      </option>
    </select>

    <button
      onClick={addFood}
      className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
    >
      Add
    </button>

  </div>

</div>

        </div>

        {/* RIGHT */}
        <div className="space-y-8">

          
          {/* OVERVIEW */}
<div className={`p-6 rounded-2xl border ${cardBg}`}>

  <h2 className={`text-xl font-semibold mb-6 ${textColor}`}>
    Today's Overview
  </h2>

  {/* Calories */}
  <div className="mb-6">

    <div className="flex justify-between items-center mb-2">
      <span className={subText}>Calories</span>

      <span className={`font-semibold ${textColor}`}>
        {totalCalories} / {calorieGoal} kcal
      </span>
    </div>

    <div
      className={`w-full h-3 rounded-full overflow-hidden ${
        darkMode ? "bg-zinc-700" : "bg-gray-300"
      }`}
    >
      <div
        className="h-full bg-green-500 transition-all duration-500"
        style={{
          width: `${Math.min(
            (totalCalories / calorieGoal) * 100,
            100
          )}%`,
        }}
      />
    </div>

  </div>

  {/* Meals */}
  <div className="flex justify-between items-center mb-4">

    <span className={subText}>
      Meals Completed
    </span>

    <span className={`font-semibold ${textColor}`}>
      {completedMeals} / {meals.length}
    </span>

  </div>

  {/* Remaining Calories */}
  <div className="flex justify-between items-center mb-4">

    <span className={subText}>
      Remaining Calories
    </span>

    <span className={`font-semibold ${textColor}`}>
      {Math.max(calorieGoal - totalCalories, 0)} kcal
    </span>

  </div>

  {/* Status */}
  <div className="flex justify-between items-center">

    <span className={subText}>
      Status
    </span>

    <span
      className={`font-semibold ${
        getStatus() === "On Track"
          ? "text-green-500"
          : getStatus() === "Over"
          ? "text-red-500"
          : "text-yellow-500"
      }`}
    >
      {getStatus()}
    </span>

  </div>

</div>
          {/* SUMMARY */}
          {/* SUMMARY */}
<div className={`p-6 rounded-2xl border ${cardBg}`}>

  <h2 className={`text-xl font-semibold mb-6 ${textColor}`}>
    Today's Summary
  </h2>

  {/* Total Calories */}
  <div className="mb-6">

    <p className={subText}>
      Total Calories Consumed
    </p>

    <h1 className={`text-4xl font-bold mt-2 ${textColor}`}>
       {totalCalories} kcal
    </h1>

  </div>

  {/* Remaining Calories */}
  <div className="flex justify-between items-center mb-5">

    <span className={subText}>
      Remaining
    </span>

    <span className={`font-semibold ${textColor}`}>
      {Math.max(calorieGoal - totalCalories, 0)} kcal
    </span>

  </div>

  {/* Daily Feedback */}
  <div
    className={`rounded-xl p-4 ${
      darkMode
        ? "bg-zinc-800"
        : "bg-gray-100"
    }`}
  >

    <p className={subText}>
      {getFeedback()}
    </p>

  </div>

</div>
        </div>

      </div>

    </div>
  );
};

export default DietPlan;