import { useNavigate } from "react-router-dom";
import "../../assets/css/auth.css";
import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import { useAuth } from "../../context/AuthContext";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";
import { useState } from "react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login("admin@gmail.com", "123456");
        navigate("/dashboard");
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="login" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Masuk ke Akun Anda</h2>
                    <p>Kamu dapat masuk sebagai owner ataupun staf</p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input type="email" placeholder="Email" />
                    </div>

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

                    <div className="auth-forgot">
                        <span onClick={() => navigate("/forgot-password")}>
                            Lupa kata sandi?
                        </span>
                    </div>

                    <button className="auth-btn" onClick={handleLogin}>
                        Masuk
                    </button>

                    {/* <button className="auth-btn" onClick={() => navigate("/dashboard")}>
                        Masuk
                    </button> */}

                    <div className="auth-link">
                        Belum punya akun?{" "}
                        <span onClick={() => navigate("/register")}>Daftar</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
