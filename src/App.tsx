import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";
import { authService } from "./Services/AuthService";
import { routePath } from "./Routes/route";

export default function App() {
    const navigate = useNavigate();
    useEffect(() => {
        if (authService.getAuthToken()) {
            navigate(routePath.home, { replace: true });
        } else {
            navigate(routePath.login, { replace: true });
        }
    }, [])
    return (
        <div className="w-screen h-screen flex flex-col">
            <main className="flex-1 w-full h-full">
                <Outlet />
                <Toaster position="top-right" reverseOrder={false} />
            </main>
        </div>

    );
}