import  { useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import { useSignupMutation } from "../../redux/slices/Api/Client/clientApiEndPoints";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import GoogleComp from "./GoogleComp";
import Otp from "../../Components/User/Otp";


export const SignupUser = () => {
  const { user, loginWithRedirect,isAuthenticated,logout } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [FnameError, setFnameError] = useState("");
  const [LnameError, setLnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const validateForm = () => {
    setSignupError("");
    let isValid = true;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Validate password format
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
    if (!password.trim() || !passwordRegex.test(password)) {
      setPasswordError("Password must strong");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Validate first name and last name format
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

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim() || !phoneRegex.test(phone) || phone === "0000000000") {
      setPhoneError("Please enter a valid phone number");
      isValid = false;
    } else {
      setPhoneError("");
    }

    // Validate user type selection
    if (category !== "Photographer" && category !== "Artist") {
      setSignupError("Please select");
      isValid = false;
    } else {
      setSignupError("");
    }

    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response:any = await signup({
        email,
        password,
        Fname,
        Lname,
        phone,
        category,
      });
      console.log(response)
      if (response?.error?.data?.message) {
        setSignupError(response?.error?.data?.message);
      } else {
        
        if(response?.data?.status){
          setShowOtp(true)
        }
        else{
          setSignupError('Invalid Credentials');
        }
      }
    } catch (error) {
      setSignupError("Invalid Credentials");
      console.error("Signup failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="flex justify-center items-center min-h-screen signupsection">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
          <div className="justify-center mx-auto text-left align-bottom transition-all transform rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
           {!user && !showOtp && <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
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
                    {FnameError && <p className="text-red-500">{FnameError}</p>}
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
                    {LnameError && <p className="text-red-500">{LnameError}</p>}
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
                    {phoneError && <p className="text-red-500">{phoneError}</p>}
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
                        <span className="ml-2 text-gray-300">Photographer</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="Artist"
                          checked={category === "Artist"}
                          onChange={(e) => setCategory(e.target.value)}
                          className="form-radio h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-gray-300">Artist</span>
                      </label>
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
                      className="inline-flex justify-center text-base font-medium text-gray-300 focus:outline-none hover:text-neutral-600 focus:text-blue-600 sm:text-sm"
                      onClick={() => loginWithRedirect()}  >
                      Signup with google
                    </button>
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
                  src="/src/assets/Login.jpeg"
                  alt=""
                />
              </div>
            </div>}
            {user &&  !showOtp && <GoogleComp/>}
            {!user && showOtp && <Otp setOtp={setShowOtp} />}

          </div>
        </div>
      </section>
    </>
  );
};
