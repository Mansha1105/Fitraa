import React, {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
} from "lucide-react";


const Login = () => {

  const navigate =
    useNavigate();


  const [
    isLogin,
    setIsLogin,
  ] = useState(true);


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    message,
    setMessage,
  ] = useState("");


  const [
    isError,
    setIsError,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({

    name: "",

    email: "",

    password: "",

  });


  const handleChange = (e) => {

    setFormData(
      (prev) => ({

        ...prev,

        [e.target.name]:
          e.target.value,

      })
    );

  };


  // LOGIN / SIGNUP

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      try {

        const url =
          isLogin

            ? `${import.meta.env.VITE_API_URL}/api/auth/login`

            : `${import.meta.env.VITE_API_URL}/api/auth/signup`;


        const bodyData =
          isLogin

            ? {

                email:
                  formData.email,

                password:
                  formData.password,

              }

            : formData;


        const res =
          await fetch(
            url,
            {

              method:
                "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body:
                JSON.stringify(
                  bodyData
                ),

            }
          );


        const data =
          await res.json();


        if (res.ok) {

          setIsError(
            false
          );


          // SAVE JWT TOKEN

          if (
            data.token
          ) {

            localStorage.setItem(

              "token",

              data.token

            );

          }


          // LOGIN

          if (
            isLogin
          ) {

            setMessage(
              "Login successful!"
            );


            setTimeout(
              () => {

                navigate(
                  "/dashboard"
                );

              },

              1000
            );

          }


          // SIGNUP

          else {

            setMessage(

              "Account created! Let's set up your profile..."

            );


            localStorage.removeItem(

              "fitraaWorkoutPlan"

            );


            setTimeout(
              () => {

                navigate(
                  "/setup"
                );

              },

              1000
            );

          }

        }


        else {

          setIsError(
            true
          );


          setMessage(

            data.message ||

            "Something went wrong"

          );

        }

      }


      catch (
        error
      ) {

        console.error(
          error
        );


        setIsError(
          true
        );


        if (

          error.message.includes(

            "Failed to fetch"

          )

        ) {

          setMessage(

            "Backend server is not running"

          );

        }


        else {

          setMessage(

            "Server error. Try again."

          );

        }

      }

    };


  return (

    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-white
      "
    >


      {/* DESKTOP BACKGROUND */}

      <div
        className="
          hidden
          min-h-screen
          lg:flex
        "
      >


        {/* LEFT SIDE */}

        <div
          className="
            relative
            flex
            w-1/2
            flex-col
            justify-center
            bg-black
            px-12
            text-white
            xl:px-24
          "
        >

          <p
            className="
              mb-4
              text-sm
              uppercase
              tracking-[8px]
              text-gray-400
            "
          >

            Train • Track • Transform

          </p>


          <h1
            className="
              mb-6
              text-6xl
              font-extrabold
              tracking-[6px]
              xl:text-7xl
            "
          >

            FITRAA

          </h1>


          <div
            className="
              mb-8
              h-1
              w-24
              rounded-full
              bg-white
            "
          />


          <p
            className="
              max-w-lg
              text-lg
              leading-8
              text-gray-300
              xl:text-xl
              xl:leading-9
            "
          >

            Your personal fitness companion
            to track workouts, monitor
            progress, and stay disciplined
            every single day.

          </p>

        </div>


        {/* RIGHT SIDE */}

        <div
          className="
            relative
            flex
            w-1/2
            flex-col
            justify-center
            bg-black
            px-12
            text-white
            xl:px-20
          "
        >

          <p
            className="
              mb-4
              text-sm
              uppercase
              tracking-[6px]
              text-gray-400
            "
          >

            JOIN THE JOURNEY

          </p>


          <h1
            className="
              mb-6
              text-5xl
              font-bold
              xl:text-6xl
            "
          >

            Start Strong

          </h1>


          <div
            className="
              mb-10
              h-1
              w-16
              rounded-full
              bg-white
            "
          />


          <p
            className="
              max-w-lg
              text-lg
              leading-8
              text-gray-300
              xl:leading-9
            "
          >

            Create your account and begin
            tracking workouts, calories,
            progress, and fitness goals all
            in one place.

          </p>

        </div>

      </div>


      {/* FORM PANEL */}

      <div
        className={`

          min-h-screen

          w-full

          bg-white

          transition-all

          duration-700


          lg:absolute

          lg:top-0

          lg:h-full

          lg:min-h-0

          lg:w-1/2

          lg:shadow-2xl


          ${
            isLogin

              ? "lg:left-1/2"

              : "lg:left-0"
          }

        `}
      >


        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-5
            py-10

            sm:px-8

            lg:h-full
            lg:min-h-0
            lg:px-12

            xl:px-20
          "
        >


          <div
            className="
              w-full
              max-w-md
            "
          >


            {/* MOBILE BRAND */}

            <div
              className="
                mb-12
                lg:hidden
              "
            >

              <p
                className="
                  mb-3
                  text-xs
                  uppercase
                  tracking-[6px]
                  text-gray-400
                "
              >

                Fitness App

              </p>


              <h1
                className="
                  text-4xl
                  font-extrabold
                  tracking-[4px]
                  text-black

                  sm:text-5xl
                "
              >

                FITRAAA

              </h1>


              <div
                className="
                  mt-5
                  h-1
                  w-16
                  rounded-full
                  bg-black
                "
              />

            </div>


            <p
              className="
                mb-4
                text-xs
                uppercase
                tracking-[4px]
                text-gray-400

                sm:text-sm
                sm:tracking-[6px]
              "
            >

              {
                isLogin

                  ? "Welcome Back"

                  : "Join FITRAA"
              }

            </p>


            <h1
              className="
                mb-8
                text-4xl
                font-bold
                text-black

                sm:text-5xl

                lg:mb-10
                lg:text-6xl
              "
            >

              {
                isLogin

                  ? "Sign In"

                  : "Sign Up"
              }

            </h1>


            {/* MESSAGE */}

            {
              message && (

                <div
                  className={`

                    mb-6

                    rounded-lg

                    px-4

                    py-3

                    text-sm


                    ${
                      isError

                        ? "bg-red-100 text-red-600"

                        : "bg-green-100 text-green-600"
                    }

                  `}
                >

                  {
                    message
                  }

                </div>

              )
            }


            {/* FORM */}

            <form

              onSubmit={
                handleSubmit
              }

              className="
                space-y-6

                sm:space-y-8
              "

            >


              {
                !isLogin && (

                  <input

                    type="text"

                    name="name"

                    value={
                      formData.name
                    }

                    placeholder="Full Name"

                    className="
                      w-full
                      border-b
                      border-gray-300
                      py-4
                      text-base
                      text-black
                      outline-none

                      focus:border-black

                      sm:text-lg
                    "

                    onChange={
                      handleChange
                    }

                    required

                  />

                )
              }


              <input

                type="email"

                name="email"

                value={
                  formData.email
                }

                placeholder="Email Address"

                className="
                  w-full
                  border-b
                  border-gray-300
                  py-4
                  text-base
                  text-black
                  outline-none

                  focus:border-black

                  sm:text-lg
                "

                onChange={
                  handleChange
                }

                required

              />


              {/* PASSWORD */}

              <div
                className="
                  relative
                "
              >

                <input

                  type={
                    showPassword

                      ? "text"

                      : "password"
                  }

                  name="password"

                  value={
                    formData.password
                  }

                  placeholder="Password"

                  className="
                    w-full
                    border-b
                    border-gray-300
                    py-4
                    pr-12
                    text-base
                    text-black
                    outline-none

                    focus:border-black

                    sm:text-lg
                  "

                  onChange={
                    handleChange
                  }

                  required

                />


                <button

                  type="button"

                  aria-label={

                    showPassword

                      ? "Hide password"

                      : "Show password"

                  }

                  className="
                    absolute
                    right-0
                    top-1/2
                    -translate-y-1/2
                    p-2
                    text-black
                  "

                  onClick={() =>

                    setShowPassword(

                      !showPassword

                    )

                  }

                >

                  {
                    showPassword

                      ? (

                        <EyeOff
                          size={19}
                        />

                      )

                      : (

                        <Eye
                          size={19}
                        />

                      )
                  }

                </button>

              </div>


              {/* SUBMIT */}

              <button

                type="submit"

                className="
                  w-full
                  rounded-full
                  bg-black
                  py-4
                  text-base
                  font-semibold
                  text-white
                  transition

                  hover:bg-zinc-800

                  sm:text-lg
                "

              >

                {
                  isLogin

                    ? "Login"

                    : "Create Account"
                }

              </button>

            </form>


            {/* CHANGE MODE */}

            <p
              className="
                mt-9
                text-center
                text-sm
                text-gray-500

                sm:mt-12
                sm:text-lg
              "
            >

              {
                isLogin

                  ? "Don't have an account?"

                  : "Already have an account?"
              }


              <button

                type="button"

                onClick={() => {

                  setIsLogin(
                    !isLogin
                  );

                  setMessage(
                    ""
                  );

                  setIsError(
                    false
                  );

                }}

                className="
                  ml-2
                  font-semibold
                  text-black
                "

              >

                {
                  isLogin

                    ? "Sign Up"

                    : "Sign In"
                }

              </button>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};
export default Login;