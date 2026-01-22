import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(() => {
        const saved = localStorage.getItem("auth");
        return saved
            ? JSON.parse(saved)
            : {
                email: "",
                password: "",
                phone: "",
                otpVerified: false,
                isLoggedIn: false,
            };
    });

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(authData));
    }, [authData]);

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
        localStorage.removeItem("auth");
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
