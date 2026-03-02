import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../assets/css/dashboard.css";
import "../../assets/css/stock.css";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import EditStockModal from "../../components/Stock/EditStockModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/user1.png";
import searchIcon from "../../assets/icons/search.png";
import editIcon from "../../assets/icons/edit.png";
import logIcon from "../../assets/icons/log.png";
import productImg from "../../assets/img/product.png";

const Stock = () => {
    const { authData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const PAGE_SIZE = 10;
    const [page, setPage] = useState(1);
    const { unreadCount } = useNotifications();
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const filtered = stocks.filter((item) =>
        (item.name || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const paginatedData = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleExport = () => {
        const exportData = filtered.map((item) => ({
            "Nama Barang": item.name,
            "Kode": item.code,
            "Kategori": item.category,
            "Stok": item.stock,
            "Harga Jual": item.sellPrice,
            "Harga Dasar": item.basePrice,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Stok Barang");

        XLSX.writeFile(workbook, "stok-barang.xlsx");
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const json = XLSX.utils.sheet_to_json(worksheet);

            const imported = json.map((row, index) => ({
                id: Date.now() + index,
                name: row["Nama Barang"] || "",
                code: String(row["Kode"] || ""),
                category: row["Kategori"] || "",
                stock: Number(row["Stok"] || 0),
                sellPrice: Number(row["Harga Jual"] || 0),
                basePrice: Number(row["Harga Dasar"] || 0),
                image: productImg,
            }));

            setStocks((prev) => {
                const map = new Map(prev.map((p) => [p.code, p]));
                imported.forEach((i) => map.set(i.code, i));
                return Array.from(map.values());
            });
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        if (!authData?.token) return;

        const fetchStock = async () => {
            try {
                const res = await api.get("/stock");
                setStocks(res.data);
            } catch (err) {
                console.error("Gagal ambil stock:", err);
            }
        };

        fetchStock();
    }, [authData?.token]);

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

    useEffect(() => {
        if (!authData?.token) return;

        const handleStockUpdate = async () => {
            try {
                const res = await api.get("/stock");
                setStocks(res.data);
            } catch (err) {
                console.error("Gagal refresh stock:", err);
            }
        };

        window.addEventListener("stockUpdated", handleStockUpdate);

        return () => {
            window.removeEventListener("stockUpdated", handleStockUpdate);
        };
    }, [authData?.token]);

    if (!user) {
        return (
            <div className="dashboard-container">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="main-content">
                    <div style={{ padding: "24px" }}>Loading profile...</div>
                </div>
            </div>
        );
    }

    // console.log("authData:", authData);
    // console.log("ownerId:", authData?.ownerId);
    // console.log("id:", authData?.id);

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
                        <h1>Stok Barang</h1>
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
                    <div className="stock-toolbar">
                        <div className="stock-actions">
                            <button className="btn-primary" onClick={handleExport}>
                                Export Data
                            </button>

                            <label className="btn-outline" style={{ cursor: "pointer" }}>
                                Import Data
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    hidden
                                    onChange={handleImport}
                                />
                            </label>
                        </div>

                        <div className="stock-search">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari barang..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="stock-table-wrapper">
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Nama Barang</th>
                                    <th>Kode</th>
                                    <th>Kategori</th>
                                    <th>Stok</th>
                                    <th>Harga Jual (Rp)</th>
                                    <th>Harga Dasar (Rp)</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="stock-name">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                            />
                                            {item.name}
                                        </td>
                                        <td>{item.code}</td>
                                        <td>{item.category}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            {Number(item.sellPrice ?? item.price_max ?? 0).toLocaleString("id-ID")}
                                        </td>
                                        <td>
                                            {Number(item.basePrice ?? item.price_min ?? 0).toLocaleString("id-ID")}
                                        </td>
                                        <td>
                                            <div className="stock-actions-btn">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        setSelectedStock(item);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <img src={editIcon} alt="edit" />
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn-log"
                                                    onClick={() =>
                                                        navigate("/dashboard/stock/logistic", {
                                                            state: {
                                                                productId: item.id,
                                                                name: item.name,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <img src={logIcon} alt="log" />
                                                    Log
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="stock-footer">
                        <span>
                            Ditampilkan {(page - 1) * PAGE_SIZE + 1} -{" "}
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
                <EditStockModal
                    open={editOpen}
                    stock={selectedStock}
                    onClose={() => setEditOpen(false)}
                    onSubmit={async (data) => {
                        try {
                            await api.post("/stock/add", {
                                product_id: data.id,
                                qty: data.qty,
                                base_price: data.basePrice,
                                note: "Manajemen Stok Barang",
                            });

                            const res = await api.get("/stock");
                            setStocks(res.data);

                            setEditOpen(false);
                        } catch (err) {
                            console.error("Gagal update stock:", err);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Stock;
