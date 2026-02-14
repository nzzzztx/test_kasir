import React, { useState } from "react";

const AddCategoryModal = ({ onClose, onSubmit }) => {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name);
        setName("");
    };

    return (
        <div className="modal-overlay">
            <div className="modal-add-category">
                <div className="modal-header">
                    <h3>Tambah Kategori</h3>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>

                <div className="form-group">
                    <label>Nama Kategori</label>
                    <input
                        type="text"
                        placeholder="Masukkan nama.."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn-confirm" onClick={handleSubmit}>
                        Tambah
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryModal;