import "../../assets/css/auth.css";
import illustration from "../../assets/img/password.png";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

export default function ResetPwSucces() {
    const navigate = useNavigate();
    const handleContinue = () => {
        localStorage.removeItem("reset_email");
        navigate("/login");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="success" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Reset kata sandi</h2>
                    <p>
                        Kata sandi anda telah berhasil direset.
                        <br />
                        Klik di bawah untuk melihat.
                    </p>

                    <button className="auth-btn" onClick={handleContinue}>
                        Lanjutkan
                    </button>

                    <div className="auth-link">
                        <span onClick={() => navigate("/login")}>← Kembali ke login</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
