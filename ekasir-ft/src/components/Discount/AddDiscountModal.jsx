import React, { useState } from "react";
import discountIcon from "../../assets/icons/discount.png";
import rupiahIcon from "../../assets/icons/rupiah.png";

const AddDiscountModal = ({ open, onClose, onSubmit }) => {
    const [type, setType] = useState("percent");

    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const name = formData.get("name")?.trim();
        const value = Number(formData.get("value"));

        if (!name) {
            alert("Nama diskon wajib diisi");
            return;
        }

        if (value <= 0) {
            alert("Nilai diskon harus lebih dari 0");
            return;
        }

        if (type === "percent" && value > 100) {
            alert("Diskon persen tidak boleh lebih dari 100%");
            return;
        }

        onSubmit({
            name,
            value,
            type,
        });

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
                                >
                                    <img src={discountIcon} alt="percent" />
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
                        Tambah
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddDiscountModal;
