import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import { useState } from "react";
import OtpModal from "../../components/Otp";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const [showOtp, setShowOtp] = useState(false);
    const { register } = useAuth();

    const [form, setForm] = useState({
        email: "",
        phone: "",
    });

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="register" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />
                <div className="auth-card">
                    <h2>Buat Akun Anda</h2>
                    <p>Selamat datang! Silakan masukkan informasi Anda</p>

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

                        <div className="auth-otp-row">
                            <input
                                type="text"
                                placeholder="Nomor Telepon"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                            />
                            <button
                                className="auth-otp-btn"
                                onClick={() => {
                                    if (!form.email || !form.phone) {
                                        alert("Email dan nomor telepon wajib diisi");
                                        return;
                                    }

                                    register({
                                        email: form.email,
                                        phone: form.phone,
                                        name: "Kasir",
                                    });

                                    setShowOtp(true);
                                }}
                            >
                                Kirim OTP
                            </button>
                        </div>
                    </div>

                    <div className="auth-checkbox">
                        <input type="checkbox" id="agree" />
                        <label htmlFor="agree">
                            Dengan mendaftar, saya menyetujui{" "}
                            <span>Ketentuan Layanan</span> &{" "}
                            <span>Kebijakan Privasi</span>
                        </label>
                    </div>

                    <button
                        className="auth-btn"
                        onClick={() => {
                            alert("Silakan verifikasi OTP terlebih dahulu");
                        }}
                    >
                        Daftar
                    </button>

                    <div className="auth-link">
                        Sudah punya akun? <span onClick={() => navigate("/login")}>Masuk</span>
                    </div>

                    {showOtp && <OtpModal onClose={() => setShowOtp(false)} />}
                </div>
            </div>
        </div>
    );
}



