import React, { useState } from "react";
import "../../assets/css/dashboard.css";
import "../../assets/css/discount.css";
import { useNotifications } from "../../context/NotificationContext";

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

    const [taxes, setTaxes] = useState(() => {
        const saved = localStorage.getItem("taxes");
        return saved
            ? JSON.parse(saved)
            : [
                { id: 1, name: "PPN 11%", type: "percent", value: 11 },
                { id: 2, name: "Pajak Layanan", type: "percent", value: 5 },
            ];
    });

    const filtered = taxes.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user_profile");
        return saved
            ? JSON.parse(saved)
            : {
                name: "",
                email: "",
                avatar: userDummy,
            };
    });

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
                            <img src={user.avatar} alt="profile" />
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
                    onSubmit={(data) => {
                        const newTax = { id: Date.now(), ...data };
                        setTaxes((prev) => {
                            const updated = [newTax, ...prev];
                            localStorage.setItem("taxes", JSON.stringify(updated));
                            return updated;
                        });
                        setAddOpen(false);
                    }}
                />

                <EditPajakModal
                    open={editOpen}
                    tax={selectedTax}
                    onClose={() => setEditOpen(false)}
                    onSubmit={(updated) => {
                        setTaxes((prev) => {
                            const data = prev.map((t) =>
                                t.id === updated.id ? { ...t, ...updated } : t
                            );
                            localStorage.setItem("taxes", JSON.stringify(data));
                            return data;
                        });
                        setEditOpen(false);
                        setSelectedTax(null);
                    }}
                />

                <DeletePajakModal
                    open={deleteOpen}
                    tax={selectedTax}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={(id) => {
                        setTaxes((prev) => {
                            const updated = prev.filter((t) => t.id !== id);
                            localStorage.setItem("taxes", JSON.stringify(updated));
                            return updated;
                        });
                        setDeleteOpen(false);
                        setSelectedTax(null);
                    }}
                />
            </div>
        </div>
    );
};

export default Pajak;
