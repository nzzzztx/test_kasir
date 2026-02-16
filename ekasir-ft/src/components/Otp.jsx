import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

export default function OtpModal({ email, onClose }) {
    const navigate = useNavigate();
    const { verifyOtp } = useAuth();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(300);
    const [canResend, setCanResend] = useState(false);

    const inputsRef = useRef([]);

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

        // auto focus ke input berikutnya
        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");

        if (code.length !== 4) {
            alert("OTP harus 4 digit");
            return;
        }

        const result = await verifyOtp({ email, otp: code });

        if (!result.success) {
            alert(result.message);
            return;
        }

        onClose();

        navigate("/register-password", { state: { email } });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="otp-overlay">
            <div className="otp-card">
                <h3>Verifikasi Email</h3>

                <p className="otp-desc">
                    Masukkan 4 digit kode yang dikirim ke <b>{email}</b>
                </p>

                <div className="otp-inputs">
                    {otp.map((v, i) => (
                        <input
                            key={i}
                            maxLength="1"
                            value={v}
                            ref={(el) => (inputsRef.current[i] = el)}
                            onChange={(e) =>
                                handleChange(e.target.value, i)
                            }
                        />
                    ))}
                </div>

                <p className="otp-resend">
                    {canResend
                        ? "OTP kadaluarsa, silakan daftar ulang."
                        : `Berlaku selama ${formatTime(timeLeft)}`}
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
