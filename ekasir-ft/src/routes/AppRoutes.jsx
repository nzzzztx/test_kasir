import { Route, Routes, Navigate } from "react-router-dom";
import ProtectRoute from "../components/ProtectRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RegisterPassword from "../pages/auth/RegisterPassword";
import ForgotPW from "../pages/auth/ForgotPw";
import PwNotif from "../pages/auth/PwNotif";
import ResetPw from "../pages/auth/ResetPw";
import ResetPwSucces from "../pages/auth/ResetPwSucces";

import Dashboard from "../pages/dashboard/Dashboard";
import Product from "../pages/dashboard/Product";
import Categories from "../pages/dashboard/Categories";
import Customers from "../pages/dashboard/Customers";
import Stock from "../pages/dashboard/Stock";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-password" element={<RegisterPassword />} />
            <Route path="/forgot-password" element={<ForgotPW />} />
            <Route path="/password-notification" element={<PwNotif />} />
            <Route path="/reset-password" element={<ResetPw />} />
            <Route path="/reset-succes" element={<ResetPwSucces />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectRoute>
                        <Dashboard />
                    </ProtectRoute>
                }
            />

            <Route
                path="/dashboard/product"
                element={<ProtectRoute><Product /></ProtectRoute>}
            />
            <Route
                path="/dashboard/categories"
                element={<ProtectRoute><Categories /></ProtectRoute>}
            />
            <Route
                path="/dashboard/customers"
                element={<ProtectRoute><Customers /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stock"
                element={<ProtectRoute><Stock /></ProtectRoute>}
            />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}
