import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const EditStockModal = ({ open, onClose, stock, onSubmit }) => {
    const { authData } = useAuth();

    const [form, setForm] = useState({
        date: "",
        basePrice: "",
        qty: 1,
        note: "",
    });

    useEffect(() => {
        if (!open || !stock) return;

        setForm({
            date: new Date().toISOString().split("T")[0],
            basePrice: stock.basePrice ?? "",
            qty: 1,
            note: "",
        });
    }, [open, stock]);

    if (!open || !stock) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const qty = Number(form.qty);
        const basePrice = Number(form.basePrice);
        if (qty <= 0 || basePrice <= 0) return;

        const newStock = stock.stock + qty;

        onSubmit({
            id: stock.id,
            qty,
            basePrice,
        });

        const newLog = {
            id: Date.now(),
            code: String(stock.code),
            productName: stock.name,
            date: new Date().toISOString().split("T")[0],
            in: qty,
            out: 0,
            stock: newStock,
            basePrice,
            sellPrice: stock.sellPrice,
            email: authData.email || "unknown@system",
            mode: "Manajemen Stok Barang",
            note: form.note || "-",
        };

        const prevLogs = JSON.parse(
            localStorage.getItem("logistics") || "[]"
        );

        localStorage.setItem(
            "logistics",
            JSON.stringify([newLog, ...prevLogs])
        );

        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="stock-modal">
                <div className="stock-modal-header">
                    <h3>Edit Stok Barang</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="stock-product-info">
                    <img
                        src={stock.image}
                        alt={stock.name}
                        className="stock-product-image"
                    />

                    <div className="stock-product-meta">
                        <div><strong>Nama barang</strong> : {stock.name}</div>
                        <div><strong>Kategori</strong> : {stock.category}</div>
                        <div><strong>Sisa Stok</strong> : {stock.stock}</div>
                        <div><strong>Kode</strong> : {stock.code}</div>
                    </div>
                </div>

                <form className="stock-modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label>Harga Beli</label>
                            <input
                                type="number"
                                name="basePrice"
                                value={form.basePrice}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Jumlah</label>
                            <input
                                type="number"
                                name="qty"
                                min="1"
                                value={form.qty}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Keterangan</label>
                        <textarea
                            name="note"
                            placeholder="Masukkan keterangan..."
                            value={form.note}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-submit-stock">
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditStockModal;
