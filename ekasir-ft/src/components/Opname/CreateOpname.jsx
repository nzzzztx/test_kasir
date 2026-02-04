import React, { useState } from "react";
import "../../assets/css/opname.css";

const CreateOpname = ({ open, onClose, onSaved, selectedDate }) => {
    if (!open) return null;

    const [tanggal, setTanggal] = useState(selectedDate);
    React.useEffect(() => {
        setTanggal(selectedDate);
    }, [selectedDate]);

    const [kategori, setKategori] = useState("");
    const [keterangan, setKeterangan] = useState("");
    const categories = JSON.parse(localStorage.getItem("categories")) || [];


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!kategori) {
            alert("Kategori wajib diisi");
            return;
        }

        const newOpname = {
            id: Date.now(),
            tanggal,
            user: "Admin",
            kategori,
            totalItem: 0,
            status: "Draft",
            keterangan,
            items: [],
        };

        const existing =
            JSON.parse(localStorage.getItem("stock_opname")) || [];

        localStorage.setItem(
            "stock_opname",
            JSON.stringify([newOpname, ...existing])
        );

        onSaved();
        onClose();
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
                    >
                        <option value="">Pilih Kategori</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>
                                {c.name}
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
                        <button type="button" className="btn-outline" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn-primary">
                            Simpan Opname
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOpname;
