const PembelianForm = ({
    supplier,
    setSupplier,
    suppliers = [],
    paymentStatus,
    setPaymentStatus,
    isSupplierLocked,
    tanggal,
    setTanggal
}) => {
    return (
        <div className="pembelian-card">
            <h4 className="card-title">Informasi Pembelian</h4>

            <div className="form-grid">
                <div className="form-group">
                    <label>Supplier</label>

                    <select
                        value={supplier?.id || ""}
                        disabled={isSupplierLocked}
                        onChange={(e) => {
                            const selected = suppliers.find(
                                (s) => s.id === Number(e.target.value)
                            );
                            setSupplier(selected || null);
                        }}
                    >
                        <option value="">Pilih Supplier</option>
                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>

                    {isSupplierLocked && (
                        <small className="form-hint">
                            Supplier terkunci karena sudah ada barang
                        </small>
                    )}
                </div>

                <div className="form-group">
                    <label>Tanggal Pembelian</label>
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Status Pembayaran</label>
                    <select
                        value={paymentStatus}
                        disabled={!isSupplierLocked}
                        onChange={(e) =>
                            setPaymentStatus(e.target.value)
                        }
                    >
                        <option value="lunas">Lunas</option>
                        <option value="belum">Belum Lunas</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PembelianForm;
