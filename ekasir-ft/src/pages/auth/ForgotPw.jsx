import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import illustration from "../../assets/img/password.png";
import { useState } from "react";

export default function ForgotPw() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = () => {
        if (!email) {
            setError("Email wajib diisi");
            setMessage("");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.email === email);

        if (!user) {
            setError("Email tidak ditemukan");
            setMessage("");
            return;
        }

        if (user.role !== "owner") {
            setError("");
            setMessage("Silakan hubungi pemilik toko untuk reset password");
            return;
        }

        localStorage.setItem("reset_email", email);
        navigate("/password-notification");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="lupa-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Lupa kata sandi?</h2>
                    <p>
                        Fitur ini hanya tersedia untuk akun owner.
                        Jika Anda adalah staf, silakan hubungi pemilik toko.
                    </p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Masukkan email anda"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                                setMessage("");
                            }}
                        />
                        <p style={{ fontSize: "13px", color: "#888" }}>
                            Reset password hanya berlaku untuk akun owner
                        </p>
                    </div>

                    {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                            {error}
                        </p>
                    )}

                    {message && (
                        <p style={{ color: "#ff6a00", fontSize: "14px" }}>
                            {message}
                        </p>
                    )}

                    <button className="auth-btn" onClick={handleReset}>
                        Reset kata sandi
                    </button>

                    <div className="auth-link">
                        <span onClick={() => navigate("/login")}>
                            &larr; Kembali ke login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
