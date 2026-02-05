import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import illustration from "../../assets/img/password.png";
import { useState } from "react";

export default function ForgotPw() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleReset = () => {
        if (!email) {
            alert("Email wajib diisi");
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
                        Jangan khawatir, kami akan mengirimkan petunjuk
                        pengaturan ulang kepada anda.
                    </p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Masukkan email anda"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

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
