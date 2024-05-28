import React, { useState, useEffect, useRef } from 'react';
import { useResendOtpMutation, useVerifyOtpMutation, useVerifyotp2Mutation, useSetpasswordMutation, useLoginMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from '../../redux/slices/Reducers/ClientReducer';
import { useForgotresendOtpMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
interface OtpProps {
    setOtp: React.Dispatch<React.SetStateAction<boolean>>;
    forgot?: boolean;
}

interface NewOtpData {
    data?: string;
}

const Otp: React.FC<OtpProps> = ({ setOtp, forgot = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [timer, setTimer] = useState(120);
    const [resendOtp] = useResendOtpMutation();
    const [verifyOtp] = useVerifyOtpMutation();
    const [verifyotp2] = useVerifyotp2Mutation();
    const [setpassword] = useSetpasswordMutation();
    const [login] = useLoginMutation();
    const [forgotresendOtp]=useForgotresendOtpMutation()
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(4).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            setOtp(false);
        }
    }, [timer, setOtp]);

    const resendotpfn = async () => {
        try {
            const newotp: (NewOtpData | any) = await resendOtp({});
            if (newotp.data) {
                setResendMessage(newotp.data);
                setTimer(120);
                setTimeout(() => setResendMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error while resending OTP:', error);
        }
    };

    const verifyotpfn = async () => {
        try {
            const otp = otpDigits.join('');
            console.log(otp);
            const verification: any = await verifyOtp({ otp });
            console.log(verification);
            if (verification?.error) {
                setResendMessage(verification?.error?.data?.error);
                setTimeout(() => setResendMessage(null), 3000);
            } else {
                toast.success('Successfully Registered');
                navigate('/');
            }
        } catch (error) {
            console.error('Error while verifying OTP:', error);
        }
    };

    const handleforgot = async () => {
        try {
            const otp = otpDigits.join('');
            console.log(otp);
            const verification: any = await verifyotp2({ otp });
            console.log(verification);
            if (verification?.error) {
                setResendMessage(verification?.error?.data?.message);
                setTimeout(() => setResendMessage(null), 3000);
            } else {
                toast.success(verification?.data?.message);
                setShowNewPassword(true);
                setTimer(240);
            }
        } catch (error) {
            console.error('Error while verifying OTP:', error);
        }
    };
    const forgotresendotpfn = async () => {
        try {
            const response=await forgotresendOtp(undefined)
            
            if('data' in response){
                setResendMessage(response?.data);
            }
            
            setTimer(120)
        } catch (error) {
            console.error('Error while resending OTP:', error);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.match(/^[0-9]$/)) {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index] = value;
            setOtpDigits(newOtpDigits);
            if (index < otpDigits.length - 1 && value) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (value === '') {
            const newOtpDigits = [...otpDigits];
            newOtpDigits[index] = '';
            setOtpDigits(newOtpDigits);
        }
    };

    const handleChangePassword = async () => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!regex.test(newPassword)) {
            setResendMessage("Invalid password");
            setTimeout(() => setResendMessage(null), 3000);
            return;
        }
        if (!userType) {
            setResendMessage("Select a user type");
            setTimeout(() => setResendMessage(null), 3000);
            return;
        }
        let response: any = await setpassword({ password: newPassword });
        console.log(response);
        if ('error' in response) {
            setResendMessage(response.error?.data?.data?.message);
        } else {
            const response2: any = await login({ email: response?.data?.data?.email, password: newPassword });
            if ('error' in response2) {
                setResendMessage("Invalid Credentials");
            } else {
                response2.client = userType === "client";
                toast.success('Password changed successfully');
                dispatch(setCredentials({ ...response2 }));
                navigate('/');
            }
        }
    };

    return (
        <div className="bg-white bg-opacity-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
            {!showNewPassword ? (
                <form className="shadow-md px-4 py-6">
                    <div className="flex justify-center gap-2 mb-6">
                        {otpDigits.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 text-black"
                                type="text"
                                maxLength={1}
                                pattern="[0-9]"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && digit === '' && index > 0) {
                                        inputRefs.current[index - 1]?.focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-center">
                        {forgot ? (
                            <>
                                <button
                                    className="bg-blue-950 rounded-xl hover:bg-gray-800 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={handleforgot}
                                >
                                    Verify
                                </button>
                                <button
                                    className="bg-blue-950 rounded-xl hover:bg-gray-800 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={forgotresendotpfn}
                                >
                                    Resend OTP
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="bg-blue-950 rounded-xl hover:bg-gray-800 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={verifyotpfn}
                                >
                                    Verify
                                </button>
                                <button
                                    className="bg-blue-950 rounded-xl hover:bg-gray-800 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={resendotpfn}
                                >
                                    Resend OTP
                                </button>
                            </>
                        )}
                    </div>
                </form>
            ) : (
                <>
                    <form className="shadow-md px-4 py-6">
                        <div className="mb-6">
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                className="w-full px-3 py-2 text-gray-700 border rounded-md focus:border-teal-500 focus:ring-teal-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="bg-blue-950 rounded-xl hover:bg-gray-800 m-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleChangePassword}
                        >
                            Change Password
                        </button>
                    </form>
                    <div className="mt-4 text-center text-gray-600">User Type:</div>
                    <div className="flex justify-center gap-4 mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="client"
                                checked={userType === "client"}
                                onChange={(e) => setUserType(e.target.value)}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Client</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="artist"
                                checked={userType === "artist"}
                                onChange={(e) => setUserType(e.target.value)}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Artist/Photographer</span>
                        </label>
                    </div>
                </>
            )}
            <div className="mt-4 text-center text-gray-600">Timer: {timer} seconds</div>
            <div className="text-sm text-red-600 mt-2">
                {resendMessage && (
                    <div>
                        <span>{resendMessage}</span>
                    </div>
                )}
                Please do not refresh the page.
            </div>
        </div>
    );
};

export default Otp;
