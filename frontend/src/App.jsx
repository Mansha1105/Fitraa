import React, {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  Menu,
} from "lucide-react";

import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";

import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import WorkoutLog from "./pages/WorkoutLog";
import AIWorkoutPlan from "./pages/AiWorkoutPlan";
import DietPlan from "./pages/DietPlan";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";


// MAIN LAYOUT

function MainLayout({
  children,
  darkMode,
  setDarkMode,
}) {

  // MOBILE SIDEBAR STATE

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);


  return (

    <div
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >


      {/* MOBILE DARK OVERLAY */}

      {isSidebarOpen && (

        <div

          onClick={() =>
            setIsSidebarOpen(false)
          }

          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "

        />

      )}


      {/* SIDEBAR */}

      <Sidebar

        darkMode={
          darkMode
        }

        setDarkMode={
          setDarkMode
        }

        isSidebarOpen={
          isSidebarOpen
        }

        setIsSidebarOpen={
          setIsSidebarOpen
        }

      />


      {/* MAIN CONTENT */}

      <div
        className={`

          flex-1

          min-w-0

          w-full

          transition-all

          duration-300

          ${
            darkMode
              ? "bg-black"
              : "bg-gray-50"
          }

        `}
      >


        {/* MOBILE HEADER */}

        <div
          className={`

            lg:hidden

            sticky

            top-0

            z-30

            flex

            items-center

            justify-between

            px-4

            py-4

            border-b


            ${
              darkMode

                ? "bg-black border-zinc-800"

                : "bg-white border-gray-200"
            }

          `}
        >


          {/* HAMBURGER BUTTON */}

          <button

            type="button"

            onClick={() =>
              setIsSidebarOpen(
                true
              )
            }

            className={`

              p-3

              rounded-xl

              transition-all


              ${
                darkMode

                  ? "bg-zinc-900 hover:bg-zinc-800"

                  : "bg-gray-100 hover:bg-gray-200"
              }

            `}
          >

            <Menu
              size={23}
            />

          </button>


          {/* MOBILE LOGO */}

          <h1
            className="
              text-xl
              font-bold
              tracking-wide
            "
          >

            FITRAAA

          </h1>


          {/* EMPTY SPACE

              Keeps the FITRAAA
              heading centered

          */}

          <div
            className="
              w-12
            "
          />

        </div>


        {/* EXISTING NAVBAR */}

        <Navbar

          darkMode={
            darkMode
          }

          setDarkMode={
            setDarkMode
          }

        />


        {/* PAGE CONTENT */}

        <main
          className="
            w-full
            min-w-0
            overflow-x-hidden
          "
        >

          {children}

        </main>


      </div>

    </div>

  );

}


// APP

function App() {


  // DARK MODE

  const [
    darkMode,
    setDarkMode,
  ] = useState(() => {

    const savedTheme =
      localStorage.getItem(
        "fitraaTheme"
      );


    return savedTheme

      ? JSON.parse(
          savedTheme
        )

      : true;

  });


  // SAVE THEME

  useEffect(() => {

    localStorage.setItem(

      "fitraaTheme",

      JSON.stringify(
        darkMode
      )

    );

  }, [darkMode]);


  return (

    <BrowserRouter>

      <Routes>


        {/* LOGIN */}

        <Route

          path="/"

          element={
            <Login />
          }

        />


        {/* SETUP */}

        <Route

          path="/setup"

          element={
            <Setup />
          }

        />


        {/* DASHBOARD */}

        <Route

          path="/dashboard"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <Dashboard

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


        {/* WORKOUT LOG */}

        <Route

          path="/workout-log"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <WorkoutLog

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


        {/* AI WORKOUT */}

        <Route

          path="/ai-workout"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <AIWorkoutPlan

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


        {/* DIET PLAN */}

        <Route

          path="/diet-plan"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <DietPlan

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


        {/* PROGRESS */}

        <Route

          path="/progress"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <Progress

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


        {/* SETTINGS */}

        <Route

          path="/settings"

          element={

            <MainLayout

              darkMode={
                darkMode
              }

              setDarkMode={
                setDarkMode
              }

            >

              <Settings

                darkMode={
                  darkMode
                }

              />

            </MainLayout>

          }

        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;