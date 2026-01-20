import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectRoute({ children }) {
    const isLogin = localStorage.getItem("token");
    // nanti token dari backend
    console.log(isLogin)
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
