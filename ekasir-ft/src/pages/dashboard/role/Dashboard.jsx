import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import '../../../assets/css/dashboard.css';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { getInfoToko } from "../../../utils/toko";
import { useNotifications } from '../../../context/NotificationContext';

import produkIcon from '../../../assets/icons/produk.png';
import kategoriIcon from '../../../assets/icons/category.png';
import customerIcon from '../../../assets/icons/customer.png';
import supplierIcon from '../../../assets/icons/user.png';
import diskonIcon from '../../../assets/icons/discount.png';
import marketIcon from '../../../assets/icons/market.png';
import stokIcon from '../../../assets/icons/stock.png';
import toggleIcon from '../../../assets/icons/togglebutton.png';
import notificationIcon from '../../../assets/icons/notification.png';
import taxIcon from '../../../assets/icons/tax.png';
import keuanganIcon from '../../../assets/icons/keuangan.png';
import cameraIcon from '../../../assets/icons/camera.png';
import userDummy from '../../../assets/img/profile.png';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { authData } = useAuth();
    const navigate = useNavigate();
    const role = authData?.role;
    const [user, setUser] = useState(null);

    const [namaToko, setNamaToko] = useState("");
    const [lokasi, setLokasi] = useState("");

    useEffect(() => {
        const loadToko = () => {
            const data = getInfoToko();
            setNamaToko(data.namaToko);
            setLokasi(data.lokasi);
        };

        loadToko();

        window.addEventListener("storage", loadToko);

        return () => {
            window.removeEventListener("storage", loadToko);
        };
    }, []);

    const menuData = [
        {
            title: "Data Barang / Produk",
            desc: "Tambahkan barang atau jasa yang anda miliki untuk pengelolaan yang lebih akurat.",
            icon: produkIcon,
            path: "/dashboard/product",
        },
        {
            title: "Kategori Barang",
            desc: "Kelola barang dengan kategori tertentu untuk memudahkan manajemen produk.",
            icon: kategoriIcon,
            path: "/dashboard/categories",
        },
        {
            title: "Data Pelanggan",
            desc: "Kelola informasi pelanggan atau member dengan mudah dan pantau dengan efisien.",
            icon: customerIcon,
            path: "/dashboard/customers",
        },
        {
            title: "Data Supplier",
            desc: "Simpan data supplier anda secara teratur, untuk memastikan alur pasokan tetap lancar.",
            icon: supplierIcon,
            path: "/dashboard/suppliers",
        },
        {
            title: "Pembelian Barang",
            desc: "Catat pembelian barang dari supplier dan otomatis menambah stok.",
            icon: marketIcon,
            path: "/dashboard/pembelian",
        },
        {
            title: "Diskon Barang",
            desc: "Buat potongan harga/diskon produk, baik berupa persentase atau nominal.",
            icon: diskonIcon,
            path: "/dashboard/discount",
        },
        {
            title: "Pajak Barang",
            desc: "Buat potongan harga/diskon produk, baik berupa persentase atau nominal.",
            icon: taxIcon,
            path: "/dashboard/pajak",
        },
        {
            title: "Stok Barang",
            desc: "Kelola stok barang anda dengan mudah dan pantau stok secara real-time disini.",
            icon: stokIcon,
            path: "/dashboard/stock",
        },
        {
            title: "Transaction",
            desc: "Kelola Transaksi barang anda dengan mudah dan pembayaran yang profesional.",
            icon: keuanganIcon,
            path: "/dashboard/transaction",
        },
    ];

    useEffect(() => {
        if (!authData?.token) {
            navigate("/login");
        }
    }, [authData, navigate]);

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    const filteredMenu = menuData.filter(item => {
        if (role === "owner") return true;

        if (role === "kasir") {
            return [
                "/dashboard/customers",
                "/dashboard/transaction",
                "/dashboard/laporan"
            ].includes(item.path);
        }

        if (role === "gudang") {
            return [
                "/dashboard/product",
                "/dashboard/categories",
                "/dashboard/suppliers",
                "/dashboard/pembelian",
                "/dashboard/stock"
            ].includes(item.path);
        }

        return false;
    });

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
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="Toggle Sidebar" />
                        </button>
                        <h1>Manajemen Kasir</h1>
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
                                src={user?.avatar ? user.avatar : userDummy}
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

                                        <button
                                            className="profile-menu-item"
                                            onClick={() => {
                                                setProfileOpen(false);
                                                setShowPasswordModal(true);
                                            }}
                                        >
                                            Ganti Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                <div className="card-grid">
                    {filteredMenu.map((item, index) => (
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
                                Atur sekarang
                            </button>
                        </div>
                    ))}
                </div>
                {showPasswordModal && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <div className="password-modal-header">
                                <h3>Ganti Password</h3>
                                <button
                                    className="password-close"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <form
                                className="password-modal-body"
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    const oldPass = e.target.old_password.value;
                                    const newPass = e.target.new_password.value;
                                    const confirm = e.target.confirm_password.value;

                                    if (newPass !== confirm) {
                                        alert("Konfirmasi password tidak sama");
                                        return;
                                    }

                                    try {
                                        const res = await fetch("http://localhost:5000/api/profile/change-password", {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${authData.token}`,
                                            },
                                            body: JSON.stringify({
                                                oldPassword: oldPass,
                                                newPassword: newPass,
                                            }),
                                        });

                                        const data = await res.json();

                                        if (!res.ok) {
                                            alert(data.message);
                                            return;
                                        }

                                        alert("Password berhasil diganti");
                                        setShowPasswordModal(false);
                                        e.target.reset();
                                    } catch (err) {
                                        console.error("Gagal ganti password:", err);
                                        alert("Terjadi kesalahan server");
                                    }
                                }}
                            >
                                <div className="form-group">
                                    <label>Password Lama</label>
                                    <input
                                        type="password"
                                        name="old_password"
                                        placeholder="Masukkan password lama"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Password Baru</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        placeholder="Ulangi password baru"
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn-primary full">
                                    Simpan Password
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;