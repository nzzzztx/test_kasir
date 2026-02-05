import "../../assets/css/auth.css";
import illustration from "../../assets/img/password.png";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

export default function PwNotif() {
    const navigate = useNavigate();

    const email =
        localStorage.getItem("reset_email") || "email@example.com";

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="pw-notif" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Periksa email anda</h2>
                    <p>
                        Kami mengirim tautan pengaturan ulang kata sandi ke
                        <br />
                        <strong>{email}</strong>
                    </p>

                    <button
                        className="auth-btn"
                        onClick={() => navigate("/reset-password")}
                    >
                        Verifikasi kata sandi
                    </button>

                    <p style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>
                        Belum menerima email?{" "}
                        <span
                            style={{ color: "var(--orange)", cursor: "pointer" }}
                            onClick={() => alert("Email dikirim ulang 📧")}
                        >
                            kirim ulang
                        </span>
                    </p>

                    <div className="auth-link">
                        <span onClick={() => navigate("/login")}>
                            ← Kembali ke login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
