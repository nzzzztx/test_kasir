import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import hitungSaldoSistem from "../../utils/shiftcalculator";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "../../components/Laporan/KalenderTransaksi";
import { useNotifications } from "../../context/NotificationContext";
import { useShift } from "../../context/ShiftContext";

import "../../assets/css/dashboard.css";
import "../../assets/css/shift.css";
import MulaiShiftModal from "../../components/Shift/MulaiShiftModal";
import AkhiriShiftModal from "../../components/Shift/AkhiriShiftModal";
import RekapShift from "../../components/Shift/RekapShift";
import TambahCatatanModal from "../../components/Shift/TambahCatatanModal";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import cameraIcon from "../../assets/icons/camera.png";
import userDummy from "../../assets/img/user1.png";

const DRAWER_CONFIG = {
    "Cash Drawer 1": {
        label: "Pagi",
        start: "07:00",
        end: "14:00",
    },
    "Cash Drawer 2": {
        label: "Siang",
        start: "15:00",
        end: "22:00",
    },
    "Cash Drawer 3": {
        label: "Backup",
        start: null,
        end: null,
    },
};

const Shift = () => {
    const today = new Date();
    const { authData, changePassword } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [showAddNote, setShowAddNote] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const role = authData?.role;
    const { activeShift, fetchActiveShift, loadingShift } = useShift();
    const [detailTransactions, setDetailTransactions] = useState([]);

    const [range, setRange] = useState({
        startDate: today,
        endDate: today,
    });

    const [showMulai, setShowMulai] = useState(false);
    const [showAkhiri, setShowAkhiri] = useState(false);

    const [saldoAwal, setSaldoAwal] = useState("");
    const [drawer, setDrawer] = useState("Cash Drawer 1");

    const [selectedShift, setSelectedShift] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [history, setHistory] = useState([]);

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

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    useEffect(() => {
        if (!authData?.token) return;

        fetch("http://localhost:5000/api/shifts/history", {
            headers: {
                Authorization: `Bearer ${authData.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setHistory(data);
                } else {
                    setHistory([]);
                }
            })
            .catch((err) => {
                console.error("History error:", err);
                setHistory([]);
            });
    }, [authData?.token]);

    useEffect(() => {
        if (authData && !authData.isLoggedIn) {
            navigate("/login");
        }
    }, [authData, navigate]);

    const isInRange = (date, range) => {
        if (!range || !date) return false;

        const d = new Date(date);
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return d >= start && d <= end;
    };

    const filteredHistory = Array.isArray(history)
        ? history.filter((h) => {
            if (!h.started_at) return false;
            return isInRange(h.started_at, range);
        })
        : [];

    const currentUser = {
        name: user?.nama || user?.email || "Kasir",
        role: user?.role || authData?.role || "Kasir",
    };

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (!activeShift || !authData?.token) return;

        fetch(
            `http://localhost:5000/api/transactions?shift_id=${activeShift.id}`,
            {
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setTransactions(data);
            })
            .catch((err) => console.error(err));
    }, [activeShift, authData?.token]);

    const saldoSistem = activeShift
        ? hitungSaldoSistem({
            saldoAwal: activeShift.saldo_awal,
            transactions,
            expenses: [],
            notes: activeShift.notes || [],
            activeShift,
        })
        : 0;

    // console.log("USER DATA:", user);

    const handleMulaiShift = async () => {
        if (!saldoAwal) {
            alert("Saldo awal wajib diisi");
            return;
        }

        const drawerInfo = DRAWER_CONFIG[drawer];

        try {
            const res = await fetch("http://localhost:5000/api/shifts/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    drawer,
                    drawer_label: drawerInfo.label,
                    saldo_awal: Number(saldoAwal)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("Shift berhasil dimulai ✅");

            // ambil ulang active shift
            await fetchActiveShift();

            setShowMulai(false);
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan");
        }
    };

    const handleAkhiriShift = async ({ saldoAkhir, note }) => {
        if (!activeShift) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/shifts/end/${activeShift.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authData.token}`
                    },
                    body: JSON.stringify({
                        saldo_akhir: Number(saldoAkhir),
                        note
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            alert("Shift berhasil diakhiri ✅");

            await fetchActiveShift();
            setShowAkhiri(false);

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan");
        }
    };

    const handleViewDetail = async (shift) => {
        setSelectedShift(shift);
        setShowDetail(true);

        try {
            const shiftId = shift.shift_id || shift.id;

            const res = await fetch(
                `http://localhost:5000/api/transactions?shift_id=${shiftId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const data = await res.json();
            setDetailTransactions(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddNote = async (note) => {
        if (!selectedShift) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/shifts/${selectedShift.id}/note`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authData.token}`,
                    },
                    body: JSON.stringify(note),
                }
            );

            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }

            // refresh history
            const historyRes = await fetch(
                "http://localhost:5000/api/shifts/history",
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const historyData = await historyRes.json();
            setHistory(historyData);

            setShowAddNote(false);
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan catatan");
        }
    };

    const getShiftWarning = () => {
        if (!activeShift?.shiftEndTime) return null;

        const now = new Date();
        const [h, m] = activeShift.shiftEndTime.split(":");
        const hour = Number(h);
        const minute = Number(m);

        const shiftEnd = new Date();
        shiftEnd.setHours(hour, minute, 0, 0);

        const diff = (shiftEnd - now) / 1000 / 60;

        if (diff <= 0) {
            return "Shift sudah melewati waktu yang ditentukan";
        }

        if (diff <= 30) {
            return `Shift akan berakhir dalam ${Math.floor(diff)} menit`;
        }

        return null;
    };

    const getShiftColor = () => {
        if (!activeShift) return "#e2e8f0";

        if (activeShift.drawerLabel === "Pagi") return "#22c55e";
        if (activeShift.drawerLabel === "Siang") return "#f97316";
        if (activeShift.drawerLabel === "Backup") return "#3b82f6";

        return "#64748b";
    };

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
                            <img src={toggleIcon} alt="Toggle Sidebar" />
                        </button>
                        <h1>Shift</h1>
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
                                            <div className="profile-fullname">{user?.name}</div>
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

                <div className="shift-page">
                    <div className="shift-left">
                        <div className="shift-card" style={{ borderTop: `4px solid ${getShiftColor()}` }}>
                            <h4>Saat ini</h4>

                            <div className="shift-user">

                                <div className="avatar-wrapper">
                                    {user?.avatar ? (
                                        <img
                                            src={
                                                user?.avatar?.startsWith("data:image")
                                                    ? user.avatar
                                                    : user?.avatar
                                                        ? `data:image/png;base64,${user.avatar}`
                                                        : userDummy
                                            }
                                            alt="avatar"
                                            className="shift-avatar-img"
                                        />
                                    ) : (
                                        <div className="avatar-fallback">
                                            {(currentUser.name || "K")[0]}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="name">
                                        {currentUser.name}
                                    </div>

                                    <div className="role">
                                        {currentUser.role}
                                    </div>
                                </div>
                            </div>

                            {activeShift?.shiftStartTime && (
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    {activeShift.shiftStartTime} - {activeShift.shiftEndTime}
                                </div>
                            )}
                            {activeShift?.drawerLabel === "Backup" && (
                                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                                    Shift fleksibel
                                </div>
                            )}
                            {getShiftWarning() && (
                                <div style={{ color: "#ef4444", fontSize: "12px", marginTop: "6px" }}>
                                    {getShiftWarning()}
                                </div>
                            )}

                            <div className="form-group">
                                <label>Pilih Cash Drawer</label>
                                <select
                                    value={drawer}
                                    disabled={!!activeShift}
                                    onChange={(e) => setDrawer(e.target.value)}
                                >
                                    <option>Cash Drawer 1</option>
                                    <option>Cash Drawer 2</option>
                                    <option>Cash Drawer 3</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Masukkan saldo awal</label>
                                <input
                                    placeholder="Rp 0"
                                    value={saldoAwal}
                                    disabled={!!activeShift}
                                    onChange={(e) => setSaldoAwal(e.target.value)}
                                />
                                {!saldoAwal && !activeShift && (
                                    <span className="error-text">
                                        Masukkan data terlebih dahulu
                                    </span>
                                )}
                            </div>

                            {activeShift ? (
                                <button
                                    className="btn-primary btn-start"
                                    onClick={() => setShowAkhiri(true)}
                                >
                                    Akhiri shift
                                </button>
                            ) : (
                                <button
                                    className="btn-primary btn-start"
                                    onClick={() => setShowMulai(true)}
                                >
                                    Mulai shift sekarang
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="shift-right">
                        <div className="shift-card">
                            <div className="shift-history-header">
                                <h4>Riwayat</h4>
                                <button
                                    className="date-btn"
                                    onClick={() => setOpenCalendar(true)}
                                >
                                    {range
                                        ? `${range.startDate.toLocaleDateString("id-ID")} - ${range.endDate.toLocaleDateString("id-ID")}`
                                        : "02 Okt 2024 - 03 Okt 2024"}
                                </button>
                            </div>

                            <table className="shift-table">
                                <thead>
                                    <tr>
                                        <th>Kasir</th>
                                        <th>Drawer</th>
                                        <th>Status</th>
                                        <th>Jam</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                style={{ textAlign: "center", color: "#9ca3af" }}
                                            >
                                                Belum ada riwayat untuk drawer ini
                                            </td>
                                        </tr>
                                    )}

                                    {filteredHistory.map((item, i) => (
                                        <tr key={i}>
                                            <td>
                                                <div className="history-user-text">
                                                    {item.cashier}
                                                </div>
                                            </td>
                                            <td>
                                                {item.drawer}
                                                {item.drawerLabel && (
                                                    <small style={{ display: "block", color: "#888" }}>
                                                        ({item.drawerLabel})
                                                    </small>
                                                )}
                                            </td>
                                            <td>{item.status === "DONE" ? "Selesai" : "Berjalan"}</td>
                                            <td>
                                                {new Date(item.started_at).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-outline"
                                                    onClick={() => handleViewDetail(item)}
                                                >
                                                    Lihat detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {openCalendar && (
                    <KalenderTransaksi
                        onApply={(data) => {
                            setRange(data);
                            setOpenCalendar(false);
                        }}
                        onClose={() => setOpenCalendar(false)}
                    />
                )}

                <MulaiShiftModal
                    open={showMulai}
                    cashier={currentUser.name}
                    drawers={["Cash Drawer 1", "Cash Drawer 2", "Cash Drawer 3"]}
                    saldoAwal={saldoAwal}
                    setSaldoAwal={setSaldoAwal}
                    selectedDrawer={drawer}
                    setSelectedDrawer={setDrawer}
                    onClose={() => setShowMulai(false)}
                    onSubmit={handleMulaiShift}
                />

                <AkhiriShiftModal
                    open={showAkhiri}
                    saldoSistem={saldoSistem}
                    onClose={() => setShowAkhiri(false)}
                    onSubmit={handleAkhiriShift}
                />

                {showDetail && selectedShift && (
                    <div className="modal-overlay">
                        <div className="shift-modal large">
                            <button
                                className="modal-close"
                                onClick={() => setShowDetail(false)}
                            >
                                ×
                            </button>

                            <RekapShift
                                shift={selectedShift}
                                transactions={detailTransactions}
                                onUpdate={async (updatedShift) => {

                                    // 🔥 refresh history dulu
                                    const historyRes = await fetch(
                                        "http://localhost:5000/api/shifts/history",
                                        {
                                            headers: {
                                                Authorization: `Bearer ${authData.token}`,
                                            },
                                        }
                                    );

                                    const historyData = await historyRes.json();
                                    setHistory(historyData);

                                    // 🔥 cari shift terbaru dari database
                                    const freshShift = historyData.find(
                                        (s) => s.id === updatedShift.id
                                    );

                                    // pakai data yang benar-benar dari DB
                                    setSelectedShift(freshShift || updatedShift);

                                    await fetchActiveShift();
                                }}
                            />
                            {/* <button
                                className="btn-primary full"
                                onClick={() => setShowAddNote(true)}
                            >
                                Tambah catatan
                            </button> */}

                            <TambahCatatanModal
                                open={showAddNote}
                                onClose={() => setShowAddNote(false)}
                                onSubmit={handleAddNote}
                            />
                        </div>
                    </div>
                )}
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
                                onSubmit={(e) => {
                                    e.preventDefault();

                                    const oldPass = e.target.old_password.value;
                                    const newPass = e.target.new_password.value;
                                    const confirm = e.target.confirm_password.value;

                                    if (newPass !== confirm) {
                                        alert("Konfirmasi password tidak sama");
                                        return;
                                    }

                                    const result = changePassword(oldPass, newPass);

                                    if (!result.success) {
                                        alert(result.message);
                                        return;
                                    }

                                    alert("Password berhasil diganti");
                                    setShowPasswordModal(false);
                                    e.target.reset();
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

export default Shift;
