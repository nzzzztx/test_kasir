import { useState } from "react";
import "../../assets/css/shift-modal.css";

const TambahCatatanModal = ({ open, onClose, onSubmit }) => {
    const [type, setType] = useState("IN");
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!amount) return alert("Jumlah wajib diisi");

        onSubmit({
            type,
            amount: Number(amount),
            note,
            createdAt: new Date().toISOString(),
        });

        setAmount("");
        setNote("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="catatan-modal">
                <div className="modal-header">
                    <h4>Tambah catatan</h4>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="catatan-tabs">
                    <button
                        className={type === "IN" ? "active" : ""}
                        onClick={() => setType("IN")}
                    >
                        Saldo masuk lain
                    </button>
                    <button
                        className={type === "OUT" ? "active" : ""}
                        onClick={() => setType("OUT")}
                    >
                        Saldo keluar lain
                    </button>
                </div>

                <div className="form-group">
                    <label>Jumlah</label>
                    <input
                        placeholder="Rp 0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Tambahkan catatan singkat</label>
                    <textarea
                        placeholder="Tambah keterangan"
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
