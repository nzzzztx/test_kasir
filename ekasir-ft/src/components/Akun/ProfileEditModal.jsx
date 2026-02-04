import { useState, useEffect } from "react";

const ProfileEditModal = ({ user, onClose, onSave }) => {
    const [form, setForm] = useState({ ...user });

    useEffect(() => {
        setForm({ ...user });
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatar = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setForm(prev => ({
                ...prev,
                avatar: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="akun-edit-overlay">
            <div className="akun-edit-modal">
                <div className="akun-edit-header">
                    <h3>Edit Profil</h3>
                    <button className="akun-edit-close" onClick={onClose}>×</button>
                </div>

                <div className="akun-edit-body">
                    <div className="akun-edit-avatar">
                        <img src={form.avatar} alt="avatar" />
                        <label className="akun-edit-avatar-btn">
                            Ganti Foto
                            <input type="file" hidden accept="image/*" onChange={handleAvatar} />
                        </label>
                    </div>

                    <div className="akun-edit-group">
                        <label>Nama</label>
                        <input name="name" value={form.name} onChange={handleChange} />
                    </div>

                    <div className="akun-edit-group">
                        <label>Role</label>
                        <input name="role" value={form.role} onChange={handleChange} />
                    </div>

                    <div className="akun-edit-group">
                        <label>Email</label>
                        <input name="email" value={form.email} onChange={handleChange} />
                    </div>

                    <div className="akun-edit-group">
                        <label>Telepon</label>
                        <input name="phone" value={form.phone} onChange={handleChange} />
                    </div>

                    <div className="akun-edit-group">
                        <label>Alamat</label>
                        <textarea name="address" value={form.address} onChange={handleChange} />
                    </div>
                </div>

                <button className="akun-edit-submit" onClick={() => onSave(form)}>
                    Simpan Perubahan
                </button>
            </div>
        </div>
    );
};

export default ProfileEditModal;
