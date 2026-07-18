import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Setup = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(true);

  const [userData, setUserData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    goal: "",
    workoutType: "",
  });

  const steps = [1, 2, 3, 4];

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ FIXED LOGIC
  const nextStep = async () => {
    // STEP VALIDATION
    if (step === 1) {
      if (
        !userData.height ||
        !userData.weight ||
        !userData.age ||
        !userData.gender
      ) {
        alert("Please fill all body details");
        return;
      }
    }

    if (step === 2 && !userData.goal) {
      alert("Please select a goal");
      return;
    }

    if (step === 3 && !userData.workoutType) {
      alert("Please select workout type");
      return;
    }

    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login again");
          navigate("/");
          return;
        }
        // ✅ SAVE PROFILE TO BACKEND
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/setup`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // ✅ GO DASHBOARD
        navigate("/dashboard");

      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          alert("Something went wrong");
        }
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div
  className={`min-h-screen px-5 py-8 sm:px-8 md:px-12 lg:px-20 lg:py-14 transition-all duration-500 ${
    darkMode ? "bg-black text-white" : "bg-white text-black"
  }`}
>
      {/* Header */}
      <div className="flex justify-between items-start gap-4 mb-10 md:mb-16">
        <div>
          <p className="text-xs sm:text-sm tracking-[3px] sm:tracking-[6px] uppercase text-gray-400 mb-2 sm:mb-4">
            FITRAAA SETUP
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Let’s Build Your Profile
          </h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full border transition-all ${
            darkMode
              ? "border-gray-700 hover:bg-gray-900"
              : "border-gray-300 hover:bg-gray-100"
          }`}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 md:mb-20">
        {steps.map((item, index) => (
          <React.Fragment key={item}>
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                step >= item
                  ? darkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : "border border-gray-500 text-gray-400"
              }`}
            >
              {item}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 md:mx-4 transition-all duration-500 ${
                  step > item
                    ? darkMode
                      ? "bg-white"
                      : "bg-black"
                    : "bg-gray-600"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-10">
        {step === 1 && (
          <>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
              Body Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="rounded-3xl border border-gray-700 p-6 hover:border-gray-400 transition-all">
                <label className="text-sm text-gray-400 block mb-3">
                  Height
                </label>
                <input
                  type="number"
                  name="height"
                  placeholder="Enter in cm"
                  className="bg-transparent outline-none text-xl w-full"
                  onChange={handleChange}
                />
              </div>

              <div className="rounded-3xl border border-gray-700 p-6 hover:border-gray-400 transition-all">
                <label className="text-sm text-gray-400 block mb-3">
                  Weight
                </label>
                <input
                  type="number"
                  name="weight"
                  placeholder="Enter in kg"
                  className="bg-transparent outline-none text-xl w-full"
                  onChange={handleChange}
                />
              </div>

              <div className="rounded-3xl border border-gray-700 p-6 hover:border-gray-400 transition-all">
                <label className="text-sm text-gray-400 block mb-3">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  className="bg-transparent outline-none text-xl w-full"
                  onChange={handleChange}
                />
              </div>

              <div className="rounded-3xl border border-gray-700 p-6 hover:border-gray-400 transition-all">
                <label className="text-sm text-gray-400 block mb-3">
                  Gender
                </label>
                <select
                  name="gender"
                  value={userData.gender}
                  className="bg-transparent outline-none text-xl w-full"
                  onChange={handleChange}
                >
                  <option value="" className="text-black">Select</option>
                  <option value="Male" className="text-black">Male</option>
                  <option value="Female" className="text-black">Female</option>
                </select>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
              Choose Goal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                "Fat Loss",
                "Muscle Gain",
                "Weight Gain",
                "General Fitness",
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() =>
                    setUserData((prev) => ({ ...prev, goal }))
                  }
                  className={`rounded-3xl border p-6 md:p-8 text-left transition-all hover:scale-[1.02] ${
                    userData.goal === goal
                      ? darkMode
                        ? "bg-white text-black border-white"
                        : "bg-black text-white border-black"
                      : "border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
              Workout Type
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {["Gym", "Home", "Yoga", "Cardio"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setUserData((prev) => ({
                      ...prev,
                      workoutType: type,
                    }))
                  }
                  className={`rounded-3xl border p-8 text-left transition-all hover:scale-[1.02] ${
                    userData.workoutType === type
                      ? darkMode
                        ? "bg-white text-black border-white"
                        : "bg-black text-white border-black"
                      : "border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl md:text-2xl font-bold mb-10">
              Ready to Begin?
            </h2>

            <div
              className={`mt-8 rounded-3xl border p-8 shadow-lg transition-all ${
                darkMode
                  ? "border-gray-700 bg-white/5 backdrop-blur-md"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Height</p>
                  <h3 className="text-2xl font-semibold">{userData.height} cm</h3>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Weight</p>
                  <h3 className="text-2xl font-semibold">{userData.weight} kg</h3>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Age</p>
                  <h3 className="text-2xl font-semibold">{userData.age}</h3>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Gender</p>
                  <h3 className="text-2xl font-semibold">{userData.gender}</h3>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Goal</p>
                  <h3 className="text-2xl font-semibold">{userData.goal}</h3>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-white/5" : "bg-white"}`}>
                  <p className="text-sm text-gray-400 mb-2">Workout Type</p>
                  <h3 className="text-2xl font-semibold">{userData.workoutType}</h3>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between mt-12 md:mt-20">
        <button
          onClick={prevStep}
          className="w-full sm:w-auto px-8 py-4 rounded-full border border-gray-600 hover:scale-105 transition-all"
        >
          Back
        </button>

        <button
          onClick={nextStep}
          className={`w-full sm:w-auto px-10 py-4 rounded-full font-semibold transition-all hover:scale-105 ${
            darkMode ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {step === 4 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default Setup;