import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import ProfileEditModal from "../../components/Akun/ProfileEditModal";

import "../../assets/css/dashboard.css";
import "../../assets/css/akun.css";

import userDummy from "../../assets/img/Profile.png";

const Akun = () => {
    const [showEdit, setShowEdit] = useState(false);
    const { authData } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!authData) return;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = users.find(u => u.id === authData.id);

        if (currentUser) {
            setUser(currentUser);
        }
    }, [authData]);

    const handleSaveProfile = (updated) => {
        const newUser = {
            ...updated,
            avatar: updated.avatar || user.avatar || userDummy,
        };

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const updatedUsers = users.map(u =>
            u.id === authData.id ? newUser : u
        );

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUser(newUser);
        setShowEdit(false);
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
                                <b>{user.name}</b>
                            </div>

                            <div className="akun-row">
                                <span>Kode Referral</span>
                                <b>{user.referralCode}</b>
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
