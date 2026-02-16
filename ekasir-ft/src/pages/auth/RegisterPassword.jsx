import "../../assets/css/auth.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";

export default function RegisterPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setPasswordAfterOtp } = useAuth();

    const email = location.state?.email;

    const [password, setPasswordInput] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Kalau masuk tanpa email → redirect
    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleSubmit = async () => {
        if (!password || !confirm) {
            alert("Password wajib diisi");
            return;
        }

        if (password !== confirm) {
            alert("Konfirmasi password tidak sama");
            return;
        }

        setLoading(true);

        const result = await setPasswordAfterOtp(password);

        setLoading(false);

        if (!result.success) {
            alert(result.message);
            return;
        }

        alert("Akun berhasil dibuat, silakan login");
        navigate("/login");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="register-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Buat Password</h2>
                    <p>Lengkapi kata sandi untuk menyelesaikan pendaftaran</p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input type="email" value={email} disabled />
                    </div>

                    <div className="auth-group">
                        <label>Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi"
                                value={password}
                                onChange={(e) => setPasswordInput(e.target.value)}
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

                    <button
                        className="auth-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Daftar"}
                    </button>

                    <div className="auth-link">
                        Sudah punya akun?{" "}
                        <span onClick={() => navigate("/login")}>
                            Masuk
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
