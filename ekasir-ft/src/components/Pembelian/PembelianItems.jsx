import { useState } from "react";
import AddPembelianItemModal from "./AddPembelianItemModal";

const PembelianItems = ({ items, setItems }) => {
    const [openModal, setOpenModal] = useState(false);

    const handleAddItem = (item) => {
        setItems((prev) => [...prev, item]);
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
                    </tr>
                </thead>
                <tbody>
                    {items.length === 0 && (
                        <tr>
                            <td colSpan="5" className="table-empty">
                                Belum ada barang
                            </td>
                        </tr>
                    )}

                    {items.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.unit}</td>
                            <td>Rp {item.price.toLocaleString("id-ID")}</td>
                            <td>
                                Rp {(item.qty * item.price).toLocaleString("id-ID")}
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
            />
        </div>
    );
};

export default PembelianItems;
