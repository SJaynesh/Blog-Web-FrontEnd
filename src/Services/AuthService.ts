import axios from "axios";
import type { LoginUserBody } from "../Types/types";


class AuthService {
    authBaseURL = "https://apiblog-omega.vercel.app/api";
    authLogin = "/auth/login";
    authRegister = "/auth/register";

    getAuthToken() {
        return localStorage.getItem('token');
    }

    async loginUser(body: LoginUserBody) {
        try {
            const res = await axios.post(this.authBaseURL + this.authLogin, body);

            console.log(res.data);

            return res.data;
        } catch (error) {
            console.log("Login Error : ", error);
        }
    }
}

export const authService = new AuthService();