import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import illustration from "../../assets/img/password.png";

export default function ForgotPw() {
    const navigate = useNavigate();

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
                        />
                    </div>

                    <button
                        className="auth-btn"
                        onClick={() => navigate("/password-notification")}
                    >
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
