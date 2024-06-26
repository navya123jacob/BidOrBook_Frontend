import { useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import { useSignupMutation } from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import {  Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GoogleComp from "./GoogleComp";
import Otp from "../../Components/User/Otp";

export const SignupUser = () => {
  const { user, loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [SignupError, setSignupError] = useState("");
  const [signup, { isLoading }] = useSignupMutation();
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [FnameError, setFnameError] = useState("");
  const [LnameError, setLnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [stateError, setStateError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [typesOfEvents, setTypesOfEvents] = useState<string[]>([]);
  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [initialPaymentError, setInitialPaymentError] = useState("");

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setTypesOfEvents((prev) =>
      checked ? [...prev, value] : prev.filter((event) => event !== value)
    );
  };

  const validateForm = () => {
    setSignupError("");
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
    if (!password.trim() || !passwordRegex.test(password)) {
      setPasswordError("Password must strong");
      isValid = false;
    } else {
      setPasswordError("");
    }

    const nameRegex = /^[a-zA-Z ]+$/;
    if (!Fname.trim() || !nameRegex.test(Fname)) {
      setFnameError("Please enter a valid first name ");
      isValid = false;
    } else {
      setFnameError("");
    }

    if (!Lname.trim() || !nameRegex.test(Lname)) {
      setLnameError("Please enter a valid last name ");
      isValid = false;
    } else {
      setLnameError("");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim() || !phoneRegex.test(phone) || phone === "0000000000") {
      setPhoneError("Please enter a valid phone number");
      isValid = false;
    } else {
      setPhoneError("");
    }

    if (!district.trim()) {
      setDistrictError("Please enter a valid district");
      isValid = false;
    } else {
      setDistrictError("");
    }

    if (!state.trim()) {
      setStateError("Please enter a valid state");
      isValid = false;
    } else {
      setStateError("");
    }

    if (!country.trim()) {
      setCountryError("Please enter a valid country");
      isValid = false;
    } else {
      setCountryError("");
    }

    if (category !== "Photographer" && category !== "Artist") {
      setSignupError("Please select a category");
      isValid = false;
    } else {
      setSignupError("");
    }
    if (initialPayment < 200) {
      setInitialPaymentError("Initial payment must be more than 200");
      isValid = false;
    } else {
      setInitialPaymentError("");
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response: any = await signup({
        email,
        password,
        Fname,
        Lname,
        phone,
        category,
        location: {
          district,
          state,
          country,
        },
        wallet: 0,
        spam: [],
        receivedReviews: [],
        minPayPerHour: initialPayment,
        typesOfEvents: typesOfEvents,
      });
      console.log(response);
      if (response?.error?.data?.message) {
        setSignupError(response?.error?.data?.message);
      } else {
        if (response?.data?.status) {
          setShowOtp(true);
        } else {
          setSignupError("Invalid Credentials");
        }
      }
    } catch (error) {
      setSignupError("Invalid Credentials");
      console.error("Signup failed:", error);
    }
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <section className="flex justify-center items-center min-h-screen signupsection">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="justify-center mx-auto text-left align-bottom transition-all transform rounded-lg sm:align-middle sm:max-w-2xl sm:w-full bg-white bg-opacity-20">
            {!user && !showOtp && (
              <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
                <div className="w-full px-6 py-3">
                  <div className="mt-3 text-left sm:mt-5">
                    <div className="inline-flex items-center w-full">
                      <h3 className="text-lg font-bold text-gray leading-6 lg:text-5xl">
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
                      {FnameError && (
                        <p className="text-red-500">{FnameError}</p>
                      )}
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
                      {LnameError && (
                        <p className="text-red-500">{LnameError}</p>
                      )}
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
                      {emailError && (
                        <p className="text-red-500">{emailError}</p>
                      )}
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
                      <label htmlFor="phone" className="sr-only">
                        phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                        placeholder="Enter your phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {phoneError && (
                        <p className="text-red-500">{phoneError}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="district" className="sr-only">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        id="district"
                        className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                        placeholder="Enter your district"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                      {districtError && (
                        <p className="text-red-500">{districtError}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="sr-only">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        id="state"
                        className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                        placeholder="Enter your state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                      {stateError && (
                        <p className="text-red-500">{stateError}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="country" className="sr-only">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                        placeholder="Enter your country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                      {countryError && (
                        <p className="text-red-500">{countryError}</p>
                      )}
                    </div>
                    <div className="flex flex-col mt-4 lg:space-y-2">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="Photographer"
                            checked={category === "Photographer"}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray">Photographer</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="Artist"
                            checked={category === "Artist"}
                            onChange={(e) => setCategory(e.target.value)}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray">Artist</span>
                        </label>
                        {category === "Photographer" && (
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Weddings"
                                checked={typesOfEvents.includes("Weddings")}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">Weddings</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Corporate Events"
                                checked={typesOfEvents.includes(
                                  "Corporate Events"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Corporate Events
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Sports Events"
                                checked={typesOfEvents.includes(
                                  "Sports Events"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Sports Events
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Concerts and Festivals"
                                checked={typesOfEvents.includes(
                                  "Concerts and Festivals"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Concerts and Festivals
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Private Events Birthdays"
                                checked={typesOfEvents.includes(
                                  "Private Events Birthdays"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Private Events Birthdays
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Charity Events"
                                checked={typesOfEvents.includes(
                                  "Charity Events"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Charity Events
                              </span>
                            </label>
                          </div>
                        )}

                        {category === "Artist" && (
                          <div>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Contemporary Art"
                                checked={typesOfEvents.includes(
                                  "Contemporary Art"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Contemporary Art
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Face Paint"
                                checked={typesOfEvents.includes("Face Paint")}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">Face Paint</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Portrait"
                                checked={typesOfEvents.includes("Portrait")}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">Portrait</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Landscape Art"
                                checked={typesOfEvents.includes(
                                  "Landscape Art"
                                )}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Landscape Art
                              </span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                value="Event Artist"
                                checked={typesOfEvents.includes("Event Artist")}
                                onChange={handleEventChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-gray">
                                Event Artist
                              </span>
                            </label>
                          </div>
                        )}
                        <div>
                          <label htmlFor="initialPayment" className="sr-only">
                            Initial Payment Amount Per Hour
                          </label>
                          <input
                            type="number"
                            name="initialPayment"
                            id="initialPayment"
                            className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                            placeholder="Enter your initial payment amount per hour"
                            value={initialPayment}
                            onChange={(e) =>
                              setInitialPayment(parseInt(e.target.value))
                            }
                          />
                          {initialPaymentError && (
                            <p className="text-red-500">
                              {initialPaymentError}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleSignup}
                        disabled={isLoading}
                      >
                        Sign Up
                      </button>
                      {SignupError && (
                        <p className="text-red-500">{SignupError}</p>
                      )}
                      <button
                        type="button"
                        className="inline-flex justify-center text-base font-medium text-gray focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                        onClick={() => loginWithRedirect()}
                      >
                        Signup with google
                      </button>
                      <Link
                        to="/"
                        type="button"
                        className="inline-flex justify-center  text-base font-medium text-gray focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                      >
                        Already have an account? Log In
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="order-first hidden w-full lg:block">
                  <img
                    className="object-cover h-full bg-cover rounded-l-lg"
                    src="/Login.jpeg"
                    alt=""
                  />
                </div>
              </div>
            )}
            {user && !showOtp && <GoogleComp />}
            {!user && showOtp && <Otp setOtp={setShowOtp} />}
          </div>
        </div>
      </section>
    </>
  );
};
