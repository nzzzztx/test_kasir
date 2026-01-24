import { useState } from "react";
import trashIcon from "../../assets/icons/trash.png";
import editIcon from "../../assets/icons/edit.png";

import EditCartModal from "./EditCartModal";
import DiscountModal from "./DiscountModal";

const CartPanel = ({ cart, setCart, userEmail }) => {
    const [discount, setDiscount] = useState(null);
    const [showDiscount, setShowDiscount] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [paidAmount, setPaidAmount] = useState(0);

    const total = cart.reduce(
        (sum, i) => sum + i.sellPrice * i.qty,
        0
    );

    const finalTotal = (() => {
        if (!discount) return total;

        if (discount.type === "percent") {
            return Math.max(total - total * (discount.value / 100), 0);
        }

        return Math.max(total - discount.value, 0);
    })();

    const change = Math.max(paidAmount - finalTotal, 0);

    const removeItem = (code) => {
        setCart((prev) => prev.filter((i) => i.code !== code));
    };

    const handleOpenDiscount = () => {
        const discounts = JSON.parse(
            localStorage.getItem("discounts") || "[]"
        );

        if (!discounts.length) {
            alert("Tidak ada diskon tersedia");
            return;
        }

        setShowDiscount(true);
    };

    const handlePay = () => {
        if (!cart.length) return;

        // if (paidAmount < finalTotal) {
        //     alert("Uang dibayar kurang");
        //     return;
        // }

        const payload = {
            items: [...cart],
            discount,
            total,
            finalTotal,
            paidAmount,
            change,
            paidAt: new Date().toISOString(),
            cashier: userEmail,
        };

        localStorage.setItem(
            "current_transaction",
            JSON.stringify(payload)
        );

        setCart([]);
        setDiscount(null);
        setPaidAmount(0);

        window.location.href = "/dashboard/transaction/payment";
    };

    return (
        <div className="cart-panel">
            <h3 className="cart-title">List Barang</h3>

            <div className="cart-list">
                {cart.map((item) => (
                    <div key={item.code} className="cart-item">
                        <div className="cart-qty">{item.qty}</div>

                        <div className="cart-info">
                            <div className="cart-name">{item.name}</div>
                            <div className="cart-price">
                                Rp {(item.sellPrice * item.qty).toLocaleString("id-ID")}
                            </div>
                        </div>

                        <div className="cart-actions">
                            <button
                                className="cart-edit"
                                onClick={() => setEditItem(item)}
                            >
                                <img src={editIcon} alt="edit" />
                            </button>

                            <button
                                className="cart-remove"
                                onClick={() => removeItem(item.code)}
                            >
                                <img src={trashIcon} alt="hapus" />
                            </button>
                        </div>
                    </div>
                ))}

                {!cart.length && (
                    <div className="cart-empty">Belum ada barang</div>
                )}
            </div>

            <div className="cart-discount" onClick={handleOpenDiscount}>
                {discount
                    ? `Diskon: ${discount.name} (-${discount.value}${discount.type === "percent" ? "%" : ""})`
                    : "Lihat Diskon"}
            </div>

            {/* <div className="cart-paid">
                <label>Uang Dibayar</label>
                <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    placeholder="Masukkan uang"
                />
            </div> */}

            <button className="btn-pay" onClick={handlePay}>
                Rp {finalTotal.toLocaleString("id-ID")} — Bayar
            </button>

            {editItem && (
                <EditCartModal
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onSave={(updated) => {
                        setCart(prev =>
                            prev.map(i =>
                                i.code === updated.code ? updated : i
                            )
                        );
                        setEditItem(null);
                    }}
                />
            )}

            {showDiscount && (
                <DiscountModal
                    onClose={() => setShowDiscount(false)}
                    onSelect={(d) => {
                        setDiscount(d);
                        setShowDiscount(false);
                    }}
                />
            )}
        </div>
    );
};

export default CartPanel;
