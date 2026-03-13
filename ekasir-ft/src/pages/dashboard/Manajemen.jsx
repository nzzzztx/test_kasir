import { useEffect, useState } from "react";
import "../../assets/css/manajemen.css";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
// import { getCurrentOwnerId } from "../../utils/owner";

import Sidebar from "../../components/Sidebar";
import AddUser from "../../components/manajemen/AddUser";
import EditUser from "../../components/manajemen/EditUser";

import toggleIcon from "../../assets/icons/togglebutton.png";
import notificationIcon from "../../assets/icons/notification.png";
import userDummy from "../../assets/img/profile.png";
import searchIcon from "../../assets/icons/search.png";

export default function Manajemen() {
    const { authData } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const {
        notifications,
        unreadCount,
        markAllAsRead,
    } = useNotifications();

    useEffect(() => {
        if (authData) {
            setUser(authData);
        }
    }, [authData]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchUsers = async () => {
            try {
                const res = await fetch("http://192.168.2.20:5000/api/users", {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                });

                const result = await res.json();

                if (res.ok && result.success) {
                    const filtered = result.data.filter(u => u.role !== "owner");
                    setUsers(filtered);
                }

            } catch (err) {
                console.error("Gagal ambil users:", err);
            }
        };

        fetchUsers();
    }, [authData?.token]);

    const filteredUsers = users.filter(u =>
        (u.username || "").toLowerCase().includes(search.toLowerCase())
    );
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://192.168.2.20:5000/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authData.token}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.message);
                return;
            }

            setUsers(prev => prev.filter(u => u.id !== id));

        } catch (err) {
            console.error("Gagal hapus user:", err);
        }
    };

    const handleAddUser = async (newUser) => {
        try {
            const res = await fetch("http://192.168.2.20:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`
                },
                body: JSON.stringify(newUser)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            setUsers(prev => [...prev, data.user]);
            setShowModal(false);

        } catch (err) {
            console.error("Gagal tambah user:", err);
        }
    };

    const handleUpdateUser = async (updatedUser) => {
        try {
            const res = await fetch(
                `http://192.168.2.20:5000/api/users/${updatedUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authData.token}`
                    },
                    body: JSON.stringify(updatedUser)
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            setUsers(prev =>
                prev.map(u => u.id === updatedUser.id ? data.user : u)
            );

            setEditingUser(null);

        } catch (err) {
            console.error("Gagal update user:", err);
        }
    };

    useEffect(() => {
        if (!authData?.token) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch("http://192.168.2.20:5000/api/profile", {
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

            <div className="main-content">
                <header className="content-header">
                    <div className="header-left">
                        <h1>Manajemen User</h1>
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

                <div className="manajemen-page">

                    <div className="manajemen-toolbar">
                        <div className="manajemen-actions">
                            <button
                                className="btn-primary"
                                onClick={() => setShowModal(true)}
                            >
                                + Tambah User
                            </button>
                        </div>

                        <div className="manajemen-search">
                            <img src={searchIcon} alt="search" />
                            <input
                                placeholder="Cari user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="manajemen-table-wrapper">
                        <table className="manajemen-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>No.Telp</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Role</th>
                                    <th>Kode Referral</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            style={{
                                                textAlign: "center",
                                                padding: "30px",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            Belum ada user
                                        </td>
                                    </tr>
                                ) : (
                                    currentUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.nama || u.name || u.username}</td>
                                            <td>{u.phone || "-"}</td>
                                            <td>{u.username || "-"}</td>

                                            {/* PASSWORD: jangan tampilkan password dari server */}
                                            <td>
                                                <div className="password-cell">
                                                    <span>••••••••</span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className={`role-badge ${u.role}`}>
                                                    {u.role}
                                                </span>
                                            </td>

                                            {/* referral_code dari backend */}
                                            <td>{u.referral_code || "-"}</td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => setEditingUser(u)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(u.id)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>

                    <div className="manajemen-footer">
                        <span>
                            {filteredUsers.length === 0
                                ? "Ditampilkan 0 dari 0 data"
                                : `Ditampilkan ${indexOfFirstUser + 1} - ${Math.min(
                                    indexOfLastUser,
                                    filteredUsers.length
                                )} dari ${filteredUsers.length} data`}
                        </span>

                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
                {showModal && (
                    <AddUser
                        onClose={() => setShowModal(false)}
                        onSave={handleAddUser}
                    />
                )}

                {editingUser && (
                    <EditUser
                        user={editingUser}
                        onClose={() => setEditingUser(null)}
                        onUpdate={handleUpdateUser}
                    />
                )}

            </div>
        </div>
    );


}
