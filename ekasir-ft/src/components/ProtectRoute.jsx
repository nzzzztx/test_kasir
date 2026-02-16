import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectRoute({ children, allowedRoles }) {
    const { authData } = useAuth();

    if (!authData?.token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(authData.role)) {
        return <Navigate to={`/${authData.role}/dashboard`} replace />;
    }

    return children;
}

