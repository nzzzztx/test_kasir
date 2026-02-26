import React, { useState, useEffect } from "react";
import "../../assets/css/dashboard.css";
import "../../assets/css/discount.css";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from '../../context/AuthContext';
import api from "../../services/api";

import Sidebar from "../../components/Sidebar";
import AddPajakModal from "../../components/Pajak/AddPajakModal";
import EditPajakModal from "../../components/Pajak/EditPajakModal";
import DeletePajakModal from "../../components/Pajak/DeletePajakModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/profile.png";
import searchIcon from "../../assets/icons/search.png";
import taxIcon from "../../assets/icons/tax.png";
import trashIcon from "../../assets/icons/trash.png";
import editIcon from "../../assets/icons/edit.png";

const Pajak = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const { unreadCount } = useNotifications();
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTax, setSelectedTax] = useState(null);
    const { authData } = useAuth();
    const [user, setUser] = useState(null);
    const [taxes, setTaxes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchTaxes = async () => {
            const res = await api.get("/taxes");
            setTaxes(res.data);
        };

        fetchTaxes();
    }, [authData?.token]);

    const filtered = taxes.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        setSearch("");
        setSelectedTax(null);
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
                        <h1>Pajak Barang</h1>
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

                <div className="discount-page">
                    <div className="discount-toolbar">
                        <div className="discount-search">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari pajak..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-primary discount-add-btn"
                            onClick={() => setAddOpen(true)}
                        >
                            + Tambah Pajak
                        </button>
                    </div>

                    <div className="discount-list-wrapper">
                        <div className="discount-list">
                            {filtered.map((item) => (
                                <div className="discount-item" key={item.id}>
                                    <div className="discount-left">
                                        <div className="discount-icon">
                                            <img src={taxIcon} alt="tax" />
                                        </div>

                                        <div className="discount-info">
                                            <span className="discount-name">
                                                {item.name}
                                            </span>
                                            <span className="discount-percent">
                                                {item.type === "percent"
                                                    ? `${item.value}%`
                                                    : `Rp ${item.value.toLocaleString("id-ID")}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="discount-actions">
                                        <button
                                            className="discount-edit"
                                            onClick={() => {
                                                setSelectedTax(item);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <img src={editIcon} alt="edit" />
                                        </button>

                                        <button
                                            className="discount-delete"
                                            onClick={() => {
                                                setSelectedTax(item);
                                                setDeleteOpen(true);
                                            }}
                                        >
                                            <img src={trashIcon} alt="delete" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <AddPajakModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    onSubmit={async (data) => {
                        await api.post("/taxes", data);
                        const res = await api.get("/taxes");
                        setTaxes(res.data);
                    }}
                />

                <EditPajakModal
                    open={editOpen}
                    tax={selectedTax}
                    onClose={() => setEditOpen(false)}
                    onSubmit={async (updated) => {
                        await api.put(`/taxes/${updated.id}`, updated);
                        const res = await api.get("/taxes");
                        setTaxes(res.data);
                        setEditOpen(false);
                        setSelectedTax(null);
                    }}
                />

                <DeletePajakModal
                    open={deleteOpen}
                    tax={selectedTax}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={async (id) => {
                        await api.delete(`/taxes/${id}`);
                        const res = await api.get("/taxes");
                        setTaxes(res.data);
                        setDeleteOpen(false);
                        setSelectedTax(null);
                    }}
                />
            </div>
        </div>
    );
};

export default Pajak;
