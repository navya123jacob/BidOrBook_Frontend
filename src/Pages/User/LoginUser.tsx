import React, { useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import { useLoginMutation } from "../../redux/slices/Api/Client/clientApiEndPoints";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [login, { isLoading, isError, error }] = useLoginMutation();

    const validateForm = () => {
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
            const response = await login({ email, password });
            if ('error' in response) {
                // Handle error response
                console.error("Login failed");
            } else {
                // Handle successful login
                console.log(response.data);
                navigate("/");
            }
        } catch (error) {
            // Handle login error
            console.error("Login failed:", error);
        }
    };

    return (
        <>
            <Navbar />
            <section className="flex justify-center items-center h-screen">
                <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:px-12 lg:px-24 lg:py-24">
                    <div className="justify-center mx-auto text-left align-bottom transition-all transform rounded-lg sm:align-middle sm:max-w-2xl sm:w-full">
                        <div className="grid flex-wrap items-center justify-center grid-cols-1 mx-auto shadow-xl lg:grid-cols-2 rounded-xl">
                            <div className="w-full px-6 py-3">
                                <div className="mt-3 text-left sm:mt-5">
                                    <div className="inline-flex items-center w-full">
                                        <h3 className="text-lg font-bold text-neutral-600 leading-6 lg:text-5xl">Log In</h3>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div>
                                        <label htmlFor="email" className="sr-only">Email</label>
                                        <input type="text" name="email" id="email" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                                        {emailError && <p className="text-red-500">{emailError}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="sr-only">Password</label>
                                        <input type="password" name="password" id="password" className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                                        {passwordError && <p className="text-red-500">{passwordError}</p>}
                                    </div>
                                    <div className="flex flex-col mt-4 lg:space-y-2">
                                        <button type="button" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={handleLogin} disabled={isLoading}>Log In</button>
                                        {isError && <p className="text-red-500">{error.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="order-first hidden w-full lg:block">
                                <img className="object-cover h-full bg-cover rounded-l-lg" src="src/assets/Login.jpeg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginUser;
