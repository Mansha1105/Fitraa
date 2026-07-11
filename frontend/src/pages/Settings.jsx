import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Settings = ({ darkMode, setDarkMode }) => {

  // ✅ TABS
  const [activeTab, setActiveTab] = useState("profile");

  // ✅ PROFILE DATA
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [goal, setGoal] = useState("General Fitness");
  const [workoutType, setWorkoutType] = useState("Gym");

  // ✅ PREFERENCES
  const [targetWeight, setTargetWeight] = useState("");
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [waterGoal, setWaterGoal] = useState(3.5);

  // ✅ PROFILE PHOTO
  const [profilePhoto, setProfilePhoto] = useState("");

  // ===========================
  // FETCH PROFILE FROM MONGODB
  // ===========================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

  const token =
    localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/profile`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    const user = await res.json();

   

    setName(user.name || "");
    setEmail(user.email || "");
    setAge(user.age || "");
    setHeight(user.height || "");
    setWeight(user.weight || "");

    setGoal(user.goal || "General Fitness");
    setWorkoutType(user.workoutType || "Gym");

    setTargetWeight(user.targetWeight || "");
    setCalorieGoal(user.calorieGoal || 2000);
    setWaterGoal(user.waterGoal || 3.5);

    setProfilePhoto(user.profilePhoto || "");

  } catch (error) {
    console.log("FETCH PROFILE ERROR:", error);
  }
};
  // ===========================
  // SAVE SETTINGS
  // ===========================

 const saveSettings = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
       return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          age,
          height,
          weight,
          goal,
          workoutType,
          targetWeight,
          calorieGoal,
          waterGoal,
          profilePhoto,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

       await res.json();


      await fetchProfile();

    toast.success("Settings updated successfully!");

  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);

    toast.error("Failed to update settings.");
  }
};
  // THEME
  const bg = darkMode
    ? "bg-black text-white"
    : "bg-gray-100 text-black";

  const card = darkMode
    ? "bg-zinc-900 border-zinc-800"
    : "bg-white border-gray-200 shadow";

  const input = darkMode
    ? "bg-zinc-800 border-zinc-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";

  const tabActive =
    "bg-blue-500 text-white";

  const tabInactive = darkMode
    ? "text-gray-400 hover:bg-zinc-800"
    : "text-gray-600 hover:bg-gray-200";

  return (
    <div className={`min-h-screen p-6 ${bg}`}>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your profile, fitness preferences and app data.
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">

        {[
          {
            key: "profile",
            label: "Edit Profile",
          },
          {
            key: "pref",
            label: "Preferences",
          },

        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-full text-sm transition ${
              activeTab === tab.key
                ? tabActive
                : tabInactive
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CARD */}
      <div
        className={`p-8 rounded-3xl border ${card}`}
      >

        {/* PROFILE TAB */}
        {activeTab === "profile" && (

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* PROFILE SIDE */}
            <div className="flex flex-col items-center">

              <label className="relative cursor-pointer">

  {profilePhoto ? (
    <img
      src={profilePhoto}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700"
    />
  ) : (
    <div className="w-32 h-32 rounded-full bg-gray-400 mb-4" />
  )}

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/upload/profile-photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    setProfilePhoto(data.imageUrl);

    toast.success("Profile photo uploaded!");
  } catch (error) {
    console.log(error);

    toast.error("Failed to upload image.");
  }
}}
  />
</label>

              <h2 className="text-lg font-semibold">
                {name || "User"}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Fitraa Member
              </p>
            </div>

            {/* FORM */}
            <div className="lg:col-span-3 space-y-6">

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className={`p-4 rounded-xl border ${input}`}
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={`p-4 rounded-xl border ${input}`}
                />
              </div>

              {/* AGE + HEIGHT + WEIGHT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                  type="number"
                  min="1"
                  placeholder="Age"
                  value={age}
                  onChange={(e) =>
                    setAge(e.target.value)
                  }
                  className={`p-4 rounded-xl border ${input}`}
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) =>
                    setHeight(e.target.value)
                  }
                  className={`p-4 rounded-xl border ${input}`}
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  className={`p-4 rounded-xl border ${input}`}
                />
              </div>

              {/* GOAL + WORKOUT TYPE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <p className="mb-2 font-medium">
                    Fitness Goal
                  </p>

                  <select
                    value={goal}
                    onChange={(e) =>
                      setGoal(e.target.value)
                    }
                    className={`p-4 rounded-xl border w-full ${input}`}
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
                </div>

                <div>
                  <p className="mb-2 font-medium">
                    Workout Type
                  </p>

                  <select
                    value={workoutType}
                    onChange={(e) =>
                      setWorkoutType(e.target.value)
                    }
                    className={`p-4 rounded-xl border w-full ${input}`}
                  >
                    <option value="Gym">
                      Gym
                    </option>

                    <option value="Home">
                      Home
                    </option>

                    <option value="Yoga">
                      Yoga
                    </option>

                    <option value="Cardio">
                      Cardio
                    </option>
                  </select>
                </div>
              </div>

              {/* SAVE */}
              <div className="flex justify-end pt-4">

                <button
                  onClick={saveSettings}
                  className="px-8 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === "pref" && (

          <div className="space-y-8 max-w-3xl">

            {/* TARGET WEIGHT */}
            <div>
              <p className="mb-2 font-medium text-lg">
                Target Weight
              </p>

              <input
                type="number"
                min="1"
                value={targetWeight}
                onChange={(e) =>
                  setTargetWeight(e.target.value)
                }
                className={`p-4 rounded-xl border w-full ${input}`}
                placeholder="Enter target weight"
              />
            </div>

            {/* CALORIE GOAL */}
            <div>
              <p className="mb-2 font-medium text-lg">
                Daily Calories Goal
              </p>

              <input
                type="number"
                min="1"
                value={calorieGoal}
                onChange={(e) =>
                  setCalorieGoal(e.target.value)
                }
                className={`p-4 rounded-xl border w-full ${input}`}
                placeholder="Enter calories goal"
              />
            </div>

            {/* WATER GOAL */}
            <div>
              <p className="mb-2 font-medium text-lg">
                Daily Water Goal (L)
              </p>

              <input
                type="number"
                min="1"
                step="0.1"
                value={waterGoal}
                onChange={(e) =>
                  setWaterGoal(e.target.value)
                }
                className={`p-4 rounded-xl border w-full ${input}`}
                placeholder="Enter water goal"
              />
            </div>

            {/* DARK MODE */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">

              <div>
                <h2 className="font-semibold text-lg">
                  Dark Mode
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Switch between light and dark theme.
                </p>
              </div>

              <button
                onClick={() =>
                  setDarkMode(!darkMode)
                }
                className={`px-6 py-3 rounded-full font-medium transition ${
                  darkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                }`}
              >
                {darkMode ? "Dark" : "Light"}
              </button>
            </div>

            {/* SAVE */}
            <div className="flex justify-end pt-4">

              <button
                onClick={saveSettings}
                className="px-8 py-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;