import "../../assets/css/auth.css";
import illustration from "../../assets/img/password.png";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";
import { useState } from "react";

export default function ResetPw() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="reset-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Masukan kata sandi baru</h2>
                    <p>Kamu dapat masuk sebagai owner ataupun staf</p>

                    <div className="auth-group">
                        <label>Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi"
                            />
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                alt="toggle"
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
                            />
                            <img
                                src={showConfirm ? eyeOpen : eyeClose}
                                alt="toggle"
                                className="password-icon"
                                onClick={() => setShowConfirm(!showConfirm)}
                            />
                        </div>
                    </div>

                    <button
                        className="auth-btn"
                        onClick={() => navigate("/reset-succes")}
                    >
                        Reset kata sandi
                    </button>

                    <div className="auth-link">
                        <span onClick={() => navigate("/login")}>← Kembali ke login</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
