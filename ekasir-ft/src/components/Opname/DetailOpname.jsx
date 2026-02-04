import React, { useEffect, useState } from "react";
import "../../assets/css/opname.css";

const DetailOpname = ({ data, onBack, onUpdate }) => {
    const [opname, setOpname] = useState(data);

    // const [nama, setNama] = useState("");
    const [stokSistem, setStokSistem] = useState("");
    const [stokFisik, setStokFisik] = useState("");
    const products = JSON.parse(localStorage.getItem("products")) || [];

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedProductId, setSelectedProductId] = useState("");
    const filteredProducts = products.filter(
        (p) => p.category === opname.kategori
    );

    useEffect(() => {
        setOpname(data);
    }, [data]);

    if (!opname) return null;

    const isLocked = opname.status === "Selesai";

    const handleFinishOpname = () => {
        if (!opname.items || opname.items.length === 0) {
            alert("Opname belum memiliki item");
            return;
        }

        if (!window.confirm("Yakin selesaikan opname?")) return;

        const finished = {
            ...opname,
            status: "Selesai",
            finishedAt: new Date().toISOString(),
        };

        setOpname(finished);
        onUpdate(finished);
    };

    const handleAddItem = () => {
        if (!selectedProduct || stokFisik === "") {
            alert("Pilih produk & isi stok fisik");
            return;
        }

        const selisih =
            Number(stokFisik) - Number(stokSistem);

        const newItem = {
            id: Date.now(),
            productId: selectedProduct.id,
            nama: selectedProduct.name,
            kategoriId: selectedProduct.categoryId,
            stokSistem: Number(stokSistem),
            stokFisik: Number(stokFisik),
            selisih,
        };

        const updated = {
            ...opname,
            items: [...(opname.items || []), newItem],
            totalItem: (opname.items?.length || 0) + 1,
        };

        setOpname(updated);
        onUpdate(updated);

        setSelectedProduct(null);
        setSelectedProductId("");
        setStokSistem("");
        setStokFisik("");
    };

    const handleDeleteItem = (itemId) => {
        if (isLocked) return;

        const items = opname.items.filter((i) => i.id !== itemId);

        const updated = {
            ...opname,
            items,
            totalItem: items.length,
        };

        setOpname(updated);
        onUpdate(updated);
    };

    return (
        <div className="opname-page">

            <div className="opname-info">
                <div><b>Tanggal:</b> {opname.tanggal}</div>
                <div><b>Label Opname:</b> {opname.kategori}</div>
                <div>
                    <b>Status:</b>{" "}
                    <span className={`opname-status ${opname.status === "Selesai" ? "done" : "draft"}`}>
                        {opname.status}
                    </span>
                </div>
            </div>

            {!isLocked && (
                <div className="opname-add-item">
                    <select
                        value={selectedProductId}
                        onChange={(e) => {
                            const id = Number(e.target.value);
                            const prod = products.find(p => p.id === id);

                            setSelectedProductId(id);
                            setSelectedProduct(prod);
                            setStokSistem(prod?.stock || 0);
                        }}
                    >
                        <option value="">
                            Pilih Produk ({opname.kategori})
                        </option>
                        {filteredProducts.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <input
                        // type="number"
                        placeholder="Stok Sistem (Otomatis Terisi)"
                        value={stokSistem}
                        readOnly
                    />
                    <input
                        // type="number"
                        placeholder="Stok Fisik"
                        value={stokFisik}
                        onChange={(e) => setStokFisik(e.target.value)}
                    />
                    <button
                        className="opname-btn-primary"
                        onClick={handleAddItem}
                        disabled={!selectedProduct || stokFisik === ""}
                    >
                        + Tambah Item
                    </button>
                </div>
            )}

            <div className="opname-table-wrapper">
                <table className="opname-table">
                    <thead>
                        <tr>
                            <th>Nama Barang</th>
                            <th>Stok Sistem</th>
                            <th>Stok Fisik</th>
                            <th>Selisih</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(!opname.items || opname.items.length === 0) && (
                            <tr>
                                <td colSpan="5" className="opname-empty">
                                    Belum ada item opname
                                </td>
                            </tr>
                        )}

                        {opname.items?.map((i) => (
                            <tr key={i.id}>
                                <td>{i.nama}</td>
                                <td>{i.stokSistem}</td>
                                <td>{i.stokFisik}</td>
                                <td
                                    style={{
                                        color: i.selisih < 0 ? "#ef4444" : "#16a34a",
                                        fontWeight: 700,
                                    }}
                                >
                                    {i.selisih}
                                </td>
                                <td>
                                    {!isLocked && (
                                        <button
                                            className="opname-btn-danger"
                                            onClick={() => handleDeleteItem(i.id)}
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="opname-footer">
                <span>Total Item: {opname.totalItem}</span>

                <div className="opname-footer-actions">
                    <button className="opname-btn-outline" onClick={onBack}>
                        Kembali
                    </button>

                    {opname.status === "Draft" && (
                        <button
                            className="opname-btn-primary"
                            onClick={handleFinishOpname}
                        >
                            Selesaikan Opname
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailOpname;
