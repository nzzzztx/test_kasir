import { useState } from "react";

const AddPembelianItemModal = ({ open, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [qty, setQty] = useState(1);
    const [unit, setUnit] = useState("pcs");
    const [price, setPrice] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        if (!name || qty <= 0 || price <= 0) return;

        onSubmit({
            name,
            qty: Number(qty),
            unit,
            price: Number(price),
        });

        setName("");
        setQty(1);
        setUnit("pcs");
        setPrice("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h4>Tambah Barang</h4>
                <p className="modal-subtitle">
                    Isi detail barang yang dibeli
                </p>

                <div className="modal-form">
                    <label>Nama Barang</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Minyak Goreng 2L"
                    />

                    <div className="modal-grid">
                        <div>
                            <label>Qty</label>
                            <input
                                type="number"
                                min="1"
                                value={qty}
                                onChange={(e) => setQty(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Satuan</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                            >
                                <option>pcs</option>
                                <option>dus</option>
                                <option>kg</option>
                                <option>liter</option>
                            </select>
                        </div>
                    </div>

                    <label>Harga Satuan</label>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Rp 0"
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-outline" onClick={onClose}>
                        Batal
                    </button>
                    <button className="btn-primary" onClick={handleSubmit}>
                        Tambah
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPembelianItemModal;
