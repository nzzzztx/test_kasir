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

    const changePassword = (oldPassword, newPassword) => {
        if (!authData.isLoggedIn) {
            return { success: false, message: "Belum login" };
        }

        if (authData.password !== oldPassword) {
            return { success: false, message: "Password lama salah" };
        }

        if (newPassword.length < 8) {
            return { success: false, message: "Password minimal 8 karakter" };
        }

        setAuthData((prev) => ({
            ...prev,
            password: newPassword,
        }));

        return { success: true };
    };

    return (
        <AuthContext.Provider
            value={{ authData, register, verifyOtp, login, logout, changePassword, }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
