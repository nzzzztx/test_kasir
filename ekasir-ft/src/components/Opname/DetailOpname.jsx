import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/opname.css";

const DetailOpname = ({ data, onBack, onUpdate }) => {
    const { authData } = useAuth();

    const [opname, setOpname] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [stokSistem, setStokSistem] = useState("");
    const [stokFisik, setStokFisik] = useState("");
    const [loading, setLoading] = useState(false);

    // Load detail opname
    useEffect(() => {
        const fetchDetail = async () => {
            const res = await fetch(
                `http://localhost:5000/api/opname/${data.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const result = await res.json();
            if (res.ok) {
                setOpname(result);
            }
        };

        fetchDetail();
    }, [data.id]);

    // Load products by kategori
    useEffect(() => {
        if (!opname) return;

        const fetchProducts = async () => {
            const res = await fetch(
                `http://localhost:5000/api/products?category=${opname.kategori}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const result = await res.json();
            if (res.ok) {
                setProducts(result);
            }
        };

        fetchProducts();
    }, [opname]);

    if (!opname) return null;

    const isLocked = opname.status === "Selesai";

    //  Tambah Item
    const handleAddItem = async () => {
        if (!selectedProductId || stokFisik === "") {
            alert("Lengkapi data");
            return;
        }

        setLoading(true);

        const res = await fetch(
            "http://localhost:5000/api/opname/item",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    opname_id: opname.id,
                    product_id: Number(selectedProductId),
                    stok_sistem: Number(stokSistem),
                    stok_fisik: Number(stokFisik),
                }),
            }
        );

        if (res.ok) {
            // reload detail
            const detailRes = await fetch(
                `http://localhost:5000/api/opname/${opname.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const updated = await detailRes.json();
            setOpname(updated);
            setSelectedProductId("");
            setStokFisik("");
        }

        setLoading(false);
    };

    //  Delete Item
    const handleDeleteItem = async (itemId) => {
        setLoading(true);

        const res = await fetch(
            `http://localhost:5000/api/opname/item/${itemId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );

        if (res.ok) {
            // reload detail
            const detailRes = await fetch(
                `http://localhost:5000/api/opname/${opname.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const updated = await detailRes.json();
            setOpname(updated);
        }

        setLoading(false);
    };

    //  Finish Opname
    const handleFinishOpname = async () => {
        if (!window.confirm("Yakin selesaikan opname?")) return;

        setLoading(true);

        const res = await fetch(
            "http://localhost:5000/api/opname/finish",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify({
                    opname_id: opname.id,
                }),
            }
        );

        if (res.ok) {
            onUpdate();
        }

        setLoading(false);
    };

    return (
        <div className="opname-page">

            <div className="opname-info">
                <div><b>Tanggal:</b> {opname.tanggal}</div>
                <div><b>Kategori:</b> {opname.kategori}</div>
                <div>
                    <b>Status:</b>{" "}
                    <span className={`opname-status ${isLocked ? "done" : "draft"}`}>
                        {opname.status}
                    </span>
                </div>
            </div>

            {!isLocked && (
                <div className="opname-add-item">
                    <select
                        value={selectedProductId}
                        onChange={(e) => {
                            const id = e.target.value;
                            const product = products.find(p => p.id == id);
                            setSelectedProductId(id);
                            setStokSistem(product?.stock || 0);
                        }}
                    >
                        <option value="">Pilih Produk</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <input value={stokSistem} readOnly />
                    <input
                        placeholder="Stok Fisik"
                        value={stokFisik}
                        onChange={(e) => setStokFisik(e.target.value)}
                    />

                    <button
                        className="opname-btn-primary"
                        onClick={handleAddItem}
                        disabled={loading}
                    >
                        Tambah
                    </button>
                </div>
            )}

            <div className="opname-table-wrapper">
                <table className="opname-table">
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Sistem</th>
                            <th>Fisik</th>
                            <th>Selisih</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opname.items?.map((i) => (
                            <tr key={i.id}>
                                <td>{i.product_name}</td>
                                <td>{i.stok_sistem}</td>
                                <td>{i.stok_fisik}</td>
                                <td>{i.selisih}</td>
                                <td>
                                    {!isLocked && (
                                        <button
                                            onClick={() => handleDeleteItem(i.id)}
                                            className="opname-btn-danger"
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
                <button onClick={onBack} className="opname-btn-outline">
                    Kembali
                </button>

                {!isLocked && (
                    <button
                        onClick={handleFinishOpname}
                        className="opname-btn-primary"
                        disabled={loading}
                    >
                        Selesaikan
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetailOpname;