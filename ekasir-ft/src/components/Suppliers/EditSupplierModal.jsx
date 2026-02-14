import React from "react";
import "../../assets/css/suppliers.css";

const EditSupplierModal = ({ open, onClose, onSubmit, supplier }) => {
    if (!open || !supplier) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {
            id: supplier.id,
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
                    <h3>Edit Supplier</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nama Supplier</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={supplier.name}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>No Telepon</label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={supplier.phone}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            type="text"
                            name="address"
                            defaultValue={supplier.address}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Email <span>(Opsional)</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={supplier.email}
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

export default EditSupplierModal;
