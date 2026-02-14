import React, { useState, useEffect } from "react";

import taxIcon from "../../assets/icons/tax.png";
import rupiahIcon from "../../assets/icons/rupiah.png";

const EditPajakModal = ({ open, onClose, onSubmit, tax }) => {
    const [type, setType] = useState("percent");

    useEffect(() => {
        if (tax) {
            setType(tax.type || "percent");
        }
    }, [tax]);

    if (!open || !tax) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const valueNumber = Number(formData.get("value"));

        if (!formData.get("name")?.trim() || valueNumber <= 0) {
            alert("Isi data dengan benar");
            return;
        }

        const data = {
            id: tax.id,
            name: formData.get("name").trim(),
            value: valueNumber,
            type,
        };

        onSubmit(data);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="discount-modal">
                <div className="discount-modal-header">
                    <h3>Edit Pajak</h3>
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
                            defaultValue={tax.name}
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
                                defaultValue={tax.value}
                                required
                            />

                            <div className="discount-type-toggle">
                                <button
                                    type="button"
                                    className={type === "percent" ? "active" : ""}
                                    onClick={() => setType("percent")}
                                >
                                    <img src={taxIcon} alt="percent" />
                                </button>

                                <button
                                    type="button"
                                    className={type === "rupiah" ? "active" : ""}
                                    onClick={() => setType("rupiah")}
                                >
                                    <img src={rupiahIcon} alt="rupiah" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit-discount">
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPajakModal;
