import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../assets/css/auth.css";
import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import { useAuth } from "../../context/AuthContext";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const { login, authData } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        identifier: "",
        password: "",
    });

    useEffect(() => {
        if (authData?.token) {
            navigate("/dashboard");
        }
    }, [authData]);

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!form.identifier || !form.password) {
            alert("Username/Email dan password wajib diisi");
            return;
        }

        setLoading(true);

        const result = await login(form.identifier, form.password);

        setLoading(false);

        if (!result.success) {
            alert(result.message);
            return;
        }

        navigate("/dashboard");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="login" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Masuk ke Akun Anda</h2>
                    <p>Kamu dapat masuk sebagai owner, kasir ataupun gudang</p>

                    <div className="auth-group">
                        <label>Email/Username</label>
                        <input
                            type="text"
                            placeholder="Masukan Email atau Username anda"
                            value={form.identifier}
                            onChange={(e) =>
                                setForm({ ...form, identifier: e.target.value })
                            }
                        />
                    </div>

                    <div className="auth-group">
                        <label>Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
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

                    <button className="auth-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? "Memproses..." : "Masuk"}
                    </button>

                    <div className="auth-link">
                        Belum punya akun?{" "}
                        <span onClick={() => navigate("/register")}>Daftar</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
