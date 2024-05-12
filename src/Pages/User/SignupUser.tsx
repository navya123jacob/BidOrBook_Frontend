

import React, { useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import { useLoginMutation } from "../../redux/slices/Api/Client/clientApiEndPoints";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/Reducers/ClientReducer";

export const SignupUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [userType, setUserType] = useState("client"); // Default user type to client
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState(""); // To store selected category

  const validateForm = () => {
    setLoginError("");
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!userType) {
      setLoginError("Please select a user type");
      isValid = false;
    }

    if (userType === "artist" && !category) {
      setLoginError("Please select a category");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await login({
        email,
        password,
        userType,
        Fname,
        Lname,
        mobile,
        category,
      });
      if ("error" in response) {
        setLoginError("Invalid Credentials");
      } else {
        // dispatch(setCredentials(response));
        navigate("/");
      }
    } catch (error) {
      setLoginError("Invalid Credentials");
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <section
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(/src/assets/loginbg.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="justify-center mx-auto text-left align-bottom transition-all transform rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
              <div className="w-full px-6 py-3">
                <div className="mt-3 text-left sm:mt-5">
                  <div className="inline-flex items-center w-full">
                    <h3 className="text-lg font-bold text-gray-300 leading-6 lg:text-5xl">
                      Sign Up
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                <div>
                    <label htmlFor="Fname" className="sr-only">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="Fname"
                      id="Fname"
                      className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="Enter your First Name"
                      value={Fname}
                      onChange={(e) => setFname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="Lname" className="sr-only">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="Lname"
                      id="Lname"
                      className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="Enter your Last Name"
                      value={Lname}
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p className="text-red-500">{emailError}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && (
                      <p className="text-red-500">{passwordError}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="mobile" className="sr-only">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      id="mobile"
                      className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                      placeholder="Enter your Mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col mt-4 lg:space-y-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="client"
                        checked={userType === "client"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-300">Artist</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="artist"
                        checked={userType === "artist"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-300">Photographer</span>
                    </label>
                    {userType === "artist" && (
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="photographer"
                            checked={category === "photographer"}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray-300">Photographer</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="artist"
                            checked={category === "artist"}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray-300">Artist</span>
                        </label>
                      </div>
                    )}
                    <button
                      type="button"
                      className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      Log In
                    </button>
                    {loginError && <p className="text-red-500">{loginError}</p>}
                    <a
                      href="#"
                      type="button"
                      className="inline-flex justify-center py-4 text-base font-medium text-gray-300 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                    >
                      Forgot your Password?
                    </a>
                    <Link
                      to="/"
                      type="button"
                      className="inline-flex justify-center  text-base font-medium text-gray-300 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                    >
                      Already have an account? Log In
                    </Link>
                  </div>
                </div>
              </div>
              <div className="order-first hidden w-full lg:block">
                <img
                  className="object-cover h-full bg-cover rounded-l-lg"
                  src="src/assets/Login.jpeg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};


