import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useShift } from "../../context/ShiftContext";
import trashIcon from "../../assets/icons/trash.png";
import editIcon from "../../assets/icons/edit.png";

import EditCartModal from "./EditCartModal";
import DiscountModal from "./DiscountModal";
import TaxModal from "./TaxModal";

const CartPanel = ({
    cart,
    setCart,
    products,
    setProducts,
    ownerId,
    cashierName,
    discounts,
    taxes
}) => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const [discount, setDiscount] = useState(null);
    const [showDiscount, setShowDiscount] = useState(false);
    const [tax, setTax] = useState(null);
    const [showTax, setShowTax] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const { activeShift, loadingShift } = useShift();

    const subtotal = cart.reduce(
        (sum, i) => sum + i.sellPrice * i.qty,
        0
    );

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
    });

    const afterDiscount = discount
        ? discount.type === "percent"
            ? Math.round(subtotal - subtotal * (discount.value / 100))
            : Math.max(subtotal - discount.value, 0)
        : subtotal;

    const taxAmount = tax
        ? tax.type === "percent"
            ? Math.round(afterDiscount * (tax.value / 100))
            : tax.value
        : 0;

    const finalTotal = Math.max(afterDiscount + taxAmount, 0);

    const removeItem = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const handleOpenDiscount = () => {
        if (!discounts?.length) {
            alert("Tidak ada diskon tersedia");
            return;
        }

        setShowDiscount(true);
    };

    const handlePay = async () => {
        if (!cart.length) return;

        // kalau belum selesai fetch
        if (loadingShift) {
            alert("Memuat shift...");
            return;
        }

        if (!activeShift) {
            alert("Shift belum dimulai");
            navigate("/dashboard/shift");
            return;
        }

        // kalau status bukan ACTIVE
        if (activeShift.status !== "ACTIVE") {
            alert("Shift sudah ditutup");
            navigate("/dashboard/shift");
            return;
        }

        const payload = {
            items: cart.map(item => ({
                id: item.id,
                product_id: item.id,
                product_name: item.name,
                price: item.sellPrice,
                qty: item.qty
            })),
            subtotal,
            discount,
            discountTotal: subtotal - afterDiscount,
            tax,
            taxTotal: taxAmount,
            finalTotal,
            customer,
            cashier: cashierName || activeShift.cashier,
            shift_id: activeShift.id
        };

        localStorage.setItem(
            `pending_transaction_owner_${ownerId}`,
            JSON.stringify(payload)
        );

        navigate("/dashboard/transaction/payment");
    };

    return (
        <div className="cart-panel">
            <h3 className="cart-title">List Barang</h3>

            <div className="cart-list">
                {cart.map((item) => (
                    <div key={item.id} className="cart-item">
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
                                onClick={() => removeItem(item.id)}
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

            <div className="cart-adjustment">
                <div
                    className="cart-discount"
                    onClick={handleOpenDiscount}
                >
                    {discount
                        ? `Diskon: ${discount.name}`
                        : "Diskon"}
                </div>

                <div
                    className="cart-tax"
                    onClick={() => {
                        if (!taxes?.length) {
                            alert("Tidak ada pajak tersedia");
                            return;
                        }

                        setShowTax(true);
                    }}
                >
                    {tax
                        ? `Pajak: ${tax.name}`
                        : "Pajak"}
                </div>
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

            <div className="cart-customer">
                <h4>Pelanggan</h4>

                <input
                    placeholder="Nama pelanggan (opsional)"
                    value={customer.name}
                    onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                    }
                />

                {/* <input
                    placeholder="No telepon"
                    value={customer.phone}
                    onChange={(e) =>
                        setCustomer({ ...customer, phone: e.target.value })
                    }
                />

                <textarea
                    placeholder="Alamat (opsional)"
                    value={customer.address}
                    onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                    }
                /> */}
            </div>

            <button className="btn-pay" onClick={handlePay}>
                Rp {finalTotal.toLocaleString("id-ID")} — Bayar
            </button>

            {editItem && (
                <EditCartModal
                    item={editItem}
                    maxQty={
                        products.find(p => p.id === editItem.id)?.stock || editItem.qty
                    }
                    onClose={() => setEditItem(null)}
                    onSave={(updated) => {
                        setCart(prev =>
                            prev.map(i => i.id === updated.id ? updated : i)
                        );
                        setEditItem(null);
                    }}
                />
            )}

            {showDiscount && (
                <DiscountModal
                    title="Pilih Diskon"
                    discounts={discounts}
                    onClose={() => setShowDiscount(false)}
                    onSelect={(d) => {
                        setDiscount(d);
                        setShowDiscount(false);
                    }}
                />
            )}

            {showTax && (
                <TaxModal
                    title="Pilih Pajak"
                    taxes={taxes}
                    onClose={() => setShowTax(false)}
                    onSelect={(t) => {
                        setTax(t);
                        setShowTax(false);
                    }}
                />
            )}
        </div>
    );
};

export default CartPanel;
