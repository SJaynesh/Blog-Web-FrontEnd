import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";
import { authService } from "./Services/AuthService";

export default function App() {
    const navigate = useNavigate();
    useEffect(() => {
        if (authService.getAuthToken()) {
            navigate('/home', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [])
    return (
        <div className="h-screen w-full flex flex-col">
            <main className="flex-grow flex justify-center items-center">
                <Outlet />
                <Toaster position="top-right"
                    reverseOrder={false} />
            </main>
        </div>
    );
}