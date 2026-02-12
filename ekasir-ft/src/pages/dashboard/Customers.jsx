import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "../../assets/css/customers.css";
import "../../assets/css/dashboard.css";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/Sidebar";
import AddCustomersModal from "../../components/Customers/AddCustomersModal";
import EditCustomersModal from "../../components/Customers/EditCustomersModal";
import DeleteCustomersModal from "../../components/Customers/DeleteCustomersModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/profile.png";
import searchIcon from "../../assets/icons/search.png";

const Customers = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [user, setUser] = useState(null);
    const { authData } = useAuth();

    const [customers, setCustomers] = useState(() => {
        const saved = localStorage.getItem("customers");
        return saved
            ? JSON.parse(saved)
            : Array.from({ length: 0 }, (_, i) => ({
                id: i + 1,
                name: "",
                email: "",
                phone: "",
                address: "",
                point: 0,
                code: "",
            }));
    });

    useEffect(() => {
        if (!authData) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.id === authData.id);

        if (currentUser) {
            setUser(currentUser);
        }
    }, [authData]);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const ITEMS_PER_PAGE = 15;
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const paginatedData = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleExport = () => {
        if (!customers.length) return;

        const worksheet = XLSX.utils.json_to_sheet(customers);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        XLSX.writeFile(workbook, "customers.xlsx");
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
                email: row.email || "-",
                phone: row.phone || "",
                address: row.address || "",
                point: Number(row.point || 0),
                code:
                    row.code ||
                    Math.floor(100000 + Math.random() * 900000).toString(),
            }));

            const merged = [...imported, ...customers];
            setCustomers(merged);
            localStorage.setItem("customers", JSON.stringify(merged));
        };

        reader.readAsArrayBuffer(file);
    };

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
                        <h1>Data Pelanggan</h1>
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

                <div className="customers-page">
                    <div className="customers-header">
                        <div className="customers-toolbar">
                            <div className="customers-actions">
                                <button className="btn-primary" onClick={() => setOpenModal(true)}>
                                    + Tambah Pelanggan
                                </button>
                                <button className="btn-outline" onClick={handleExport}>
                                    Export Data
                                </button>
                                <input
                                    type="file"
                                    accept=".xlsx"
                                    id="importCustomers"
                                    style={{ display: "none" }}
                                    onChange={handleImport}
                                />

                                <button
                                    className="btn-outline"
                                    onClick={() => document.getElementById("importCustomers").click()}
                                >
                                    Import Data
                                </button>
                            </div>

                            <div className="customers-search-right">
                                <img src={searchIcon} alt="search" />
                                <input
                                    placeholder="Cari pelanggan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="customers-table-wrapper">
                        <table className="customers-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>No Telepon</th>
                                    <th>Alamat</th>
                                    <th>Point</th>
                                    <th>Kode</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedData.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td className="address">{item.address}</td>
                                        <td>{item.point}</td>
                                        <td>{item.code}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => {
                                                        setSelectedCustomer(item);
                                                        setEditModalOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => {
                                                        setSelectedCustomer(item);
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

                    <div className="customers-footer">
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
            <AddCustomersModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={(data) => {
                    const newCustomer = {
                        id: Date.now(),
                        name: data.name,
                        phone: data.phone,
                        address: data.address,
                        email: data.email || "-",
                        point: 0,
                        code: Math.floor(100000 + Math.random() * 900000).toString(),
                    };

                    const updated = [newCustomer, ...customers];

                    setCustomers(updated);
                    localStorage.setItem("customers", JSON.stringify(updated));

                    setOpenModal(false);
                }}
            />

            <EditCustomersModal
                open={editModalOpen}
                customer={selectedCustomer}
                onClose={() => setEditModalOpen(false)}
                onSubmit={(updated) => {
                    const newData = customers.map((c) =>
                        c.id === updated.id ? { ...c, ...updated } : c
                    );

                    setCustomers(newData);
                    localStorage.setItem("customers", JSON.stringify(newData));
                }}
            />

            <DeleteCustomersModal
                open={deleteModalOpen}
                customer={selectedCustomer}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={(id) => {
                    const updated = customers.filter((c) => c.id !== id);

                    setCustomers(updated);
                    localStorage.setItem("customers", JSON.stringify(updated));

                    setDeleteModalOpen(false);
                    setSelectedCustomer(null);
                }}
            />
        </div>
    );
};

export default Customers;
