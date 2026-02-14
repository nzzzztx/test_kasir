import React from "react";
import "../../assets/css/customers.css";

const AddCustomersModal = ({ open, onClose, onSubmit }) => {
    if (!open) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            name: formData.get("name")?.trim(),
            phone: formData.get("phone")?.trim(),
            address: formData.get("address")?.trim(),
            email: formData.get("email")?.trim(),
        };

        onSubmit(data);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <h3>Tambah Pelanggan</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Masukkan nama..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>No Telepon</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="000 000 000"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Masukkan alamat..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email <span>(Opsional)</span></label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Masukkan email..."
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Tambah
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCustomersModal;
