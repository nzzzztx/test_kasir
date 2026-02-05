import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(() => {
        const saved = localStorage.getItem("auth");
        return saved
            ? JSON.parse(saved)
            : {
                name: "",
                email: "",
                password: "",
                phone: "",
                role: "Kasir",
                otpVerified: false,
                isLoggedIn: false,
            };
    });

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(authData));
    }, [authData]);

    const register = (data) => {
        setAuthData({
            name: data.name || "Kasir",
            role: "Kasir",
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
            name: "",
            email: "",
            password: "",
            phone: "",
            role: "Kasir",
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
