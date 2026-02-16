import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
    const { authData } = useAuth();

    // Cek berdasarkan token, bukan isLoggedIn
    if (!authData?.token) {
        return <Navigate to="/login" replace />;
    }

    switch (authData.role) {
        case "owner":
            return <Navigate to="/owner/dashboard" replace />;
        case "kasir":
            return <Navigate to="/kasir/dashboard" replace />;
        case "gudang":
            return <Navigate to="/gudang/dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
}
