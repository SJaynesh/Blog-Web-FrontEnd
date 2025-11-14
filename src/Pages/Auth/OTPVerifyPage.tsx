import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { routePath } from "../../Routes/route";
import { ErrorAlert } from "../../Components/ErrorAlert";
import { authService } from "../../Services/AuthService";
import type { OTPVerifyPayLoad } from "../../Types/types";
import toast from "react-hot-toast";



export default function OTPVerifyPage() {
    const [loader, setLoader] = useState<boolean>(false);
    const [resetLoader, setResetLoader] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [error, setError] = useState<string>("");
    const [timer, setTimer] = useState<number>(120);

    const location = useLocation();

    const state = location.state;

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!state) {
            navigate(routePath.login, { replace: true });
        }

        setEmail(state.email);
    }, []);


    useEffect(() => {
        if (timer <= 0) {
            return
        }

        const t = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(t);
    }, [timer]);


    const formateTimer = (sec: number) => {
        const minute = Math.floor(sec / 60);
        const second = sec % 60;

        return `0${minute}:${second < 10 ? "0" : ""}${second}`;
    }


    const handleOtpChange = (index: number, value: string) => {
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError("");

        // Auto-focus to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move to previous input on backspace
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const pastedOtp = pastedData.split('');
        const newOtp = [...otp];

        pastedOtp.forEach((digit, index) => {
            if (index < 6) {
                newOtp[index] = digit;
            }
        });

        setOtp(newOtp);
        setError("");

        // Focus on the next empty input or last input
        const nextEmptyIndex = pastedOtp.length < 6 ? pastedOtp.length : 5;
        inputRefs.current[nextEmptyIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        if (!/^\d{6}$/.test(otpString)) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        console.log("OTP : ", otpString);

        const payload: OTPVerifyPayLoad = {
            email,
            OTP: otpString,
        }

        try {
            setLoader(true);
            const data = await authService.OTPVerify(payload);

            if (!data.error) {
                navigate(routePath.changePassword, { replace: true, state: { email } });
                toast.success(data.message);
                setError("");
            } else {
                setError(data.message)
            }
        } catch (error) {
            console.log("OTP Verify Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }

        setLoader(false);

    };

    const handleResendOtp = async (event: any) => {
        event.preventDefault();

        try {
            setResetLoader(true);
            const data = await authService.forgotPassword({ email });

            if (!data.error) {
                toast.success(data.message);
                setOtp(Array(6).fill(""));
                setTimer(120);
                setError("");
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.log("Resend OTP: ", error);
            toast.error("Something went wrong. Please try again..");
        }

        setResetLoader(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP 🔐</h2>
                    <p className="text-gray-500">Enter the 6-digit code sent to your email</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>


                    {/* Error Message */}
                    {error && <ErrorAlert message={error} />}

                    {/* OTP Input Boxes */}
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-medium mb-2 text-center">
                            6-Digit Verification Code
                        </label>
                        <div className="flex justify-center space-x-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loader}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-transform transform hover:scale-[1.02] font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loader ? <ButtonLoader message="Verifying..." /> : "Verify OTP"}
                    </button>

                    {/* Resend OTP Section */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-2">
                            {timer === 0 ? <>
                                <button onClick={handleResendOtp}>{resetLoader ? <div className="flex justify-center items-center">
                                    <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                                    <span className="ml-2">"Sending..."</span>
                                </div> : "Resent OTP"}</button>
                            </> : formateTimer(timer)}
                        </p>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}