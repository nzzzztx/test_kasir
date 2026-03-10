import { useState } from "react";
import viewIcon from "../../assets/icons/view.png";
import hiddenIcon from "../../assets/icons/hidden.png";

export default function EditUser({ user, onClose, onUpdate }) {

    const [form, setForm] = useState({
        id: user.id,
        nama: user.nama,
        phone: user.phone,
        username: user.username,
        role: user.role,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {

        if (!form.nama.trim()) {
            alert("Nama wajib diisi");
            return;
        }

        if (!form.username.trim()) {
            alert("Username wajib diisi");
            return;
        }

        if (!form.password) {
            alert("Password wajib diisi");
            return;
        }

        if (form.password.length < 8) {
            alert("Password minimal 8 karakter");
            return;
        }

        if (!form.role) {
            alert("Role wajib dipilih");
            return;
        }

        onSave(form);
    };


    return (
        <div className="manajemen-modal-overlay">
            <div className="manajemen-modal-card">

                <h3>Edit User</h3>

                <div className="form-group">
                    <label>Nama</label>
                    <input
                        value={form.nama}
                        onChange={(e) =>
                            setForm({ ...form, nama: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>No Telepon</label>
                    <input
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input
                        value={form.username}
                        disabled
                    />
                </div>

                <div className="form-group">
                    <label>Role</label>
                    <select
                        value={form.role}
                        onChange={(e) =>
                            setForm({ ...form, role: e.target.value })
                        }
                    >
                        <option value="kasir">Kasir</option>
                        <option value="gudang">Gudang</option>
                    </select>
                </div>

                <button className="btn-submit" onClick={handleSubmit}>
                    Update
                </button>

                <button className="btn-outline btn-center" onClick={onClose}>
                    Batal
                </button>

            </div>
        </div>
    );
}