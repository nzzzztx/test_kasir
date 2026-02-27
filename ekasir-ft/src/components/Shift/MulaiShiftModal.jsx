import { useState } from "react";
import "../../assets/css/shift-modal.css";

const MulaiShiftModal = ({
    open,
    cashier,
    drawers = [],
    saldoAwal,
    setSaldoAwal,
    selectedDrawer,
    setSelectedDrawer,
    onClose,
    onSubmit,
}) => {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleStart = async () => {
        const numericSaldo = Number(saldoAwal);

        if (!saldoAwal || isNaN(numericSaldo) || numericSaldo <= 0) {
            return alert("Saldo awal harus lebih dari 0");
        }

        try {
            setLoading(true);
            await onSubmit();
        } finally {
            setLoading(false);
        }
    };

    const isInvalid =
        !saldoAwal || isNaN(Number(saldoAwal)) || Number(saldoAwal) <= 0;

    return (
        <div className="modal-overlay">
            <div className="shift-modal">
                <div className="shift-modal-header">
                    <h3>Mulai Shift</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="shift-modal-body">
                    <div className="info-row">
                        <span>Kasir</span>
                        <strong>{cashier}</strong>
                    </div>

                    <div className="form-group">
                        <label>Pilih Cash Drawer</label>
                        <select
                            value={selectedDrawer}
                            onChange={(e) => setSelectedDrawer(e.target.value)}
                        >
                            {drawers.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Masukkan Saldo Awal</label>
                        <input
                            type="number"
                            min="1"
                            value={saldoAwal}
                            onChange={(e) => setSaldoAwal(e.target.value)}
                            placeholder="Rp 0"
                        />

                        {isInvalid && (
                            <div className="error-text">
                                Saldo awal harus lebih dari 0
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="btn-primary btn-full"
                    onClick={handleStart}
                    disabled={isInvalid || loading}
                >
                    {loading ? "Memulai..." : "Mulai Shift Sekarang"}
                </button>
            </div>
        </div>
    );
};

export default MulaiShiftModal;