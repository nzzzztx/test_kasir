import { useState, useEffect } from "react";
import AddPembelianItemModal from "./AddPembelianItemModal";
import { getCurrentOwnerId } from "../../utils/owner";

const PembelianItems = ({ items, setItems }) => {
    const [openModal, setOpenModal] = useState(false);
    const [products, setProducts] = useState([]);

    const ownerId = getCurrentOwnerId();

    useEffect(() => {
        if (!ownerId) return;

        const saved =
            JSON.parse(localStorage.getItem(`products_${ownerId}`)) || [];

        setProducts(saved);
    }, [ownerId]);

    const handleAddItem = (newItem) => {
        setItems((prev) => {
            const existing = prev.find(
                (p) => p.productId === newItem.productId
            );

            if (existing) {
                return prev.map((p) =>
                    p.productId === newItem.productId
                        ? { ...p, qty: p.qty + newItem.qty }
                        : p
                );
            }

            return [...prev, newItem];
        });
    };

    return (
        <div className="pembelian-card">
            <h4 className="card-title">Detail Barang</h4>

            <table className="pembelian-table">
                <thead>
                    <tr>
                        <th>Nama Barang</th>
                        <th>Qty</th>
                        <th>Satuan</th>
                        <th>Harga</th>
                        <th>Total</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="6" className="table-empty">
                                Belum ada barang
                            </td>
                        </tr>
                    )}

                    {items.map((item) => (
                        <tr key={item.productId}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.unit}</td>
                            <td>
                                Rp {Number(item.price).toLocaleString("id-ID")}
                            </td>
                            <td>
                                Rp{" "}
                                {(item.qty * item.price).toLocaleString("id-ID")}
                            </td>
                            <td>
                                <button
                                    className="btn-delete-item"
                                    onClick={() =>
                                        setItems((prev) =>
                                            prev.filter(
                                                (p) =>
                                                    p.productId !==
                                                    item.productId
                                            )
                                        )
                                    }
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                className="btn-add-item add-item"
                onClick={() => setOpenModal(true)}
            >
                + Tambah Barang
            </button>

            <AddPembelianItemModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSubmit={handleAddItem}
                products={products}
            />
        </div>
    );
};

export default PembelianItems;
