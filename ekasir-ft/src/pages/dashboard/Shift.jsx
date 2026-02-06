import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import hitungSaldoSistem from "../../utils/shiftcalculator";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "../../components/Laporan/KalenderTransaksi";

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

    const [activeShift, setActiveShift] = useState(() =>
        JSON.parse(localStorage.getItem("active_shift"))
    );

    const [history, setHistory] = useState(() =>
        JSON.parse(localStorage.getItem("shift_history")) || []
    );

    useEffect(() => {
        setHistory(JSON.parse(localStorage.getItem("shift_history")) || []);
    }, [showAkhiri]);

    useEffect(() => {
        if (!authData?.isLoggedIn) {
            navigate("/login");
        }
    }, [authData]);

    const isInRange = (date, range) => {
        if (!range || !date) return false;

        const d = new Date(date);
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return d >= start && d <= end;
    };

    const filteredHistory = history.filter((h) => {
        if (!h.startedAt) return false;
        if (drawer && h.drawer !== drawer) return false;
        return isInRange(h.startedAt, range);
    });

    const savedProfile = JSON.parse(localStorage.getItem("user_profile") || "{}");

    const currentUser = {
        name: savedProfile.name || authData?.email || "Kasir",
        role: authData?.role || "Kasir",
    };

    const allTransactions =
        JSON.parse(localStorage.getItem("transaction_history")) || [];

    const transactions = activeShift
        ? allTransactions.filter(
            (t) => t.shiftStartedAt === activeShift.startedAt
        )
        : [];

    const expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    const saldoSistem = activeShift
        ? hitungSaldoSistem({
            saldoAwal: activeShift.saldoAwal,
            transactions,
            expenses,
            notes: activeShift.notes || [],
            activeShift,
        })
        : 0;

    const handleMulaiShift = () => {
        if (!saldoAwal) {
            alert("Saldo awal wajib diisi");
            return;
        }

        const shiftData = {
            cashier: currentUser.name,
            drawer,
            drawerLabel:
                drawer === "Cash Drawer 1"
                    ? "Pagi"
                    : drawer === "Cash Drawer 2"
                        ? "Siang"
                        : "Malam",
            saldoAwal: Number(saldoAwal),
            startedAt: new Date().toISOString(),
            status: "ACTIVE",
        };

        localStorage.setItem("active_shift", JSON.stringify(shiftData));
        setActiveShift(shiftData);
        setShowMulai(false);

        alert("Shift berhasil dimulai ✅");
    };

    const handleAkhiriShift = ({ saldoAkhir, note }) => {
        const active = JSON.parse(localStorage.getItem("active_shift"));
        if (!active) return;

        const finishedShift = {
            ...active,
            saldoAkhir: Number(saldoAkhir),
            note,
            endedAt: new Date().toISOString(),
            status: "DONE",
        };

        const prevHistory =
            JSON.parse(localStorage.getItem("shift_history")) || [];

        const newHistory = [...prevHistory, finishedShift];

        localStorage.setItem("shift_history", JSON.stringify(newHistory));
        localStorage.removeItem("active_shift");

        setHistory(newHistory);
        setActiveShift(null);
        setShowAkhiri(false);

        alert("Shift berhasil diakhiri ✅");
    };

    const handleViewDetail = (shift) => {
        setSelectedShift(shift);
        setShowDetail(true);
    };

    const handleAddNote = (note) => {
        if (!selectedShift) return;

        const updatedShift = {
            ...selectedShift,
            notes: [...(selectedShift.notes || []), note],
        };

        const newHistory = history.map((h) =>
            h.startedAt === selectedShift.startedAt ? updatedShift : h
        );

        localStorage.setItem("shift_history", JSON.stringify(newHistory));
        setHistory(newHistory);
        setSelectedShift(updatedShift);
    };

    const [user] = useState(() => {
        const saved = localStorage.getItem("user_profile");
        return saved
            ? JSON.parse(saved)
            : {
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
                        <h1>Shift</h1>
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
                                            <img src={notificationIcon} alt="" />
                                        </div>
                                        <p className="notif-title">Tidak Ada Notifikasi</p>
                                        <p className="notif-desc">
                                            Informasi darurat akan muncul di sini
                                        </p>
                                    </div>
                                    <div
                                        className="notif-footer"
                                        onClick={() => setNotificationOpen(false)}
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
                                            <div className="profile-fullname">{authData?.name || "Kasir"}</div>
                                            <div className="profile-email">{authData?.email || "-"}</div>
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
                        <div className="shift-card">
                            <h4>Saat ini</h4>

                            <div className="shift-user">
                                <div className="avatar">
                                    {(activeShift?.cashier || currentUser.name)[0]}
                                </div>
                                <div>
                                    <div className="name">
                                        {activeShift?.cashier || currentUser.name}
                                    </div>
                                    <div className="role">{currentUser.role}</div>
                                </div>
                            </div>

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
                                            <td>{item.cashier}</td>
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
                                                {new Date(item.startedAt).toLocaleTimeString("id-ID", {
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
                                onUpdate={(updatedShift) => {
                                    const newHistory = history.map((h) =>
                                        h.startedAt === updatedShift.startedAt ? updatedShift : h
                                    );

                                    setHistory(newHistory);
                                    setSelectedShift(updatedShift);

                                    localStorage.setItem(
                                        "shift_history",
                                        JSON.stringify(newHistory)
                                    );
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
