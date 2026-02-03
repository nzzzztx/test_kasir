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
    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="shift-modal">
                <div className="shift-modal-header">
                    <h3>Mulai shift</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
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
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Masukkan saldo awal</label>
                        <input
                            type="number"
                            value={saldoAwal}
                            onChange={(e) => setSaldoAwal(e.target.value)}
                            placeholder="Rp 0"
                        />
                        {!saldoAwal && (
                            <div className="error-text">Masukkan data terlebih dahulu</div>
                        )}
                    </div>
                </div>

                <button className="btn-primary btn-full" onClick={onSubmit}>
                    Mulai shift sekarang
                </button>
            </div>
        </div>
    );
};

export default MulaiShiftModal;
