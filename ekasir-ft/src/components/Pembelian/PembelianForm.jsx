const PembelianForm = ({ supplier, setSupplier, suppliers = [] }) => {
    return (
        <div className="pembelian-card">
            <h4 className="card-title">Informasi Pembelian</h4>

            <div className="form-grid">
                <div className="form-group">
                    <label>Supplier</label>
                    <select
                        value={supplier?.id || ""}
                        onChange={(e) => {
                            const selected = suppliers.find(
                                (s) => s.id === Number(e.target.value)
                            );
                            setSupplier(selected);
                        }}
                    >
                        <option value="">Pilih Supplier</option>

                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Tanggal Pembelian</label>
                    <input
                        type="date"
                        className="input-date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="form-group">
                    <label>Status Pembayaran</label>
                    <select>
                        <option value="lunas">Lunas</option>
                        <option value="belum">Belum Lunas</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default PembelianForm;
