import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import "../../assets/css/dashboard.css";
import "../../assets/css/stock.css";

import Sidebar from "../../components/Sidebar";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/profile.png";
import searchIcon from "../../assets/icons/search.png";

const PAGE_SIZE = 10;

const Logistics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [range, setRange] = useState("30");
    const [page, setPage] = useState(1);
    const location = useLocation();
    const { unreadCount } = useNotifications();
    const { authData } = useAuth();
    const [user, setUser] = useState(null);

    const selectedProductId = location.state?.productId || null;
    const selectedName = location.state?.name || null;

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchLogs = async () => {
            try {
                const res = await api.get("/stock/logs");
                setLogs(res.data);
            } catch (err) {
                console.error("Gagal ambil stock logs:", err);
            }
        };

        fetchLogs();
    }, [authData?.token]);

    const isInRange = (date) => {
        const now = new Date();
        const d = new Date(date);

        if (range === "7") {
            const from = new Date();
            from.setDate(from.getDate() - 7);
            return d >= from;
        }

        if (range === "30") {
            const from = new Date();
            from.setDate(from.getDate() - 30);
            return d >= from;
        }

        if (range === "this_month") {
            return (
                d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()
            );
        }

        return true;
    };

    const filtered = logs.filter((l) => {

        if (!selectedProductId) return false;

        const matchProduct =
            String(l.product_id) === String(selectedProductId);

        const matchSearch =
            (l.note || "").toLowerCase().includes(search.toLowerCase()) ||
            String(l.created_by || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchDate = isInRange(l.created_at);

        return matchProduct && matchSearch && matchDate;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const paginated = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(filtered);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Logistik");
        XLSX.writeFile(workbook, "logistik-barang.xlsx");
    };

    useEffect(() => {
        if (!authData?.token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (err) {
                console.error("Gagal ambil profile:", err);
            }
        };

        fetchProfile();
    }, [authData?.token]);

    if (!user) {
        return (
            <div className="dashboard-container">
                <Sidebar
                    isOpen={sidebarOpen}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                />
                <div className="main-content">
                    <div style={{ padding: 24 }}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="toggle" />
                        </button>
                        <h1>Logistik Barang</h1>
                    </div>

                    <div className="header-right">
                        <div className="notif">
                            <div className="notif-icon-wrapper">
                                <img src={notificationIcon} alt="notif" />

                                {unreadCount > 0 && (
                                    <span className="notif-badge">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span>Notifikasi ({unreadCount})</span>
                        </div>
                        <div className="profile-box">
                            <img src={user?.avatar || userDummy} alt="profile" />
                        </div>
                    </div>
                </header>

                <div className="stock-page">
                    {selectedName && (
                        <div style={{ marginBottom: 12, fontWeight: 600 }}>
                            Log Stok: {selectedName}
                        </div>
                    )}

                    <div className="stock-toolbar">
                        <div className="stock-actions">
                            <select
                                value={range}
                                onChange={(e) => {
                                    setRange(e.target.value);
                                    setPage(1);
                                }}
                                className="btn-outline"
                            >
                                <option value="7">7 Hari Terakhir</option>
                                <option value="30">30 Hari Terakhir</option>
                                <option value="this_month">Bulan Ini</option>
                            </select>

                            <button className="btn-primary" onClick={handleExport}>
                                Export Data
                            </button>
                        </div>

                        <div className="stock-search">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari email / aktivitas..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="stock-table-wrapper">
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Masuk</th>
                                    <th>Keluar</th>
                                    <th>Stok</th>
                                    <th>Harga Dasar</th>
                                    <th>Harga Jual</th>
                                    <th>Email</th>
                                    <th>Mode</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                                            Tidak ada data log
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((item) => (
                                        <tr key={item.id}>
                                            <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                            <td>{item.type === "in" ? item.qty : 0}</td>
                                            <td>{item.type === "out" ? item.qty : 0}</td>
                                            <td>{item.stock_after}</td>
                                            <td>{Number(item.base_price).toLocaleString("id-ID")}</td>
                                            <td>{Number(item.sell_price).toLocaleString("id-ID")}</td>
                                            <td>
                                                <div>
                                                    <strong>{item.email || "-"}</strong>
                                                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                                                        {item.role}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                {item.type === "in" ? "Stok Masuk" : "Stok Keluar"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="stock-footer">
                        <span>
                            Ditampilkan {(page - 1) * PAGE_SIZE + 1} –{" "}
                            {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
                            {filtered.length} data
                        </span>

                        <div className="pagination">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? "active" : ""}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logistics;
