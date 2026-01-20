import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        email: "",
        password: "",
        phone: "",
        otpVerified: false,
        isLoggedIn: false,
    });

    const register = (data) => {
        setAuthData({
            email: data.email,
            phone: data.phone,
            password: "",
            otpVerified: false,
            isLoggedIn: false,
        });
    };

    const verifyOtp = () => {
        setAuthData((prev) => ({
            ...prev,
            otpVerified: true,
        }));
    };

    const login = (email, password) => {
        // simulasi login (nanti bisa diganti API)
        if (email && password) {
            setAuthData((prev) => ({
                ...prev,
                email,
                password,
                isLoggedIn: true,
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setAuthData({
            email: "",
            password: "",
            phone: "",
            otpVerified: false,
            isLoggedIn: false,
        });
    };

    return (
        <AuthContext.Provider
            value={{ authData, register, verifyOtp, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
