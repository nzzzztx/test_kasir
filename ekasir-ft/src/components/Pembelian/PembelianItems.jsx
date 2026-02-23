import { useState, useEffect } from "react";
import AddPembelianItemModal from "./AddPembelianItemModal";
import { getCurrentOwnerId } from "../../utils/owner";
import { useAuth } from "../../context/AuthContext";

const PembelianItems = ({ items, setItems }) => {
    const { authData } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [products, setProducts] = useState([]);
    const ownerId = getCurrentOwnerId();

    useEffect(() => {
        if (!authData?.token) return;

        const fetchProducts = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/products", {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Fetch products error:", data);
                    return;
                }

                setProducts(data);

            } catch (err) {
                console.error("Error fetch products:", err);
            }
        };

        fetchProducts();
    }, [authData?.token]);

    const handleAddItem = (newItem) => {
        setItems((prev) => {
            const existing = prev.find(
                (p) => p.product_id === newItem.product_id
            );

            if (existing) {
                return prev.map((p) =>
                    p.product_id === newItem.product_id
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
                        <tr key={item.product_id}>
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
                                                    p.product_id !== item.product_id
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
