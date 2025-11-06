import { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { RegisterUserBody } from "../../Types/types";
import toast from "react-hot-toast";
import { authService } from "../../Services/AuthService";
import { ButtonLoader } from "./LoginPage";

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterUserBody>({ name: "", email: "", password: "", gender: "", about: "", profile_image: null });
    const [showPassword, setShowPassword] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, ["profile"]: profileImage }));
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (preview != null && profileImage != null && formData.name && formData.email && formData.password && formData.gender && formData.about) {
            console.log(formData);
            setLoader(true);
            const data = await authService.registerUser(formData);

            if (!data.error) {
                toast.success(data.message);
                navigate('/login', { replace: true });
            } else {
                toast.error(data.message);
            }
            setLoader(false);

        } else {
            toast.error("Please fill all details...")
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-6">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        Create Your Account
                    </h2>
                    <p className="text-gray-500">Join writers and creators around the world ✍️</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden border-4 border-gray-300 shadow-md">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 text-3xl">
                                        📷
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <span className="text-xs">✏️</span>
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">Upload your profile picture</p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(event) => handleChange(event)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(event) => handleChange(event)}
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
                                value={formData.password}
                                onChange={(event) => handleChange(event)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-900"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Gender</label>
                        <div className="flex gap-6">
                            {["Male", "Female", "Other"].map((g) => (
                                <label key={g} className="flex items-center gap-2 text-gray-700">
                                    <input
                                        type="radio"
                                        name="gender"
                                        onChange={(event) => handleChange(event)}
                                        value={g}
                                        className="accent-gray-900"
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">About You</label>
                        <textarea
                            rows={3}
                            name="about"
                            value={formData.about}
                            onChange={(event) => handleChange(event)}
                            placeholder="Tell us something about yourself..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition resize-none"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loader}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-transform transform hover:scale-[1.02] font-semibold shadow-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {/* --- Using the Custom Loader --- */}
                        {loader ? <ButtonLoader message="Sign up..." /> : "Sign Up"}
                    </button>


                    <p className="text-center text-gray-600 text-sm mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-gray-900 font-medium hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
