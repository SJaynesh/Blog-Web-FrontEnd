import axios from "axios";
import type { LoginUserBody, RegisterUserBody } from "../Types/types";


class AuthService {
    authBaseURL = "https://apiblog-omega.vercel.app/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";

    getAuthToken() {
        return localStorage.getItem('token');
    }

    async loginUser(payload: LoginUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authLogin, payload);

            console.log(res.data);

            return res.data;
        } catch (error) {
            console.log("Login Error : ", error);
        }
    }

    async registerUser(payload: RegisterUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authRegister, payload);

            console.log(res.data);

            return res.data;

        } catch (error) {
            console.log("Register Error : ", error);
        }
    }
}

export const authService = new AuthService();