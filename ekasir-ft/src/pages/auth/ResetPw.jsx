import "../../assets/css/auth.css";
import illustration from "../../assets/img/password.png";
import logo from "../../assets/img/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import eyeOpen from "../../assets/icons/view.png";
import eyeClose from "../../assets/icons/hidden.png";
import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ResetPw() {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword } = useAuth();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputsRef = useRef([]);

    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    const handleOtpChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleSubmit = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 4) {
            alert("OTP harus 4 digit");
            return;
        }

        if (!password || !confirm) {
            alert("Password wajib diisi");
            return;
        }

        if (password !== confirm) {
            alert("Konfirmasi password tidak sama");
            return;
        }

        setLoading(true);

        const result = await resetPassword({
            email,
            otp: otpCode,
            newPassword: password,
        });

        setLoading(false);

        if (!result.success) {
            alert(result.message);
            return;
        }

        navigate("/reset-succes");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-left">
                <img src={illustration} alt="reset-password" />
            </div>

            <div className="auth-right">
                <img src={logo} alt="logo" className="auth-logo" />

                <div className="auth-card">
                    <h2>Masukan kata sandi baru</h2>
                    <p>Masukkan OTP dan kata sandi baru Anda</p>

                    {/* OTP INPUT */}
                    <div className="auth-group">
                        <label>Kode OTP</label>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {otp.map((v, i) => (
                                <input
                                    key={i}
                                    maxLength="1"
                                    value={v}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    onChange={(e) =>
                                        handleOtpChange(e.target.value, i)
                                    }
                                    style={{
                                        width: "50px",
                                        textAlign: "center",
                                        fontSize: "18px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="auth-group">
                        <label>Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <img
                                src={showPassword ? eyeOpen : eyeClose}
                                alt="toggle"
                                className="password-icon"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            />
                        </div>
                    </div>

                    {/* CONFIRM */}
                    <div className="auth-group">
                        <label>Konfirmasi Kata Sandi</label>
                        <div className="auth-password">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Ulangi kata sandi"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                            <img
                                src={showConfirm ? eyeOpen : eyeClose}
                                alt="toggle"
                                className="password-icon"
                                onClick={() =>
                                    setShowConfirm(!showConfirm)
                                }
                            />
                        </div>
                    </div>

                    <button
                        className="auth-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Reset kata sandi"}
                    </button>

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
