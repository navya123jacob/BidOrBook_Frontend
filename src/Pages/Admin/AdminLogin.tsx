import  { useState } from "react";
import { useAdminloginMutation } from "../../redux/slices/Api/EndPoints/AdminEndpoints";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../redux/slices/Reducers/AdminReducer";

const LoginAdmin = () => {
 
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [login, { isLoading }] =  useAdminloginMutation();
 

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

    
    

    return isValid;
  };
 
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response: any = await login({ email, password });
      console.log(response)
      if ("error" in response) {
        setLoginError(response.error.data?.message);
      } else {
       
        dispatch(setAdminCredentials(response.data ));
       
        
      }
    } catch (error) {
      setLoginError("Invalid Credentials");
      console.error("Login failed:", error);
    }
  };

  return (
    <>
     
      
  <section className="flex justify-center items-center h-screen signupsection">
    <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
    
      <div className="justify-center mx-auto text-left align-bottom transition-all transform rounded-lg sm:align-middle sm:max-w-2xl sm:w-full bg-white bg-opacity-20">
      <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
          <div className="w-full px-6 py-3">
            <div className="mt-3 text-left sm:mt-5 ">
              <div className="inline-flex items-center w-full">
                <h3 className="text-lg font-bold text-gray-300 leading-6 lg:text-5xl">
                 ADMIN
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-2">
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
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex flex-col mt-4 lg:space-y-2">
                
                <button
                  type="button"
                  className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-graydark rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-800"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  Log In
                </button>
                {loginError && <p className="text-red-500">{loginError}</p>}
                
                
              </div>
            </div>
          </div>
        
          <div className="order-first hidden w-full lg:block">
            <img
              className="object-cover h-full bg-cover rounded-l-lg"
              src="/adminloginsec.jpeg"
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

export default LoginAdmin;

