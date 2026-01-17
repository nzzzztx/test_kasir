import { useNavigate } from "react-router-dom";

export default function OtpModal({ onClose }) {
    const navigate = useNavigate();

    const handleVerify = () => {
        onClose();
        navigate("/register-password");
    };

    return (
        <div className="otp-overlay">
            <div className="otp-card">
                <h3>Verifikasi Nomor</h3>

                <p className="otp-desc">
                    Masukkan 4 digit kode verifikasi yang telah dikirimkan
                    melalui SMS ke 081******891
                </p>

                <div className="otp-inputs">
                    <input maxLength="1" />
                    <input maxLength="1" />
                    <input maxLength="1" />
                    <input maxLength="1" />
                </div>

                <p className="otp-resend">
                    Belum menerima kode? <span>Kirim ulang</span> (01:00)
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
