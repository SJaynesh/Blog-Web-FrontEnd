import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import HomePage from "../Pages/Home/HomePage";
import ForgotPasswordPage from "../Pages/Auth/ForgotPage";
import OTPVerifyPage from "../Pages/Auth/OTPVerifyPage";
import ChangePasswordPage from "../Pages/Auth/ChangePasswordPage";
import AddBlogPage from "../Pages/Blog/AddBlogPage";
import BlogDetailPage from "../Pages/Blog/BlogDetailPage";

export const routePath = {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot_password',
    otpVerify: '/otp-verify',
    changePassword: '/change_password',
    home: '/home',
    addBlog: '/add-blog',
    blogDetail: '/blog/:blogId'
}

export const route = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                path: routePath.login,
                Component: LoginPage,
            },
            {
                path: routePath.register,
                Component: RegisterPage
            },
            {
                path: routePath.forgotPassword,
                Component: ForgotPasswordPage
            },
            {
                path: routePath.otpVerify,
                Component: OTPVerifyPage
            },

            {
                path: routePath.changePassword,
                Component: ChangePasswordPage
            },
            {
                path: routePath.home,
                Component: HomePage
            },
            {
                path: routePath.addBlog,
                Component: AddBlogPage
            },
            {
                path: routePath.blogDetail,
                Component: BlogDetailPage,
            }
        ]
    }
])