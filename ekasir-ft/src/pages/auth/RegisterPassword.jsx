import "../../assets/css/auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import illustration from "../../assets/img/depan.png";
import logo from "../../assets/img/logo.png";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";

export default function RegisterPassword() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="register-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Buat Akun Anda</h2>
                    <p>Lengkapi kata sandi untuk menyelesaikan pendaftaran</p>

                    <div className="auth-group">
                        <label>Email</label>
                        <input type="email" value="skyp00king@gmail.com" disabled />
                    </div>

                    <div className="auth-group">
                        <label>Nomor Telepon</label>
                        <input type="text" value="08123456789" disabled />
                    </div>

                    {/* PASSWORD */}
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

                    {/* KONFIRMASI */}
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

                    <div className="auth-checkbox">
                        <input type="checkbox" id="agree2" defaultChecked />
                        <label htmlFor="agree2">
                            Dengan mendaftar, saya menyetujui{" "}
                            <span>Ketentuan Layanan</span> &{" "}
                            <span>Kebijakan Privasi</span>
                        </label>
                    </div>

                    <button className="auth-btn">Daftar</button>

                    <div className="auth-link">
                        Sudah punya akun?{" "}
                        <span onClick={() => navigate("/login")}>Masuk</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
