import { useState } from "react";
import "../../assets/css/shift-modal.css";

const AkhiriShiftModal = ({
    open,
    saldoSistem = 0,
    onClose,
    onSubmit,
}) => {
    const [saldoAkhir, setSaldoAkhir] = useState("");
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const numericSaldo = Number(saldoAkhir);
    const isInvalid =
        !saldoAkhir ||
        isNaN(numericSaldo) ||
        numericSaldo < 0;

    const selisih =
        !isNaN(numericSaldo)
            ? numericSaldo - saldoSistem
            : 0;

    const handleSubmit = async () => {
        if (isInvalid) {
            return alert("Saldo akhir harus berupa angka valid");
        }

        try {
            setLoading(true);
            await onSubmit({
                saldoAkhir: numericSaldo,
                note: note || null,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="shift-modal">
                <div className="shift-modal-header">
                    <h3>Akhiri Shift</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="shift-modal-body">
                    <div className="info-row">
                        <span>Saldo Sistem</span>
                        <strong>
                            Rp {saldoSistem.toLocaleString("id-ID")}
                        </strong>
                    </div>

                    <div className="form-group">
                        <label>
                            Masukkan saldo fisik di cash drawer
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={saldoAkhir}
                            onChange={(e) =>
                                setSaldoAkhir(e.target.value)
                            }
                            placeholder="Rp 0"
                        />

                        {isInvalid && (
                            <div className="error-text">
                                Saldo akhir wajib diisi
                            </div>
                        )}
                    </div>

                    {!isInvalid && (
                        <div
                            className={`info-row ${selisih === 0
                                    ? "match"
                                    : selisih > 0
                                        ? "lebih"
                                        : "kurang"
                                }`}
                        >
                            <span>Selisih</span>
                            <strong>
                                Rp {selisih.toLocaleString("id-ID")}
                            </strong>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Catatan (opsional)</label>
                        <textarea
                            placeholder="Tambahkan keterangan jika ada selisih"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className="btn-primary btn-danger btn-full"
                    onClick={handleSubmit}
                    disabled={isInvalid || loading}
                >
                    {loading ? "Memproses..." : "Akhiri Shift"}
                </button>
            </div>
        </div>
    );
};

export default AkhiriShiftModal;