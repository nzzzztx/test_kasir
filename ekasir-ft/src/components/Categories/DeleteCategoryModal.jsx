import React from 'react';
import '../../assets/css/categories.css';

const DeleteCategoryModal = ({ category, onCancel, onConfirm }) => {
    if (!category) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-delete-category">
                <p className="modal-delete-title">
                    Apakah anda yakin ingin menghapus kategori ini
                    <strong> {category.name}</strong> ?
                </p>

                <div className="modal-delete-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        Batalkan
                    </button>

                    <button
                        className="btn-confirm-orange"
                        onClick={() => onConfirm(category)}
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
