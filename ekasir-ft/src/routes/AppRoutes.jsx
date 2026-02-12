import { Route, Routes, Navigate } from "react-router-dom";
import ProtectRoute from "../components/ProtectRoute";
import RoleRedirect from "../components/RoleRedirect";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import RegisterPassword from "../pages/auth/RegisterPassword";
import ForgotPW from "../pages/auth/ForgotPw";
import PwNotif from "../pages/auth/PwNotif";
import ResetPw from "../pages/auth/ResetPw";
import ResetPwSucces from "../pages/auth/ResetPwSucces";

import Dashboard from "../pages/dashboard/role/Dashboard";
import KasirDashboard from "../pages/dashboard/role/KasirDashboard";
import GudangDashboard from "../pages/dashboard/role/GudangDashboard";

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
import InformasiToko from "../components/Setting/InformasiToko";
import EDC from "../pages/dashboard/Edc";
import Manajemen from "../pages/dashboard/Manajemen";


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
                        <RoleRedirect />
                    </ProtectRoute>
                }
            />

            {/* ================= OWNER ================= */}
            <Route
                path="/owner/dashboard"
                element={
                    <ProtectRoute allowedRoles={["owner"]}>
                        <Dashboard />
                    </ProtectRoute>
                }
            />

            {/* ================= KASIR ================= */}
            <Route
                path="/kasir/dashboard"
                element={
                    <ProtectRoute allowedRoles={["kasir"]}>
                        <KasirDashboard />
                    </ProtectRoute>
                }
            />

            {/* ================= GUDANG ================= */}
            <Route
                path="/gudang/dashboard"
                element={
                    <ProtectRoute allowedRoles={["gudang"]}>
                        <GudangDashboard />
                    </ProtectRoute>
                }
            />

            <Route
                path="/dashboard/product"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Product /></ProtectRoute>}
            />
            <Route
                path="/dashboard/categories"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Categories /></ProtectRoute>}
            />
            <Route
                path="/dashboard/customers"
                element={<ProtectRoute allowedRoles={["owner", "kasir"]}><Customers /></ProtectRoute>}
            />
            <Route
                path="/dashboard/suppliers"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Suppliers /></ProtectRoute>}
            />
            <Route
                path="/dashboard/discount"
                element={<ProtectRoute allowedRoles={["owner"]}><Discount /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stock"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Stock /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stock/logistic"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Logistic /></ProtectRoute>}
            />
            <Route
                path="/dashboard/transaction"
                element={<ProtectRoute allowedRoles={["owner", "kasir"]}><Transaction /></ProtectRoute>}
            />
            <Route
                path="/dashboard/transaction/payment"
                element={<ProtectRoute allowedRoles={["owner", "kasir"]}><Payment /></ProtectRoute>}
            />
            <Route
                path="/dashboard/pembelian"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Pembelian /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan"
                element={<ProtectRoute allowedRoles={["owner"]}><Laporan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/pajak"
                element={<ProtectRoute allowedRoles={["owner"]}><Pajak /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-transaksi"
                element={<ProtectRoute allowedRoles={["owner"]}><LaporanTransaksi /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-pembelian"
                element={<ProtectRoute allowedRoles={["owner"]}><LaporanPembelian /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-ketersediaan"
                element={<ProtectRoute allowedRoles={["owner"]}><LaporanKetersediaan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/laporan/laporan-pelanggan"
                element={<ProtectRoute allowedRoles={["owner"]}><LaporanPelanggan /></ProtectRoute>}
            />
            <Route
                path="/dashboard/shift"
                element={<ProtectRoute allowedRoles={["owner", "kasir"]}><Shift /></ProtectRoute>}
            />
            <Route
                path="/dashboard/stok-opname"
                element={<ProtectRoute allowedRoles={["owner", "gudang"]}><Opname /></ProtectRoute>}
            />
            <Route
                path="/dashboard/akun"
                element={<ProtectRoute allowedRoles={["owner", "gudang", "kasir"]}><Akun /></ProtectRoute>}
            />
            <Route
                path="/dashboard/setting"
                element={<ProtectRoute allowedRoles={["owner"]}><Setting /></ProtectRoute>}
            />
            <Route
                path="/dashboard/setting/informasi-toko"
                element={<ProtectRoute allowedRoles={["owner"]}><InformasiToko /></ProtectRoute>}
            />
            <Route
                path="/dashboard/setting/edc"
                element={<ProtectRoute allowedRoles={["owner"]}><EDC /></ProtectRoute>}
            />
            <Route
                path="/dashboard/setting/manajemen-user"
                element={<ProtectRoute allowedRoles={["owner"]}><Manajemen /></ProtectRoute>}
            />

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}
