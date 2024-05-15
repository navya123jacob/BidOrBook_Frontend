import React, { useState, useEffect } from 'react';
import { useResendOtpMutation,useVerifyOtpMutation } from '../../redux/slices/Api/Client/clientApiEndPoints';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
interface OtpProps {
    setOtp: React.Dispatch<React.SetStateAction<boolean>>;
}
interface NewOtpData {
    data?: string;
}

const Otp: React.FC<OtpProps> = ({ setOtp }) => {
    const navigate=useNavigate()
    const [timer, setTimer] = useState(120); 
    const [resendOtp] = useResendOtpMutation();
    const [verifyOtp]=useVerifyOtpMutation()
    const [resendMessage, setResendMessage] = useState<string | null>(null); 
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(4).fill('')); 

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
            const newotp: (NewOtpData|any) = await resendOtp({});
            if (newotp.data) {
                setResendMessage(newotp.data); 
                setTimer(120)
                setTimeout(() => setResendMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error while resending OTP:', error);
        }
    };

    const verifyotpfn = async () => {
        try {
            
            const otp = otpDigits.join('');
            console.log(otp)
            const verification:any = await verifyOtp({ otp }); 
            console.log(verification);
            if(verification?.error){
                setResendMessage(verification?.error?.data?.error);
                setTimeout(() => setResendMessage(null), 3000);
            }
            else{
                toast.success('Successfully Registered')
                
                    navigate('/');
                  
            }
        } catch (error) {
            console.error('Error while verifying OTP:', error);
        }
    };
    const handleOtpChange = (index: number, value: string) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);
    };

    return (
        <div className="bg-white bg-opacity-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">OTP Verification</h2>
            <form className="shadow-md px-4 py-6">
                <div className="flex justify-center gap-2 mb-6">
                    {otpDigits.map((digit, index) => (
                        <input
                            key={index}
                            className="w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 text-black"
                            type="text"
                            maxLength={1}
                            pattern="[0-9]"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                        />
                    ))}
                </div>
                <div className="flex items-center justify-center">
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
                </div>
            </form>
            <div className="mt-4 text-center text-gray-600">Timer: {timer} seconds</div>
            <div className="text-sm text-teal-600 mt-2">
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