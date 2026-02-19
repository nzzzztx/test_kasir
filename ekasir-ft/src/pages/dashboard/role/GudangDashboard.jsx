import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import '../../../assets/css/dashboard.css';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';

import produkIcon from '../../../assets/icons/produk.png';
import kategoriIcon from '../../../assets/icons/category.png';
import supplierIcon from '../../../assets/icons/user.png';
import marketIcon from '../../../assets/icons/market.png';
import stokIcon from '../../../assets/icons/stock.png';
import laporanIcon from '../../../assets/icons/report.png';
import toggleIcon from '../../../assets/icons/togglebutton.png';
import notificationIcon from '../../../assets/icons/notification.png';
import cameraIcon from '../../../assets/icons/camera.png';
import userDummy from '../../../assets/img/profile.png';

const GudangDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { changePassword, authData } = useAuth();
    const navigate = useNavigate();
    const role = authData?.role;
    const [user, setUser] = useState(null);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

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

    const menuData = [
        {
            title: "Data Produk",
            desc: "Kelola dan tambahkan produk baru.",
            icon: produkIcon,
            path: "/dashboard/product",
        },
        {
            title: "Kategori Produk",
            desc: "Kelompokkan produk berdasarkan kategori.",
            icon: kategoriIcon,
            path: "/dashboard/categories",
        },
        {
            title: "Data Supplier",
            desc: "Kelola supplier untuk pasokan barang.",
            icon: supplierIcon,
            path: "/dashboard/suppliers",
        },
        {
            title: "Pembelian Barang",
            desc: "Catat pembelian barang dari supplier.",
            icon: marketIcon,
            path: "/dashboard/pembelian",
        },
        {
            title: "Stok Barang",
            desc: "Pantau dan kelola stok barang.",
            icon: stokIcon,
            path: "/dashboard/stock",
        },
        {
            title: "Laporan Barang",
            desc: "Laporan aktivitas keluar masuk stock barang.",
            icon: laporanIcon,
            path: "/dashboard/laporan",
        },
    ];

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

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="Toggle Sidebar" />
                        </button>
                        <h1>Dashboard Gudang</h1>
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

                        <div
                            className="profile-box profile-trigger"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            <img
                                src={user?.avatar || userDummy}
                                alt="profile"
                                className="header-avatar"
                            />
                            <span className="profile-caret">▾</span>

                            {profileOpen && (
                                <div
                                    className="profile-dropdown"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="profile-title">
                                        Akun Saya
                                    </div>

                                    <div className="profile-header profile-header-center">
                                        <div className="profile-avatar-wrapper profile-avatar-large">
                                            <img
                                                src={user?.avatar || userDummy}
                                                alt="avatar"
                                                className="profile-avatar-img"
                                            />

                                            <label className="profile-avatar-edit">
                                                <img
                                                    src={cameraIcon}
                                                    alt="edit avatar"
                                                    className="profile-avatar-edit-icon"
                                                />

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    hidden
                                                    onChange={(e) => {
                                                        console.log(e.target.files[0]);
                                                    }}
                                                />
                                            </label>
                                        </div>

                                        <div className="profile-info profile-info-center">
                                            <div className="profile-fullname">{user?.nama}</div>
                                            <div className="profile-email">{user?.email}</div>
                                            <div className={`profile-role-badge ${authData?.role}`}>
                                                {authData?.role?.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-menu">
                                        <button
                                            className="profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                navigate("/dashboard/akun");
                                            }}
                                        >
                                            Edit Profile
                                        </button>

                                        {/* <button
                                            className="profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                setShowPasswordModal(true);
                                            }}
                                        >
                                            Ganti Password
                                        </button> */}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                <div className="card-grid">
                    {menuData.map((item, index) => (
                        <div className="menu-card" key={index}>
                            <div className="card-top">
                                <div className="card-text">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="card-icon">
                                    <img src={item.icon} alt="icon" />
                                </div>
                            </div>
                            <button
                                className="btn-atur"
                                onClick={() => navigate(item.path)}
                            >
                                Buka
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GudangDashboard;
