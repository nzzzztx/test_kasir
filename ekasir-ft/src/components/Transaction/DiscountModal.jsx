import { useEffect, useState } from "react";

const DiscountModal = ({
    onClose,
    onSelect,
    storageKey = "discounts"
}) => {
    const [discounts, setDiscounts] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem(storageKey) || "[]"
        );
        setDiscounts(saved);
    }, [storageKey]);

    const handleSave = () => {
        if (!selected) return;
        onSelect(selected);
    };

    return (
        <div className="modal-overlay">
            <div className="discount-modal">
                <h4>Pilih Diskon</h4>

                <div className="discount-list">
                    {discounts.length === 0 && (
                        <div className="empty-discount">
                            Tidak ada diskon tersedia
                        </div>
                    )}

                    {discounts.map((d) => (
                        <button
                            key={d.id}
                            type="button"
                            className={`discount-item ${selected?.id === d.id ? "active" : ""
                                }`}
                            onClick={() => setSelected(d)}
                        >
                            <div className="name">{d.name}</div>
                            <div className="value">
                                {d.type === "percent"
                                    ? `${d.value}%`
                                    : `Rp ${Number(d.value).toLocaleString("id-ID")}`}
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

export default DiscountModal;
