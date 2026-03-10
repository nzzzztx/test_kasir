import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/opname.css";

const CreateOpname = ({ onClose, onSaved, selectedDate }) => {
    const { authData } = useAuth();

    const [tanggal, setTanggal] = useState(selectedDate);
    const [kategori, setKategori] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);

    useEffect(() => {
        setTanggal(selectedDate);
    }, [selectedDate]);

    // 🔥 AMBIL KATEGORI DARI API
    useEffect(() => {
        const fetchCategories = async () => {
            if (!authData?.token) return;

            try {
                setLoadingCategory(true);

                const res = await fetch(
                    "http://192.168.2.20:5000/api/opname/categories",
                    {
                        headers: {
                            Authorization: `Bearer ${authData.token}`,
                        },
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setCategories(data);
                } else {
                    console.error(data.message);
                }
            } catch (err) {
                console.error("Gagal ambil kategori:", err);
            }

            setLoadingCategory(false);
        };

        fetchCategories();
    }, [authData?.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kategori) {
            alert("Kategori wajib dipilih");
            return;
        }

        if (!authData?.token) {
            alert("Token tidak ditemukan");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "http://192.168.2.20:5000/api/opname",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authData.token}`,
                    },
                    body: JSON.stringify({
                        tanggal,
                        kategori,
                        keterangan,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Gagal membuat opname");
                setLoading(false);
                return;
            }

            onSaved();
            onClose();

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan");
        }

        setLoading(false);
    };

    return (
        <div className="opname-modal-overlay">
            <div className="opname-modal">
                <div className="opname-modal-header">
                    <h3>Buat Stock Opname</h3>
                    <button onClick={onClose}>×</button>
                </div>

                <form className="opname-modal-body" onSubmit={handleSubmit}>
                    <label>Tanggal</label>
                    <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                    />

                    <label>Kategori</label>
                    <select
                        value={kategori}
                        onChange={(e) => setKategori(e.target.value)}
                        disabled={loadingCategory}
                    >
                        <option value="">
                            {loadingCategory
                                ? "Memuat kategori..."
                                : "Pilih Kategori"}
                        </option>

                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label>Keterangan</label>
                    <textarea
                        placeholder="Catatan tambahan (opsional)"
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                    />

                    <div className="opname-modal-actions">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : "Simpan Opname"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOpname;