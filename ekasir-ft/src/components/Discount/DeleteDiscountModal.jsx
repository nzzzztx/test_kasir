import React from "react";

const DeleteDiscountModal = ({ open, onClose, onConfirm, discount }) => {
    if (!open || !discount) return null;

    return (
        <div className="modal-overlay">
            <div className="discount-modal delete-discount-modal">
                <div className="discount-modal-header">
                    <h3>Hapus Diskon</h3>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="delete-discount-body">
                    <p>
                        Apakah Anda yakin ingin menghapus diskon
                        <br />
                        <strong>{discount.name}</strong>?
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
                                onConfirm(discount.id);
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

export default DeleteDiscountModal;
