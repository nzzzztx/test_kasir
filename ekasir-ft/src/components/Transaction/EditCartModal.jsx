import { useEffect, useState } from "react";

const EditCartModal = ({ item, maxQty = item.qty, onClose, onSave }) => {
    const [qty, setQty] = useState(item.qty);
    // const [discountType, setDiscountType] = useState("%");
    // const [discountValue, setDiscountValue] = useState(0);
    // const [discounts, setDiscounts] = useState([]);

    // useEffect(() => {
    //     const saved = JSON.parse(localStorage.getItem("discounts") || "[]");
    //     setDiscounts(saved);
    // }, []);

    // const handleApplyDiscount = (d) => {
    //     setDiscountType(d.type === "percent" ? "%" : "Rp");
    //     setDiscountValue(d.value);
    // };

    const getFinalPrice = () => {
        let base = item.sellPrice * qty;

        if (discountValue > 0) {
            base =
                discountType === "%"
                    ? base - base * (discountValue / 100)
                    : base - discountValue;
        }

        return Math.max(base, 0);
    };

    return (
        <div className="modal-overlay">
            <div className="edit-modal">
                <h4>EDIT</h4>

                <div className="edit-product">
                    <img src={item.image} alt={item.name} />
                    <div>
                        <div className="name">{item.name}</div>
                        <div className="price">
                            Rp {(
                                item.finalPrice ??
                                item.sellPrice * item.qty
                            ).toLocaleString("id-ID")}
                        </div>
                    </div>
                </div>

                <div className="qty-control">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span>{qty}</span>
                    <button
                        onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                        disabled={qty >= maxQty}
                    >
                        +
                    </button>
                </div>

                {/* <div className="discount-box">
                    <select
                        onChange={(e) => {
                            const d = discounts.find(x => x.id === Number(e.target.value));
                            if (d) handleApplyDiscount(d);
                        }}
                    >
                        <option value="">ubah diskon penjualan</option>
                        {discounts.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.name} ({d.type === "percent" ? `${d.value}%` : `Rp ${d.value}`})
                            </option>
                        ))}
                    </select>

                    <div className="discount-input">
                        <input
                            // type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                        />
                        <span>{discountType}</span>
                    </div>
                </div> */}

                <div className="edit-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Batal
                    </button>
                    <button
                        className="btn-save"
                        onClick={() => {
                            const safeQty = Math.min(qty, maxQty);

                            onSave({
                                ...item,
                                qty: safeQty,
                                finalPrice: getFinalPrice(),
                            });
                        }}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCartModal;
