import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ButtonLoader } from "../../Components/ButtonLoader";
import { ErrorAlert } from "../../Components/ErrorAlert";
import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import type { ChangePasswordPayload } from "../../Types/types";
import { routePath } from "../../Routes/route";

export default function ChangePasswordPage() {
    const [email, setEmail] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showPassword2, setShowPassword2] = useState<boolean>(false);

    const location = useLocation();

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loader, setLoader] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state.email) {
            return;
        }

        setEmail(location.state.email);
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Your logic here...

        if (!formData.newPassword || !formData.confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New and Conform password has not matched...")
            return;
        }

        try {
            setLoader(true);
            const payload: ChangePasswordPayload = {
                email: email,
                newPassword: formData.newPassword
            }
            const data = await authService.changePassword(payload);

            if (!data.error) {
                toast.success(data.message);
                setError("");
                navigate(routePath.login, { replace: true });
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.log("Change Password Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }

        setLoader(false);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
            <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10 space-y-8 border border-gray-100">

                {/* --- Header --- */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        Change Password 🔐
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Update your password to keep your account secure.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
                    {/* Error Alert */}
                    {error && <ErrorAlert message={error} />}

                    {/* New Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                onChange={handleChange}
                                value={formData.newPassword}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-gray-900 focus:border-gray-900
                           outline-none transition shadow-sm"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
                            >
                                {showPassword ? "🐵" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Conform Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword2 ? "text" : "password"}
                                name="confirmPassword"
                                onChange={handleChange}
                                value={formData.confirmPassword}
                                placeholder="Enter conform password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl
                           focus:ring-2 focus:ring-gray-900 focus:border-gray-900
                           outline-none transition shadow-sm"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword2(!showPassword2)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
                            >
                                {showPassword2 ? "🐵" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loader}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl
                       hover:bg-gray-800 transition-transform transform hover:scale-[1.02]
                       font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loader ? <ButtonLoader message="Updating..." /> : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
