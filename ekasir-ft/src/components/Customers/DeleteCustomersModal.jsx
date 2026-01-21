import React from "react";
import "../../assets/css/customers.css";

const DeleteCustomersModal = ({ open, onClose, onConfirm, customer }) => {
    if (!open || !customer) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card" style={{ width: 360 }}>
                <div className="modal-header">
                    <h3>Hapus Pelanggan</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body" style={{ gap: 16 }}>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                        Apakah anda yakin ingin menghapus pelanggan ini?
                        <br />
                        <strong>{customer.name}</strong>
                    </p>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            type="button"
                            className="btn-outline"
                            style={{ flex: 1 }}
                            onClick={onClose}
                        >
                            Batalkan
                        </button>

                        <button
                            type="button"
                            className="btn-submit"
                            style={{ flex: 1 }}
                            onClick={() => onConfirm(customer.id)}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteCustomersModal;
