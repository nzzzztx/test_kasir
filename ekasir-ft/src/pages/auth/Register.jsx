import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import { useState } from "react";
import OtpModal from "../../components/Otp";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        phone: "",
    });

    const handleRegister = async () => {
        if (!form.email || !form.phone) {
            alert("Email dan nomor telepon wajib diisi");
            return;
        }

        setLoading(true);

        const result = await register(form);

        setLoading(false);

        if (!result.success) {
            alert(result.message);
            return;
        }

        setShowOtp(true);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="register" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />
                <div className="auth-card">
                    <h2>Buat Akun Anda</h2>
                    <p>Masukkan email dan nomor telepon untuk verifikasi</p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="auth-group">
                        <label>Nomor Telepon</label>
                        <input
                            type="text"
                            placeholder="Nomor telepon"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />
                    </div>

                    <button
                        className="auth-btn"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Kirim OTP"}
                    </button>

                    <div className="auth-link">
                        Sudah punya akun?{" "}
                        <span onClick={() => navigate("/login")}>
                            Masuk
                        </span>
                    </div>

                    {showOtp && (
                        <OtpModal
                            email={form.email}
                            onClose={() => setShowOtp(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
