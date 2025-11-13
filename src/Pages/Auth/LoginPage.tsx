import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { LoginUserBody } from "../../Types/types";
import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { routePath } from "../../Routes/route";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";





export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState<LoginUserBody>({ email: "", password: "" });
    const [loginFailed, setLoginFailed] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (loginFailed) {
            setLoginFailed("");
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loginData.email && loginData.password) {
            setLoader(true);
            setLoginFailed("");
            const data = await authService.loginUser(loginData);
            setLoader(false);

            if (!data.error) {
                toast.success(data.message);
                localStorage.setItem('token', data.result.token);
                navigate(routePath.home, { replace: true });
            } else {
                setLoginFailed(data.message);
            }
        } else {
            setLoginFailed("Please fill all details...");
            toast.error("Please fill all details...")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back 👋</h2>
                    <p className="text-gray-500">Sign in to continue exploring stories & blogs</p>
                </div>

                <form className="space-y-6 mt-8" onSubmit={onSubmit}>

                    {/* --- Custom Alert for Login Failure --- */}
                    {loginFailed && <ErrorAlert message={loginFailed} />}

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-900"
                            >
                                {showPassword ? "🐵" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password */}
                    <div className="flex justify-end text-sm text-gray-600">
                        <Link to={routePath.forgotPassword} className="hover:text-gray-900 font-medium transition">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loader}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-transform transform hover:scale-[1.02] font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {/* --- Using the Custom Loader --- */}
                        {loader ? <ButtonLoader message="Signing in..." /> : "Sign In"}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Don’t have an account?{" "}
                        <Link to={routePath.register} className="text-gray-900 font-medium hover:underline">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}