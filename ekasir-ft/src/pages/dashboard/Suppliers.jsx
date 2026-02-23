import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../../assets/css/suppliers.css";
import "../../assets/css/dashboard.css";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/Sidebar";
import AddSupplierModal from "../../components/Suppliers/AddSupplierModal";
import EditSupplierModal from "../../components/Suppliers/EditSupplierModal";
import DeleteSupplierModal from "../../components/Suppliers/DeleteSupplierModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/user1.png";
import searchIcon from "../../assets/icons/search.png";

const Suppliers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [user, setUser] = useState(null);
    const { authData } = useAuth();

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        if (!authData?.token) return;
        fetchSuppliers();
    }, [authData?.token]);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/suppliers",
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (!res.ok) {
                const error = await res.json();
                console.error("Supplier error:", error);
                setSuppliers([]);
                return;
            }

            const data = await res.json();
            setSuppliers(data);

        } catch (err) {
            console.error("Gagal ambil suppliers:", err);
        }
    };

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    useEffect(() => {
        setSelectedSupplier(null);
        setSearch("");
        setPage(1);
    }, [authData?.token]);

    const filtered = suppliers.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase())
    );

    const ITEMS_PER_PAGE = 15;
    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

    const paginatedData = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleExport = () => {
        if (!suppliers.length) {
            alert("Tidak ada data untuk diexport");
            return;
        }

        const cleanData = suppliers.map(s => ({
            Nama: s.name,
            Alamat: s.address,
            Email: s.email,
            Telepon: s.phone,
            Kode: s.code,
        }));

        const worksheet = XLSX.utils.json_to_sheet(cleanData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");

        XLSX.writeFile(workbook, `suppliers_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            try {
                for (const row of rows) {
                    const res = await fetch("http://localhost:5000/api/suppliers", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authData.token}`,
                        },
                        body: JSON.stringify({
                            name: row.Nama || row.name,
                            address: row.Alamat || row.address,
                            email: row.Email || row.email,
                            phone: row.Telepon || row.phone,
                        }),
                    });

                    if (!res.ok) {
                        const error = await res.json();
                        console.error("Import error:", error);
                    }
                }

                await fetchSuppliers();
                alert("Import selesai");
                e.target.value = "";

            } catch (err) {
                console.error(err);
                alert("Gagal import data");
            }

        };

        reader.readAsArrayBuffer(file);
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
                <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="main-content">
                    <div style={{ padding: "24px" }}>Loading profile...</div>
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
                        <h1>Data Supplier</h1>
                    </div>

                    <div className="header-right">
                        <div
                            className="notif"
                            onClick={() => {
                                setNotificationOpen(!notificationOpen);
                                markAllAsRead();
                            }}
                        >
                            <div className="notif-icon-wrapper">
                                <img src={notificationIcon} alt="notif" />

                                {unreadCount > 0 && (
                                    <span className="notif-badge">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span>Notifikasi</span>

                            {notificationOpen && (
                                <div className="notif-dropdown">
                                    <div className="notif-header">
                                        <span>Notifikasi ({unreadCount})</span>
                                    </div>

                                    <div className={`notif-body ${notifications.length === 0 ? "empty" : ""}`}>
                                        {notifications.length === 0 ? (
                                            <>
                                                <div className="notif-icon">
                                                    <img
                                                        src={notificationIcon}
                                                        alt="no notification"
                                                        className="notif-icon-img"
                                                    />
                                                </div>
                                                <p className="notif-title">Tidak Ada Notifikasi</p>
                                                <p className="notif-desc">
                                                    Informasi terkait layanan darurat akan muncul disini.
                                                </p>
                                            </>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                                                    <strong>{n.title}</strong>
                                                    <p>{n.message}</p>
                                                    <small>
                                                        {new Date(n.createdAt).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </small>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div
                                        className="notif-footer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setNotificationOpen(false);
                                        }}
                                    >
                                        Tutup
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="profile-box">
                            <img src={user?.avatar || userDummy} alt="profile" />
                        </div>
                    </div>
                </header>

                <div className="suppliers-page">
                    <div className="suppliers-toolbar">
                        <div className="suppliers-actions">
                            <button className="btn-primary" onClick={() => setOpenModal(true)}>
                                + Tambah Supplier
                            </button>
                            <button className="btn-outline" onClick={handleExport}>
                                Export Data
                            </button>

                            <input
                                type="file"
                                accept=".xlsx"
                                id="importSuppliers"
                                style={{ display: "none" }}
                                onChange={handleImport}
                            />

                            <button
                                className="btn-outline"
                                onClick={() =>
                                    document.getElementById("importSuppliers").click()
                                }
                            >
                                Import Data
                            </button>
                        </div>

                        <div className="suppliers-search-right">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari supplier..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <div className="suppliers-table-wrapper">
                        <table className="suppliers-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Alamat</th>
                                    <th>Email</th>
                                    <th>No Telepon</th>
                                    <th>Kode</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td className="address">{item.address}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.code}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        setSelectedSupplier(item);
                                                        setEditModalOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => {
                                                        setSelectedSupplier(item);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="suppliers-footer">
                        <span>Tampilkan: {ITEMS_PER_PAGE}</span>
                        <span>
                            {filtered.length === 0
                                ? "0 - 0"
                                : `${(page - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(
                                    page * ITEMS_PER_PAGE,
                                    filtered.length
                                )}`} dari {filtered.length} data
                        </span>

                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? "active" : ""}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <AddSupplierModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={async (data) => {
                    try {
                        const res = await fetch(
                            "http://localhost:5000/api/suppliers",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${authData.token}`,
                                },
                                body: JSON.stringify(data),
                            }
                        );

                        const result = await res.json();

                        if (!res.ok) {
                            alert(result.message);
                            return;
                        }

                        await fetchSuppliers();
                        setOpenModal(false);

                    } catch (err) {
                        console.error(err);
                        alert("Gagal tambah supplier");
                    }
                }}
            />

            <EditSupplierModal
                open={editModalOpen}
                supplier={selectedSupplier}
                onClose={() => setEditModalOpen(false)}
                onSubmit={async (updated) => {
                    try {
                        const res = await fetch(
                            `http://localhost:5000/api/suppliers/${updated.id}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${authData.token}`,
                                },
                                body: JSON.stringify(updated),
                            }
                        );

                        const result = await res.json();

                        if (!res.ok) {
                            alert(result.message);
                            return;
                        }

                        await fetchSuppliers();
                        setEditModalOpen(false);
                        setSelectedSupplier(null);

                    } catch (err) {
                        console.error(err);
                        alert("Gagal update supplier");
                    }
                }}
            />

            <DeleteSupplierModal
                open={deleteModalOpen}
                supplier={selectedSupplier}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={async (id) => {
                    try {
                        const res = await fetch(
                            `http://localhost:5000/api/suppliers/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${authData.token}`,
                                },
                            }
                        );

                        const result = await res.json();

                        if (!res.ok) {
                            alert(result.message);
                            return;
                        }

                        await fetchSuppliers();
                        setDeleteModalOpen(false);
                        setSelectedSupplier(null);

                    } catch (err) {
                        console.error(err);
                        alert("Gagal hapus supplier");
                    }
                }}
            />
        </div>
    );
};

export default Suppliers;
