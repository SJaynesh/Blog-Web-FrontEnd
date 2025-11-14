import axios from "axios";
import type { ChangePasswordPayload, LoginUserBody, OTPVerifyPayLoad, RegisterUserBody } from "../Types/types";
import toast from "react-hot-toast";



class AuthService {
    authBaseURL = "https://blog-web-app-sandy.vercel.app/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";
    authForgotPasswor = "/auth/forgot_password"
    authOTPVerify = "/auth/verify_otp"
    authChangePassword = "/auth/change_password"

    getAuthToken() {
        return localStorage.getItem('token');
    }

    async loginUser(payload: LoginUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authLogin, payload);

            return res.data;
        } catch (error) {
            console.log("Login Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async registerUser(payload: RegisterUserBody) {
        try {
            const formData = new FormData();

            formData.append('name', payload.name);
            formData.append('email', payload.email);
            formData.append('password', payload.password);
            formData.append('gender', payload.gender);
            formData.append('about', payload.about);
            if (payload.profile_image != null) {
                formData.append('profile_image', payload.profile_image);
            }

            const res = await axios.post(this.authBaseURL + this.authRegister, formData);

            return res.data;

        } catch (error) {
            console.log("Register Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async forgotPassword(payload: any) {
        try {
            const res = await axios.post(this.authBaseURL + this.authForgotPasswor, payload);

            return res.data;
        } catch (error) {
            console.log("Forgot Password Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async OTPVerify(payload: OTPVerifyPayLoad) {
        try {
            const res = await axios.post(this.authBaseURL + this.authOTPVerify, payload);

            return res.data;
        } catch (error) {
            console.log("OTP Verify Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }

    async changePassword(payload: ChangePasswordPayload) {
        try {
            const res = await axios.post(this.authBaseURL + this.authChangePassword, payload);

            return res.data;
        } catch (error) {
            console.log("Change Password Error : ", error);
            toast.error("Something went wrong. Please try again..");
        }
    }
}

export const authService = new AuthService();