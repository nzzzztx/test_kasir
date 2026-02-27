import { useState } from "react";
import "../../assets/css/shift-modal.css";

const TambahCatatanModal = ({ open, onClose, onSubmit }) => {
    const [type, setType] = useState("IN");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        const numericAmount = Number(amount);

        if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
            return alert("Jumlah harus berupa angka lebih dari 0");
        }

        onSubmit({
            type,
            amount: numericAmount,
            note: note || null,
        });

        // reset form saja, jangan close modal di sini
        setAmount("");
        setNote("");
    };

    return (
        <div className="modal-overlay">
            <div className="catatan-modal">
                <div className="modal-header">
                    <h4>Tambah Catatan</h4>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="catatan-tabs">
                    <button
                        className={type === "IN" ? "active" : ""}
                        onClick={() => setType("IN")}
                    >
                        Saldo Masuk Lain
                    </button>
                    <button
                        className={type === "OUT" ? "active" : ""}
                        onClick={() => setType("OUT")}
                    >
                        Saldo Keluar Lain
                    </button>
                </div>

                <div className="form-group">
                    <label>Jumlah</label>
                    <input
                        type="number"
                        min="1"
                        placeholder="Rp 0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Catatan</label>
                    <textarea
                        placeholder="Tambahkan keterangan"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <button className="btn-primary" onClick={handleSubmit}>
                    Simpan
                </button>
            </div>
        </div>
    );
};

export default TambahCatatanModal;