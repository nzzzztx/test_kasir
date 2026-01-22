import React, { useState } from "react";

import discountIcon from "../../assets/icons/discount.png";
import rupiahIcon from "../../assets/icons/rupiah.png";


const AddDiscountModal = ({ open, onClose, onSubmit }) => {
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
                    <h3>Tambah Potongan / Diskon</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="discount-modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Diskon</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Masukkan nama..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Jumlah Diskon</label>

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
                                    title="Diskon Persen"
                                >
                                    <img src={discountIcon} alt="percent" />
                                </button>
                                <button
                                    type="button"
                                    className={type === "rupiah" ? "active" : ""}
                                    onClick={() => setType("rupiah")}
                                    title="Diskon Rupiah"
                                >
                                    <img src={rupiahIcon} alt="rupiah" />
                                </button>
                            </div>

                        </div>
                    </div>

                    <button type="submit" className="btn-submit-discount">
                        Tambah
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDiscountModal;
