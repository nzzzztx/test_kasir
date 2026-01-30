import React, { useState } from "react";

import taxIcon from "../../assets/icons/tax.png";
import rupiahIcon from "../../assets/icons/rupiah.png";

const AddPajakModal = ({ open, onClose, onSubmit }) => {
    if (!open) return null;

    const [type, setType] = useState("percent");

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            name: formData.get("name"),
            value: Number(formData.get("value")),
            type,
        };

        onSubmit(data);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="discount-modal">
                <div className="discount-modal-header">
                    <h3>Tambah Pajak</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="discount-modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Pajak</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Contoh: PPN 11%"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nilai Pajak</label>

                        <div className="discount-value-group">
                            <input
                                type="number"
                                name="value"
                                min="0"
                                placeholder="0"
                                required
                            />

                            <div className="discount-type-toggle">
                                <button
                                    type="button"
                                    className={type === "percent" ? "active" : ""}
                                    onClick={() => setType("percent")}
                                    title="Persen"
                                >
                                    <img src={taxIcon} alt="percent" />
                                </button>

                                <button
                                    type="button"
                                    className={type === "rupiah" ? "active" : ""}
                                    onClick={() => setType("rupiah")}
                                    title="Nominal Rupiah"
                                >
                                    <img src={rupiahIcon} alt="rupiah" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-discount">
                        Tambah Pajak
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPajakModal;
