import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSignupMutation } from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { toast } from "react-toastify";


const GoogleComp = () => {
  
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [stateError, setStateError] = useState("");
  const [countryError, setCountryError] = useState("");
  const { user, logout } = useAuth0();
  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [initialPaymentError, setInitialPaymentError] = useState("");
  const [typesOfEvents, setTypesOfEvents] = useState<string[]>([]);

  const [signup] = useSignupMutation();

  const handleRegister = async () => {
    let isValid = true;

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.trim() || !mobileRegex.test(mobile)) {
      setMobileError("Please enter a valid mobile number");
      isValid = false;
    } else {
      setMobileError("");
    }

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
    if (!password.trim() || !passwordRegex.test(password)) {
      setPasswordError("Password must be strong ");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    // Validate user type selection
    if (!userType) {
      setUserTypeError("Please select a user type");
      isValid = false;
    } else {
      setUserTypeError("");
    }

    // Validate district
    if (!district.trim()) {
      setDistrictError("Please enter your district");
      isValid = false;
    } else {
      setDistrictError("");
    }

    // Validate state
    if (!state.trim()) {
      setStateError("Please enter your state");
      isValid = false;
    } else {
      setStateError("");
    }

    // Validate country
    if (!country.trim()) {
      setCountryError("Please enter your country");
      isValid = false;
    } else {
      setCountryError("");
    }

    if (initialPayment < 200) {
      setInitialPaymentError("Initial payment  must be more than 200");
      isValid = false;
    } else {
      setInitialPaymentError("");
    }

    if (!isValid) {
      return;
    }

    const formData = {
      Fname: user?.given_name,
      Lname: user?.family_name,
      email: user?.email,
      password,
      is_google: true,
      phone: mobile,
      location: {
        district,
        state,
        country,
      },
      minPayPerHour: initialPayment,
      typesOfEvents: typesOfEvents,
    };
    console.log("formdata", formData);

    const newUser: any = await signup(formData);
    if (newUser?.error) {
      toast.error(newUser?.error?.data?.message);
    } else {
      toast.success("Successfully Registered");
    }
    setTimeout(logout, 3000);
  };
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setTypesOfEvents((prev) =>
      checked ? [...prev, value] : prev.filter((event) => event !== value)
    );
  };

  return (
    <div className="w-full px-6 py-3">
      <div className="mt-3 text-left sm:mt-5">
        <div className="inline-flex items-center w-full">
          <h3 className="text-lg font-bold text-gray-300 leading-6 lg:text-5xl">
            Complete Signup
          </h3>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div>
          <label htmlFor="mobile" className="sr-only">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobile"
            id="mobile"
            className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          {mobileError && <p className="text-red-500">{mobileError}</p>}
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
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-500 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <p className="text-red-500">{confirmPasswordError}</p>
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
          {districtError && <p className="text-red-500">{districtError}</p>}
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
          {stateError && <p className="text-red-500">{stateError}</p>}
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
          {countryError && <p className="text-red-500">{countryError}</p>}
        </div>
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
            onChange={(e) => setInitialPayment(parseInt(e.target.value))}
          />
          {initialPaymentError && (
            <p className="text-red-500">{initialPaymentError}</p>
          )}
        </div>

        <div className="flex flex-col mt-4 lg:space-y-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Photographer"
              checked={userType === "Photographer"}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-300">Photographer</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Artist"
              checked={userType === "Artist"}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-300">Artist</span>
          </label>
          {userType === "Photographer" && (
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Weddings"
                  checked={typesOfEvents.includes("Weddings")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Weddings</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Corporate Events"
                  checked={typesOfEvents.includes("Corporate Events")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Corporate Events</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Sports Events"
                  checked={typesOfEvents.includes("Sports Events")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Sports Events</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Concerts and Festivals"
                  checked={typesOfEvents.includes("Concerts and Festivals")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">
                  Concerts and Festivals
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Private Events Birthdays"
                  checked={typesOfEvents.includes("Private Events Birthdays")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">
                  Private Events Birthdays
                </span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Charity Events"
                  checked={typesOfEvents.includes("Charity Events")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Charity Events</span>
              </label>
            </div>
          )}

          {userType === "Artist" && (
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Contemporary Art"
                  checked={typesOfEvents.includes("Contemporary Art")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Contemporary Art</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Face Paint"
                  checked={typesOfEvents.includes("Face Paint")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Face Paint</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Portrait"
                  checked={typesOfEvents.includes("Portrait")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Portrait</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Landscape Art"
                  checked={typesOfEvents.includes("Landscape Art")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Landscape Art</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Event Artist"
                  checked={typesOfEvents.includes("Event Artist")}
                  onChange={handleEventChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-300">Event Artist</span>
              </label>
            </div>
          )}
          <button
            type="button"
            className="flex items-center  m-1 justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleRegister}
          >
            {" "}
            Register
          </button>
          <button
            type="button"
            className="flex items-center m-1 justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
              logout();
              navigate("/signup");
            }}
          >
            Cancel
          </button>
          {userTypeError && <p className="text-red-500">{userTypeError}</p>}
          <a
            href="#"
            className="inline-flex justify-center py-4 text-base font-medium text-gray-300 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
          >
            Forgot your Password?
          </a>
          <Link
            to="/signup"
            className="inline-flex justify-center text-base font-medium text-gray-300 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoogleComp;
