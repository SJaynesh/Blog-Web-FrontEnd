import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import HomePage from "../Pages/Home/HomePage";

export const route = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                path: '/login',
                Component: LoginPage,
            },
            {
                path: '/register',
                Component: RegisterPage
            },
            {
                path: '/home',
                Component: HomePage
            }
        ]
    }
])