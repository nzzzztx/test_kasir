import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectRoute({ children, allowedRoles }) {
    const { authData } = useAuth();

    // Belum login
    if (!authData || !authData.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Role tidak sesuai
    if (allowedRoles && !allowedRoles.includes(authData.role)) {
        // Redirect sesuai role masing-masing
        if (authData.role === "owner") {
            return <Navigate to="/owner/dashboard" replace />;
        }

        if (authData.role === "kasir") {
            return <Navigate to="/kasir/dashboard" replace />;
        }

        if (authData.role === "gudang") {
            return <Navigate to="/gudang/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}
