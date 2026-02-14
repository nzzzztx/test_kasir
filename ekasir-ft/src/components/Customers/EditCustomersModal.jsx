import React from "react";
import "../../assets/css/customers.css";

const EditCustomersModal = ({ open, onClose, onSubmit, customer }) => {
    if (!open || !customer) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            id: customer.id, // PENTING
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
                    <h3>Edit Pelanggan</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={customer.name || ""}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>No Telepon</label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={customer.phone || ""}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            type="text"
                            name="address"
                            defaultValue={customer.address || ""}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email <span>(Opsional)</span></label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={customer.email || ""}
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Simpan
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCustomersModal;
