import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useSignupMutation } from '../../redux/slices/Api/Client/clientApiEndPoints';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
// google response type
interface NewUserResponse {
    status: number; 
    data: any; 
  }
  
const GoogleComp = () => {
    const G_Password = import.meta.env.VITE_GOOGLE_PASSWORD;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [userTypeError, setUserTypeError] = useState('');
    const { user, logout } = useAuth0();
    const [signup, { isLoading }] = useSignupMutation();
    console.log(user);
  
    const handleRegister = async () => {
      let isValid = true;
  
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobile.trim() || !mobileRegex.test(mobile)) {
        setMobileError('Please enter a valid mobile number');
        isValid = false;
      } else {
        setMobileError('');
      }
  
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
      if (!password.trim() || !passwordRegex.test(password)) {
        setPasswordError('Password must be strong ');
        isValid = false;
      } else {
        setPasswordError('');
      }
  
      // Validate confirm password
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        isValid = false;
      } else {
        setConfirmPasswordError('');
      }
  
      // Validate user type selection
      if (!userType) {
        setUserTypeError('Please select a user type');
        isValid = false;
      } else {
        setUserTypeError('');
      }
  
      if (!isValid) {
        return;
      }
  
      const formData = {
        fname: user?.given_name,
        lname: user?.family_name,
        email: user?.email,
        password,
        is_google: true,
        phone: mobile
      };
  
      const newUser:any = await signup(formData);
      if(newUser?.error){
      toast.error(newUser?.error?.data?.message)}
      else{
        toast.success('Successfully Registered')
      }
      setTimeout(logout, 3000);

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
        <div className="flex flex-col mt-4 lg:space-y-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Photographer"
              checked={userType === 'Photographer'}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-300">Photographer</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="Artist"
              checked={userType === 'Artist'}
              onChange={(e) => setUserType(e.target.value)}
              className="form-radio h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-300">Artist</span>
          </label>
          <button
            type="button"
            className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleRegister}
          >            Register
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={() => {
             logout()
             navigate('/signup')
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

