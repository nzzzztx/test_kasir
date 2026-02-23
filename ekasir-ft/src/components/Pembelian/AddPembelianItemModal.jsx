import { useState, useEffect } from "react";

const AddPembelianItemModal = ({
    open,
    onClose,
    onSubmit,
    products = []
}) => {
    const [selectedId, setSelectedId] = useState("");
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (!open) {
            setSelectedId("");
            setQty(1);
            setPrice("");
        }
    }, [open]);

    if (!open) return null;

    const selectedProduct = products.find(
        (p) => String(p.id) === String(selectedId)
    );

    const handleSubmit = () => {
        if (!selectedProduct) {
            alert("Pilih produk terlebih dahulu");
            return;
        }

        if (!qty || qty <= 0) {
            alert("Qty tidak valid");
            return;
        }

        if (!price || price <= 0) {
            alert("Harga tidak valid");
            return;
        }

        const newItem = {
            product_id: selectedProduct.id,
            name: selectedProduct.name,
            unit: selectedProduct.unit || "Pcs",
            qty: Number(qty),
            price: Number(price),
        };

        onSubmit(newItem);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h3>Tambah Barang Pembelian</h3>

                <div className="form-group">
                    <label>Pilih Produk</label>
                    <select
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            const product = products.find(
                                (p) =>
                                    String(p.id) ===
                                    String(e.target.value)
                            );
                            if (product) {
                                setPrice(product.purchase_price || "");
                            }
                        }}
                    >
                        <option value="">-- Pilih Produk --</option>
                        {products.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Qty</label>
                    <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) =>
                            setQty(Number(e.target.value))
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Harga Beli</label>
                    <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value ? Number(e.target.value) : "")
                        }
                    />
                </div>

                <div className="modal-actions">
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                    >
                        Tambah
                    </button>

                    <button
                        className="btn-outline"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPembelianItemModal;
