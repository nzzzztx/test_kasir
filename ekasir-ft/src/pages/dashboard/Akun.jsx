import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import ProfileEditModal from "../../components/Akun/ProfileEditModal";

import "../../assets/css/dashboard.css";
import "../../assets/css/akun.css";
import userDummy from "../../assets/img/Profile.png";

const API = "http://localhost:5000/api";

const Akun = () => {
    const [showEdit, setShowEdit] = useState(false);
    const { authData } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API}/profile`, {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                });

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Gagal ambil profile:", err);
            }
        };

        if (authData?.token) {
            fetchProfile();
        }
    }, [authData]);

    const handleSaveProfile = async (updated) => {
        try {
            const res = await fetch(`${API}/profile/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(updated),
            });

            const data = await res.json();

            if (res.ok) {
                setUser({ ...user, ...updated });
                setShowEdit(false);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Gagal update profile:", err);
        }
    };

    if (!user) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="main-content">
                    <p style={{ padding: "20px" }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                <div className="akun-page">
                    <div className="akun-card">
                        <div className="akun-avatar">
                            <img
                                src={user.avatar || userDummy}
                                alt="avatar"
                            />
                        </div>

                        <div className="akun-info">
                            <div className="akun-row">
                                <span>Nama</span>
                                <b>{user.nama}</b>
                            </div>

                            <div className="akun-row">
                                <span>Role User</span>
                                <b>{user.role}</b>
                            </div>

                            <div className="akun-row">
                                <span>Email</span>
                                <b>{user.email}</b>
                            </div>

                            <div className="akun-row">
                                <span>Telepon</span>
                                <b>{user.phone}</b>
                            </div>

                            <div className="akun-row">
                                <span>Alamat</span>
                                <b>{user.address}</b>
                            </div>
                        </div>

                        <button
                            className="akun-edit-btn"
                            onClick={() => setShowEdit(true)}
                        >
                            Edit Profil
                        </button>
                    </div>
                </div>

                {showEdit && (
                    <ProfileEditModal
                        user={user}
                        onClose={() => setShowEdit(false)}
                        onSave={handleSaveProfile}
                    />
                )}
            </div>
        </div>
    );
};

export default Akun;
