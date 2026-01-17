import { createContext, use, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        email: "",
        password: "",
        otpVerified: false
    });

    const register = (data) => {
        setAuthData({
            email: data.email,
            phone: data.phone,
            otpVerified: false
        });
    }

    const verifyOtp = () => {
        setAuthData((prev) => ({
            ...prev,
            otpVerified: true
        }));
    }

    return (
        <AuthContext.Provider value={{ authData, register, verifyOtp }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);