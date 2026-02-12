import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    // ===============================
    // USER LOGIN
    // ===============================
    const [authData, setAuthData] = useState(() => {
        const saved = localStorage.getItem("auth");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (authData) {
            localStorage.setItem("auth", JSON.stringify(authData));
        } else {
            localStorage.removeItem("auth");
        }
    }, [authData]);

    // ===============================
    // PENDING USER (SEBELUM OTP + PASSWORD)
    // ===============================
    const [pendingUser, setPendingUser] = useState(null);

    // ===============================
    // STEP 1 - REGISTER (KIRIM OTP)
    // ===============================
    const register = ({ name, email, phone }) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const emailExist = users.find(u => u.email === email);
        if (emailExist) {
            return { success: false, message: "Email sudah terdaftar" };
        }

        const tempUser = {
            id: Date.now(),
            name: name || "Owner",
            email,
            username: email,
            phone,
            role: "owner",
            otpVerified: false
        };

        setPendingUser(tempUser);

        return { success: true };
    };

    // ===============================
    // STEP 2 - VERIFY OTP
    // ===============================
    const verifyOtp = (otpInput) => {
        if (!pendingUser) {
            return { success: false, message: "Tidak ada proses registrasi" };
        }

        if (otpInput !== "1234") {
            return { success: false, message: "OTP salah" };
        }

        setPendingUser(prev => ({
            ...prev,
            otpVerified: true
        }));

        return { success: true };
    };

    // ===============================
    // STEP 3 - SET PASSWORD & SIMPAN USER
    // ===============================
    const setPasswordAfterOtp = (password) => {
        if (!pendingUser || !pendingUser.otpVerified) {
            return { success: false, message: "OTP belum diverifikasi" };
        }

        if (password.length < 8) {
            return { success: false, message: "Password minimal 8 karakter" };
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const newUser = {
            ...pendingUser,
            password,
            otpVerified: true
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        setAuthData({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            otpVerified: true,
            isLoggedIn: true
        });

        setPendingUser(null);

        return { success: true };
    };

    // ===============================
    // LOGIN
    // ===============================
    const login = (identifier, password) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            (u) =>
                (u.email === identifier || u.username === identifier) &&
                u.password === password
        );

        if (!user) {
            return { success: false, message: "Email atau password salah" };
        }

        setAuthData({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            otpVerified: user.otpVerified,
            isLoggedIn: true
        });

        return { success: true, user };
    };

    const logout = () => {
        setAuthData(null);
    };

    // ===============================
    // CHANGE PASSWORD
    // ===============================
    const changePassword = (oldPassword, newPassword) => {
        if (!authData || !authData.isLoggedIn) {
            return { success: false, message: "Belum login" };
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.id === authData.id);

        if (userIndex === -1) {
            return { success: false, message: "User tidak ditemukan" };
        }

        if (users[userIndex].password !== oldPassword) {
            return { success: false, message: "Password lama salah" };
        }

        if (newPassword.length < 8) {
            return { success: false, message: "Password minimal 8 karakter" };
        }

        users[userIndex].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        return { success: true };
    };

    return (
        <AuthContext.Provider
            value={{
                authData,
                pendingUser,
                register,
                verifyOtp,
                setPasswordAfterOtp,
                login,
                logout,
                changePassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
