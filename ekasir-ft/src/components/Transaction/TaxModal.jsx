import { useState } from "react";

const TaxModal = ({
    taxes = [],
    onClose,
    onSelect,
}) => {
    const [selected, setSelected] = useState(null);

    const handleSave = () => {
        if (!selected) return;
        onSelect(selected);
    };

    return (
        <div className="modal-overlay">
            <div className="discount-modal">
                <h4>Pilih Pajak</h4>

                <div className="discount-list">
                    {taxes.length === 0 && (
                        <div className="empty-discount">
                            Tidak ada pajak tersedia
                        </div>
                    )}

                    {taxes.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            className={`discount-item ${selected?.id === t.id ? "active" : ""
                                }`}
                            onClick={() => setSelected(t)}
                        >
                            <div className="name">{t.name}</div>

                            <div className="value">
                                {t.type === "percent"
                                    ? `${t.value}%`
                                    : `Rp ${Number(t.value).toLocaleString(
                                        "id-ID"
                                    )}`}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="discount-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        className="btn-save"
                        disabled={!selected}
                        onClick={handleSave}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaxModal;