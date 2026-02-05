import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";

export default function RegisterPassword() {
    const navigate = useNavigate();
    const { authData, login } = useAuth();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = () => {
        if (!password || !confirm) {
            alert("Password wajib diisi");
            return;
        }

        if (password !== confirm) {
            alert("Konfirmasi password tidak sama");
            return;
        }

        login(authData.email, password);

        navigate("/dashboard");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="register-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Buat Akun Anda</h2>
                    <p>Lengkapi kata sandi untuk menyelesaikan pendaftaran</p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input type="email" value={authData.email} disabled />
                    </div>

                    <div className="auth-group">
                        <label>Nomor Telepon</label>
                        <input type="text" value={authData.phone} disabled />
                    </div>

                    <div className="auth-group">
                        <label>Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                className="password-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            />
                        </div>
                    </div>

                    <div className="auth-group">
                        <label>Konfirmasi Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Ulangi kata sandi"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            <img
                                src={showConfirm ? eyeOpen : eyeClose}
                                className="password-icon"
                                onClick={() => setShowConfirm(!showConfirm)}
                            />
                        </div>
                    </div>

                    <button className="auth-btn" onClick={handleSubmit}>
                        Daftar
                    </button>

                    <div className="auth-link">
                        Sudah punya akun?{" "}
                        <span onClick={() => navigate("/login")}>Masuk</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
