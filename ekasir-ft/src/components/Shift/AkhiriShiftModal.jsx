import { useState } from "react";
import "../../assets/css/shift-modal.css";

const AkhiriShiftModal = ({
    open,
    saldoSistem,
    onClose,
    onSubmit,
}) => {
    const [saldoAkhir, setSaldoAkhir] = useState("");
    const [note, setNote] = useState("");

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="shift-modal">
                <div className="shift-modal-header">
                    <h3>Akhiri shift</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="shift-modal-body">
                    <div className="info-row">
                        <span>Saldo yang diterima sistem</span>
                        <strong>Rp {saldoSistem.toLocaleString("id-ID")}</strong>
                    </div>

                    <div className="form-group">
                        <label>Masukkan saldo akhir yang diterima di cash drawer</label>
                        <input
                            // type="number"
                            value={saldoAkhir}
                            onChange={(e) => setSaldoAkhir(e.target.value)}
                            placeholder="Rp 0"
                        />
                        {!saldoAkhir && (
                            <div className="error-text">Masukkan data terakhir</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Tambahkan catatan singkat</label>
                        <textarea
                            placeholder="Ketik disini..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="btn-primary btn-danger btn-full"
                    onClick={() => onSubmit({ saldoAkhir, note })}
                >
                    Akhiri shift
                </button>
            </div>
        </div>
    );
};

export default AkhiriShiftModal;
