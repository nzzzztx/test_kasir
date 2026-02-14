import { useState } from "react";
import viewIcon from "../../assets/icons/view.png";
import hiddenIcon from "../../assets/icons/hidden.png";

export default function EditUser({ user, onClose, onUpdate }) {
    const [form, setForm] = useState({ ...user });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if (!form.username) {
            alert("Username wajib diisi");
            return;
        }

        if (form.password && form.password.length < 8) {
            alert("Password minimal 8 karakter");
            return;
        }

        onUpdate(form);
    };

    return (
        <div className="manajemen-modal-overlay">
            <div className="manajemen-modal-card">
                <h3>Edit User</h3>

                <div className="form-group">
                    <label>Nama</label>
                    <input
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
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
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />
                </div>

                <div className="form-group password-wrapper">
                    <label>Password</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />

                        <button
                            type="button"
                            className="btn-eye"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            <img
                                src={showPassword ? hiddenIcon : viewIcon}
                                alt="toggle password"
                                className="eye-icon"
                            />
                        </button>
                    </div>
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
