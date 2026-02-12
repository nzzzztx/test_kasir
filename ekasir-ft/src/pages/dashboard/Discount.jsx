import React, { useState, useEffect } from "react";
import "../../assets/css/dashboard.css";
import "../../assets/css/discount.css";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/Sidebar";
import AddDiscountModal from "../../components/Discount/AddDiscountModal";
import EditDiscountModal from "../../components/Discount/EditDiscountModal";
import DeleteDiscountModal from "../../components/Discount/DeleteDiscountModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/user1.png";
import searchIcon from "../../assets/icons/search.png";
import discountIcon from "../../assets/icons/discount.png";
import trashIcon from "../../assets/icons/trash.png";
import editIcon from "../../assets/icons/edit.png";

const Discount = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const { unreadCount } = useNotifications();
    const { authData } = useAuth();
    const [user, setUser] = useState(null);

    const [discounts, setDiscounts] = useState(() => {
        const saved = localStorage.getItem(`products_owner_${authData.ownerId}`)
            ;
        return saved
            ? JSON.parse(saved)
            : [
                { id: 1, name: "Diskon Ramadhan", type: "percent", value: 20 },
                { id: 2, name: "Diskon HUT RI ke-79", type: "percent", value: 50 },
            ];
    });

    const filtered = discounts.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

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
                        <h1>Diskon Barang</h1>
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
                                placeholder="Cari diskon..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            className="btn-primary discount-add-btn"
                            onClick={() => setAddOpen(true)}
                        >
                            + Tambah Potongan/Diskon
                        </button>
                    </div>

                    <div className="discount-list-wrapper">
                        <div className="discount-list">
                            {filtered.map((item) => (
                                <div className="discount-item" key={item.id}>
                                    <div className="discount-left">
                                        <div className="discount-icon">
                                            <img src={discountIcon} alt="discount" />
                                        </div>

                                        <div className="discount-info">
                                            <span className="discount-name">{item.name}</span>
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
                                                setSelectedDiscount(item);
                                                setEditOpen(true);
                                            }}
                                        >
                                            <img src={editIcon} alt="edit" />
                                        </button>

                                        <button
                                            className="discount-delete"
                                            onClick={() => {
                                                setSelectedDiscount(item);
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
                <AddDiscountModal
                    open={addOpen}
                    onClose={() => setAddOpen(false)}
                    onSubmit={(data) => {
                        const newDiscount = {
                            id: Date.now(),
                            ...data,
                        };

                        setDiscounts((prev) => {
                            const updated = [newDiscount, ...prev];
                            localStorage.setItem("discounts", JSON.stringify(updated));
                            return updated;
                        });

                        setAddOpen(false);
                    }}
                />
                <EditDiscountModal
                    open={editOpen}
                    discount={selectedDiscount}
                    onClose={() => setEditOpen(false)}
                    onSubmit={(updated) => {
                        setDiscounts((prev) => {
                            const newData = prev.map((d) =>
                                d.id === updated.id ? { ...d, ...updated } : d
                            );

                            localStorage.setItem("discounts", JSON.stringify(newData));
                            return newData;
                        });

                        setEditOpen(false);
                        setSelectedDiscount(null);
                    }}
                />
                <DeleteDiscountModal
                    open={deleteOpen}
                    discount={selectedDiscount}
                    onClose={() => setDeleteOpen(false)}
                    onConfirm={(id) => {
                        setDiscounts((prev) => {
                            const updated = prev.filter((d) => d.id !== id);
                            localStorage.setItem("discounts", JSON.stringify(updated));
                            return updated;
                        });

                        setDeleteOpen(false);
                        setSelectedDiscount(null);
                    }}
                />
            </div>
        </div>
    );
};

export default Discount;
