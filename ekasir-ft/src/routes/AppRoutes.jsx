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
import Suppliers from "../pages/dashboard/Suppliers";
import Discount from "../pages/dashboard/Discount";
import Stock from "../pages/dashboard/Stock";
import Pembelian from "../pages/dashboard/Pembelian";
import Logistic from "../pages/dashboard/Logistic";
import Payment from "../pages/dashboard/Payment";
import Laporan from "../pages/dashboard/Laporan";
import Pajak from "../pages/dashboard/Pajak";
import Shift from "../pages/dashboard/Shift";
import Opname from "../pages/dashboard/Opname";
import Transaction from "../pages/dashboard/Transaction";
import Akun from "../pages/dashboard/Akun";
import Setting from "../pages/dashboard/Setting";

import LaporanTransaksi from "../components/Laporan/LaporanTransaksi";
import LaporanPembelian from "../components/Laporan/LaporanPembelian";
import LaporanKetersediaan from "../components/Laporan/LaporanKetersediaan";
import LaporanPelanggan from "../components/Laporan/LaporanPelanggan";


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
                path="/dashboard/suppliers"
                element={<ProtectRoute><Suppliers /></ProtectRoute>}
            />
            <Route
                path="/dashboard/discount"
                element={<ProtectRoute><Discount /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stock"
                element={<ProtectRoute><Stock /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stock/logistic"
                element={<ProtectRoute><Logistic /></ProtectRoute>}
            />
            <Route
                path="/dashboard/transaction"
                element={<ProtectRoute><Transaction /></ProtectRoute>}
            />
            <Route
                path="/dashboard/transaction/payment"
                element={<ProtectRoute><Payment /></ProtectRoute>}
            />
            <Route
                path="/dashboard/pembelian"
                element={<ProtectRoute><Pembelian /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan"
                element={<ProtectRoute><Laporan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/pajak"
                element={<ProtectRoute><Pajak /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-transaksi"
                element={<ProtectRoute><LaporanTransaksi /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-pembelian"
                element={<ProtectRoute><LaporanPembelian /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-ketersediaan"
                element={<ProtectRoute><LaporanKetersediaan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-pelanggan"
                element={<ProtectRoute><LaporanPelanggan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/shift"
                element={<ProtectRoute><Shift /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stok-opname"
                element={<ProtectRoute><Opname /></ProtectRoute>}
            />
            <Route
                path="/dashboard/akun"
                element={<ProtectRoute><Akun /></ProtectRoute>}
            />
            <Route
                path="/dashboard/setting"
                element={<ProtectRoute><Setting /></ProtectRoute>}
            />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}
