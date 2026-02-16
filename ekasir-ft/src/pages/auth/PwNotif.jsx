import "../../assets/css/auth.css";
import illustration from "../../assets/img/password.png";
import logo from "../../assets/img/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function PwNotif() {
    const navigate = useNavigate();
    const location = useLocation();
    const { forgotPassword } = useAuth();

    const email = location.state?.email || "";
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        if (!email) return;

        setLoading(true);
        await forgotPassword(email);
        setLoading(false);

        alert("OTP dikirim ulang 📧");
    };

    if (!email) {
        return navigate("/forgot-password");
    }

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
                        Kami mengirim kode OTP ke <br />
                        <strong>{email}</strong>
                    </p>

                    <button
                        className="auth-btn"
                        onClick={() =>
                            navigate("/reset-password", {
                                state: { email },
                            })
                        }
                    >
                        Verifikasi kata sandi
                    </button>

                    <p style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>
                        Belum menerima email?{" "}
                        <span
                            style={{
                                color: "var(--orange)",
                                cursor: "pointer",
                            }}
                            onClick={handleResend}
                        >
                            {loading ? "Mengirim..." : "kirim ulang"}
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
