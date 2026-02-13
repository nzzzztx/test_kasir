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
        if (!authData?.id) return;

        const saved = localStorage.getItem(`suppliers_${authData.id}`);
        setSuppliers(saved ? JSON.parse(saved) : []);
    }, [authData]);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    useEffect(() => {
        setSelectedSupplier(null);
        setSearch("");
        setPage(1);
    }, [authData]);

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
        if (!suppliers.length) return;
        const worksheet = XLSX.utils.json_to_sheet(suppliers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
        XLSX.writeFile(workbook, "suppliers.xlsx");
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet);

            const imported = rows.map((row) => ({
                id: Date.now() + Math.random(),
                name: row.name || "",
                address: row.address || "",
                email: row.email || "-",
                phone: row.phone || "",
                code:
                    row.code ||
                    Math.floor(100000 + Math.random() * 900000).toString(),
            }));

            const merged = [...imported, ...suppliers];
            setSuppliers(merged);
            localStorage.setItem(
                `suppliers_${authData.id}`,
                JSON.stringify(merged)
            );
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        if (!authData) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.id === authData.id);

        if (currentUser) {
            setUser(currentUser);
        }
    }, [authData]);

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
                            Ditampilkan {(page - 1) * ITEMS_PER_PAGE + 1} -{" "}
                            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} dari{" "}
                            {filtered.length} data
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
                onSubmit={(data) => {
                    const newSupplier = {
                        id: Date.now(),
                        ownerId: authData.id,
                        ...data,
                        code: Math.floor(100000 + Math.random() * 900000).toString(),
                    };

                    const updated = [newSupplier, ...suppliers];
                    setSuppliers(updated);
                    localStorage.setItem(
                        `suppliers_${authData.id}`,
                        JSON.stringify(updated)
                    );
                    setOpenModal(false);
                }}
            />

            <EditSupplierModal
                open={editModalOpen}
                supplier={selectedSupplier}
                onClose={() => setEditModalOpen(false)}
                onSubmit={(updated) => {
                    const newData = suppliers.map((s) =>
                        s.id === updated.id ? { ...s, ...updated } : s
                    );
                    setSuppliers(newData);
                    localStorage.setItem(
                        `suppliers_${authData.id}`,
                        JSON.stringify(newData)
                    );
                }}
            />

            <DeleteSupplierModal
                open={deleteModalOpen}
                supplier={selectedSupplier}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={(id) => {
                    const updated = suppliers.filter((s) => s.id !== id);
                    setSuppliers(updated);
                    localStorage.setItem(
                        `suppliers_${authData.id}`,
                        JSON.stringify(updated)
                    );
                    setDeleteModalOpen(false);
                    setSelectedSupplier(null);
                }}
            />
        </div>
    );
};

export default Suppliers;
