import React from "react";

const DeletePajakModal = ({ open, onClose, onConfirm, tax }) => {
    if (!open || !tax) return null;

    return (
        <div className="modal-overlay">
            <div className="discount-modal delete-discount-modal">
                <div className="discount-modal-header">
                    <h3>Hapus Pajak</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="delete-discount-body">
                    <p>
                        Apakah Anda yakin ingin menghapus pajak
                        <br />
                        <strong>{tax.name}</strong>?
                    </p>

                    <div className="delete-discount-actions">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={onClose}
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            className="btn-submit-discount"
                            onClick={() => {
                                onConfirm(tax.id);
                                onClose();
                            }}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeletePajakModal;
