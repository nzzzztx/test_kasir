import { useState } from "react";
import { getCurrentOwnerId } from "../../utils/owner";

import viewIcon from "../../assets/icons/view.png";
import hiddenIcon from "../../assets/icons/hidden.png";

export default function AddUser({ onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        username: "",
        password: "",
        role: "kasir",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if (!form.username || !form.password) {
            alert("Username dan password wajib diisi");
            return;
        }

        if (form.password.length < 8) {
            alert("Password minimal 8 karakter");
            return;
        }

        const ownerId = getCurrentOwnerId();

        if (!ownerId) {
            alert("Owner tidak ditemukan");
            return;
        }

        const STORAGE_KEY = `users_owner_${ownerId}`;
        const existingUsers =
            JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        const usernameExists = existingUsers.some(
            u => u.username.toLowerCase() === form.username.toLowerCase()
        );

        if (usernameExists) {
            alert("Username sudah digunakan");
            return;
        }

        if (!form.role) {
            alert("Role wajib dipilih");
            return;
        }

        const counterKey = `user_counter_${ownerId}`;
        const lastNumber =
            Number(localStorage.getItem(counterKey) || 0) + 1;

        localStorage.setItem(counterKey, lastNumber);

        const referralCode =
            `USR-${ownerId}-${String(lastNumber).padStart(4, "0")}`;

        const newUser = {
            id: Date.now(),
            ownerId: ownerId,
            name: form.name || form.username,
            phone: form.phone || "-",
            username: form.username,
            password: form.password,
            role: form.role,
            referralCode: referralCode,
            otpVerified: true,
            createdAt: new Date().toISOString(),
        };

        onSave(newUser);
    };


    return (
        <div className="manajemen-modal-overlay">
            <div className="manajemen-modal-card">
                <h3>Tambah User</h3>

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
                    Simpan
                </button>

                <button className="btn-outline btn-center" onClick={onClose}>
                    Batal
                </button>
            </div>
        </div>
    );
}
