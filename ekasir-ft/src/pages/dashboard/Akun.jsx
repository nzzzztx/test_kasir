import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import ProfileEditModal from "../../components/Akun/ProfileEditModal";

import "../../assets/css/dashboard.css";
import "../../assets/css/akun.css";

import userDummy from "../../assets/img/user1.png";

const Akun = () => {
    const [showEdit, setShowEdit] = useState(false);

    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user_profile");
        return saved
            ? JSON.parse(saved)
            : {
                name: "Suryono Sukamto",
                role: "Admin",
                email: "sukamtosur@gmail.com",
                phone: "+62 878 3464 2544",
                address: "Ujung Kulon, Purwokerto Tenggara",
                referral: "AH7KA891",
                avatar: userDummy,
            };
    });

    const handleSaveProfile = (updated) => {
        const newUser = { ...user, ...updated };
        setUser(newUser);
        localStorage.setItem("user_profile", JSON.stringify(newUser));
        setShowEdit(false);
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">
                <div className="akun-page">
                    <div className="akun-card">
                        <div className="akun-avatar">
                            <img src={user.avatar} alt="avatar" />
                        </div>

                        <div className="akun-info">
                            <div className="akun-row">
                                <span>Nama</span>
                                <b>{user.name}</b>
                            </div>

                            <div className="akun-row">
                                <span>Kode Referral</span>
                                <b>{user.referral}</b>
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
