import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";
import { routePath } from "../../Routes/route";





export default function ForgotPasswordPage() {
    const [loader, setLoader] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [loginFailed, setloginFailed] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!email) {
            setloginFailed("email is required..")
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setloginFailed("Please enter a valid email address.")
            return;
        }

        // API Called

        console.log(email);
        try {
            setLoader(true);
            const data = await authService.forgotPassword({ email });

            if (!data.error) {
                toast.success(data.message);
                setloginFailed("");

                navigate(routePath.otpVerify, { replace: true, state: { email } });

            } else {
                setloginFailed(data.message);
            }
            setLoader(false);
        } catch (err) {
            console.log("Forgot Password : ", err);
            toast.error("Something went wrong. Please try again..");
        }
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password 🔒</h2>
                    <p className="text-gray-500">change your password</p>
                </div>

                <form className="space-y-6 mt-8" onSubmit={handleSubmit}>

                    {/* --- Custom Alert for Login Failure --- */}
                    {loginFailed && <ErrorAlert message={loginFailed} />}

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        // disabled={loader}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-transform transform hover:scale-[1.02] font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {/* --- Using the Custom Loader --- */}
                        {loader ? <ButtonLoader message="Sending OTP..." /> : "Send OTP"}
                    </button>
                </form>
            </div>
        </div>
    );
}