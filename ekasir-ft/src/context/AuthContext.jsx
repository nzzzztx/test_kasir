import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {

    /*
    ===============================
    RESTORE AUTH DARI LOCALSTORAGE
    ===============================
    */
    const [authData, setAuthData] = useState(() => {
        const saved = localStorage.getItem("auth");
        return saved ? JSON.parse(saved) : null;
    });

    const [pendingUser, setPendingUser] = useState(null);


    /*
    ===============================
    SET TOKEN KE AXIOS
    ===============================
    */
    useEffect(() => {

        if (authData?.token) {

            axios.defaults.headers.common["Authorization"] =
                `Bearer ${authData.token}`;

            localStorage.setItem("auth", JSON.stringify(authData));

        } else {

            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("auth");

        }

    }, [authData]);


    /*
    ===============================
    AUTO LOGOUT JIKA TOKEN EXPIRED
    ===============================
    */
    useEffect(() => {

        const interceptor = axios.interceptors.response.use(
            (res) => res,
            (err) => {

                if (err.response?.status === 401) {

                    setAuthData(null);
                    localStorage.removeItem("auth");

                    window.location.href = "/login";

                }

                return Promise.reject(err);

            }
        );

        return () => axios.interceptors.response.eject(interceptor);

    }, []);


    /*
    ===============================
    REGISTER OWNER
    ===============================
    */
    const register = async ({ email, phone }) => {

        try {

            const res = await axios.post(`${API}/register-owner`, {
                email,
                phone
            });

            if (res.data.success) {
                setPendingUser({ email, phone });
            }

            return res.data;

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "Register gagal",
            };

        }

    };


    /*
    ===============================
    VERIFY OTP
    ===============================
    */
    const verifyOtp = async ({ email, otp }) => {

        try {

            const res = await axios.post(`${API}/verify-otp`, {
                email,
                otp,
            });

            return res.data;

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "OTP salah",
            };

        }

    };


    /*
    ===============================
    SET PASSWORD + LICENSE
    ===============================
    */
    /*
===============================
SET PASSWORD (LICENSE AUTO)
===============================
*/
    const setPasswordAfterOtp = async ({ password }) => {

        try {

            if (!pendingUser?.email) {

                return {
                    success: false,
                    message: "Session OTP tidak ditemukan",
                };

            }

            const res = await axios.post(`${API}/set-password`, {
                email: pendingUser.email,
                password
            });

            if (res.data.success) {
                setPendingUser(null);
            }

            return res.data;

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "Gagal set password",
            };

        }

    };


    /*
    ===============================
    LOGIN
    ===============================
    */
    const login = async (identifier, password) => {

        try {

            const res = await axios.post(`${API}/login`, {
                identifier,
                password,
            });

            const { token, user } = res.data;

            const finalAuth = {
                token,
                id: user.id,
                nama: user.nama,
                role: user.role,
                ownerId: user.ownerId || user.owner_id,
                isLoggedIn: true
            };

            setAuthData(finalAuth);

            return { success: true };

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "Login gagal",
            };

        }

    };


    /*
    ===============================
    LOGOUT
    ===============================
    */
    const logout = () => {

        setAuthData(null);
        localStorage.removeItem("auth");

        window.location.href = "/login";

    };


    /*
    ===============================
    FORGOT PASSWORD
    ===============================
    */
    const forgotPassword = async (email) => {

        try {

            const res = await axios.post(`${API}/forgot-password`, { email });

            return res.data;

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "Gagal kirim OTP",
            };

        }

    };


    /*
    ===============================
    RESET PASSWORD
    ===============================
    */
    const resetPassword = async ({ email, otp, newPassword }) => {

        try {

            const res = await axios.post(`${API}/reset-password`, {
                email,
                otp,
                newPassword,
            });

            return res.data;

        } catch (err) {

            return {
                success: false,
                message: err.response?.data?.message || "Reset gagal",
            };

        }

    };


    return (
        <AuthContext.Provider
            value={{
                authData,
                pendingUser,
                login,
                logout,
                register,
                verifyOtp,
                setPasswordAfterOtp,
                forgotPassword,
                resetPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);