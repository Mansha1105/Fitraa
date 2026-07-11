import React from "react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Dumbbell,
  Sparkles,
  Salad,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";


const Sidebar = ({
  darkMode,
  setDarkMode,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {

  const navigate =
    useNavigate();


  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      name: "Workout Log",
      path: "/workout-log",
      icon: Dumbbell,
    },

    {
      name: "Workout Plan",
      path: "/ai-workout",
      icon: Sparkles,
    },

    {
      name: "Diet Plan",
      path: "/diet-plan",
      icon: Salad,
    },

    {
      name: "Progress",
      path: "/progress",
      icon: BarChart3,
    },

    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },

  ];


  // LOGOUT
  const handleLogout = () => {

    // Remove authentication token
    localStorage.removeItem(
      "token"
    );

    // Close mobile sidebar
    setIsSidebarOpen(false);

    // Go to login page
    navigate("/");

  };


  return (

    <div
      className={`

        fixed
        lg:static

        top-0
        left-0

        z-50

       w-72
       h-screen
       lg:h-auto
       lg:min-h-screen

       shrink-0

        flex
        flex-col
        justify-between

        px-6
        py-8

        overflow-y-auto

        transition-transform
        duration-300
        ease-in-out

        ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0

        ${
          darkMode
            ? "bg-black text-white"
            : "bg-white text-black border-r border-gray-200"
        }

      `}
    >


      {/* TOP SECTION */}

      <div>


        {/* LOGO AND BUTTONS */}

        <div
          className="
            mb-14
            flex
            items-center
            justify-between
          "
        >


          {/* LOGO */}

          <div>

            <p
              className={`

                text-xs

                tracking-[6px]

                uppercase

                mb-2

                ${
                  darkMode
                    ? "text-gray-500"
                    : "text-gray-400"
                }

              `}
            >

              Fitness App

            </p>


            <h1
              className="
                text-4xl
                font-bold
                tracking-wide
              "
            >

              FITRAAA

            </h1>

          </div>


          {/* BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >


            {/* THEME BUTTON */}

            <button

              type="button"

              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }

              className={`

                p-3

                rounded-2xl

                transition-all

                ${
                  darkMode

                    ? "bg-white/10 hover:bg-white/20"

                    : "bg-gray-100 hover:bg-gray-200"
                }

              `}
            >

              {
                darkMode

                  ? (
                    <Sun
                      size={18}
                    />
                  )

                  : (
                    <Moon
                      size={18}
                    />
                  )
              }

            </button>


            {/* MOBILE CLOSE BUTTON */}

            <button

              type="button"

              onClick={() =>
                setIsSidebarOpen(
                  false
                )
              }

              className={`

                lg:hidden

                p-3

                rounded-2xl

                transition-all

                ${
                  darkMode

                    ? "bg-white/10 hover:bg-white/20"

                    : "bg-gray-100 hover:bg-gray-200"
                }

              `}
            >

              <X
                size={20}
              />

            </button>


          </div>

        </div>


        {/* MENU */}

        <div
          className="
            space-y-3
          "
        >

          {
            menuItems.map(
              (item) => {

                const Icon =
                  item.icon;


                return (

                  <NavLink

                    key={
                      item.path
                    }

                    to={
                      item.path
                    }


                    // Close sidebar
                    // after selecting page

                    onClick={() =>
                      setIsSidebarOpen(
                        false
                      )
                    }


                    className={
                      ({
                        isActive,
                      }) =>

                      `

                        flex

                        items-center

                        gap-4

                        px-5

                        py-4

                        rounded-2xl

                        transition-all

                        duration-300


                        ${
                          isActive

                            ? darkMode

                              ? "bg-white text-black shadow-lg"

                              : "bg-black text-white shadow-lg"


                            : darkMode

                              ? "text-gray-400 hover:bg-white/10 hover:text-white"

                              : "text-gray-500 hover:bg-gray-100 hover:text-black"
                        }

                      `
                    }

                  >


                    <Icon
                      size={20}
                    />


                    <span
                      className="
                        text-base
                        font-medium
                      "
                    >

                      {
                        item.name
                      }

                    </span>


                  </NavLink>

                );

              }
            )
          }

        </div>

      </div>


      {/* LOGOUT BUTTON */}

      <button

        type="button"

        onClick={
          handleLogout
        }

        className={`

          flex

          items-center

          gap-4

          px-5

          py-4

          rounded-2xl

          transition-all


          ${
            darkMode

              ? "text-gray-400 hover:bg-white/10 hover:text-white"

              : "text-gray-500 hover:bg-gray-100 hover:text-black"
          }

        `}
      >

        <LogOut
          size={20}
        />


        <span
          className="
            text-base
            font-medium
          "
        >

          Logout

        </span>

      </button>


    </div>

  );

};


export default Sidebar;