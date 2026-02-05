import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import "../../assets/css/setting.css";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import cameraIcon from "../../assets/icons/camera.png";
import userDummy from "../../assets/img/profile.png";

import infoTokoIcon from "../../assets/icons/store.png";
import metodeBayarIcon from "../../assets/icons/keuangan.png";
import profilIcon from "../../assets/icons/user.png";
import edcIcon from "../../assets/icons/edc.png";
import strukIcon from "../../assets/icons/struk.png";

const Setting = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const settingMenus = [
        {
            title: "Informasi Toko",
            icon: infoTokoIcon,
            path: "/dashboard/setting/informasi-toko",
        },
        {
            title: "Metode Pembayaran",
            icon: metodeBayarIcon,
            path: "/dashboard/setting/metode-pembayaran",
        },
        {
            title: "Profil",
            icon: profilIcon,
            path: "/dashboard/setting/profil",
        },
        {
            title: "Perangkat EDC",
            icon: edcIcon,
            path: "/dashboard/setting/edc",
        },
        {
            title: "Pengaturan Struk",
            icon: strukIcon,
            path: "/dashboard/setting/struk",
        },
    ];

    const [user] = useState(() => {
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
                            <img src={toggleIcon} alt="Toggle Sidebar" />
                        </button>
                        <h1>Pengaturan</h1>
                    </div>

                    <div className="header-right">
                        <div
                            className="notif"
                            onClick={() => setNotificationOpen(!notificationOpen)}
                        >
                            <img src={notificationIcon} alt="notif" />
                            <span>Notifikasi</span>

                            {notificationOpen && (
                                <div className="notif-dropdown">
                                    <div className="notif-header">
                                        <span>Notifikasi (0)</span>
                                    </div>

                                    <div className="notif-body empty">
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
                                src={user.avatar}
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
                                                src={user.avatar}
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
                                            <div className="profile-fullname">{user.name}</div>
                                            <div className="profile-email">{user.email}</div>
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

                                        <button className="profile-menu-item">
                                            Ganti Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </header>

                <div className="setting-grid">
                    {settingMenus.map((item, i) => (
                        <div
                            key={i}
                            className="setting-card"
                            onClick={() => navigate(item.path)}
                        >
                            <div className="setting-icon">
                                <img src={item.icon} alt="" />
                            </div>
                            <h3>{item.title}</h3>
                        </div>
                    ))}
                </div>

                {/* <div className="setting-logout">
                    <button
                        className="btn-logout"
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}
                    >
                        Logout Aplikasi
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Setting;
