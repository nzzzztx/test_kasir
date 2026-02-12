import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function OtpModal({ onClose }) {
    const navigate = useNavigate();
    const { verifyOtp, pendingUser } = useAuth();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };

    const handleVerify = () => {
        const code = otp.join("");

        const result = verifyOtp(code);

        if (!result.success) {
            alert(result.message);
            return;
        }

        onClose();
        navigate("/register-password");
    };

    const handleResend = () => {
        setOtp(["", "", "", ""]);
        setTimeLeft(60);
        setCanResend(false);

        alert("OTP dikirim ulang (dummy: 1234)");
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    return (
        <div className="otp-overlay">
            <div className="otp-card">
                <h3>Verifikasi Nomor</h3>

                <p className="otp-desc">
                    Masukkan 4 digit kode verifikasi yang dikirim ke{" "}
                    <b>{pendingUser?.phone || "-"}</b>
                </p>

                <div className="otp-inputs">
                    {otp.map((v, i) => (
                        <input
                            key={i}
                            maxLength="1"
                            value={v}
                            onChange={(e) =>
                                handleChange(e.target.value, i)
                            }
                        />
                    ))}
                </div>

                <p className="otp-resend">
                    {canResend ? (
                        <>
                            Belum menerima kode?{" "}
                            <span onClick={handleResend}>Kirim ulang</span>
                        </>
                    ) : (
                        <>
                            Belum menerima kode? Kirim ulang ({formatTime(timeLeft)})
                        </>
                    )}
                </p>

                <div className="otp-actions">
                    <button className="otp-cancel" onClick={onClose}>
                        Batal
                    </button>
                    <button className="otp-submit" onClick={handleVerify}>
                        Verifikasi
                    </button>
                </div>
            </div>
        </div>
    );
}
