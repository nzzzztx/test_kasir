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

    const [customers, setCustomers] = useState([]);
    const fetchCustomers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/customers", {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });

            if (!res.ok) throw new Error("Gagal fetch");

            const data = await res.json();
            setCustomers(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!authData?.token) return;
        fetchCustomers();
    }, [authData]);

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
        setSelectedCustomer(null);
        setSearch("");
        setPage(1);
    }, [authData]);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    const filtered = customers.filter((c) =>
        (c.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const ITEMS_PER_PAGE = 15;
    const [page, setPage] = useState(1);

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / ITEMS_PER_PAGE)
    );

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
                    await fetch("http://localhost:5000/api/customers", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authData.token}`,
                        },
                        body: JSON.stringify({
                            name: row.name || "",
                            phone: row.phone || "",
                            address: row.address || "",
                            email: row.email || "",
                        }),
                    });
                }

                // Reload setelah import selesai
                const reload = await fetch("http://localhost:5000/api/customers", {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });

                const customersData = await reload.json();
                setCustomers(customersData);

                alert("Import berhasil");

            } catch (err) {
                console.error(err);
            }
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
            <AddCustomersModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={async (data) => {
                    try {
                        const res = await fetch("http://localhost:5000/api/customers", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authData.token}`,
                            },
                            body: JSON.stringify(data),
                        });

                        const result = await res.json();

                        if (!res.ok) {
                            alert(result.message);
                            return;
                        }

                        // Reload data dari server
                        const reload = await fetch("http://localhost:5000/api/customers", {
                            headers: {
                                Authorization: `Bearer ${authData.token}`,
                            },
                        });

                        const customersData = await reload.json();
                        setCustomers(customersData);

                        setOpenModal(false);

                    } catch (err) {
                        console.error(err);
                    }
                }}
            />

            <EditCustomersModal
                open={editModalOpen}
                customer={selectedCustomer}
                onClose={() => setEditModalOpen(false)}
                onSubmit={async (updated) => {
                    try {
                        const res = await fetch(
                            `http://localhost:5000/api/customers/${updated.id}`,
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

                        const reload = await fetch("http://localhost:5000/api/customers", {
                            headers: {
                                Authorization: `Bearer ${authData.token}`,
                            },
                        });

                        const customersData = await reload.json();
                        setCustomers(customersData);

                        setEditModalOpen(false);
                        setSelectedCustomer(null);

                    } catch (err) {
                        console.error(err);
                    }
                }}
            />

            <DeleteCustomersModal
                open={deleteModalOpen}
                customer={selectedCustomer}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={async (id) => {
                    try {
                        await fetch(
                            `http://localhost:5000/api/customers/${id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    Authorization: `Bearer ${authData.token}`,
                                },
                            }
                        );

                        const reload = await fetch("http://localhost:5000/api/customers", {
                            headers: {
                                Authorization: `Bearer ${authData.token}`,
                            },
                        });

                        const customersData = await reload.json();
                        setCustomers(customersData);

                        setDeleteModalOpen(false);
                        setSelectedCustomer(null);

                    } catch (err) {
                        console.error(err);
                    }
                }}
            />
        </div>
    );
};

export default Customers;
