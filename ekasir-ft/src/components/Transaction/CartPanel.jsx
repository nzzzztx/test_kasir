import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const navigate = useNavigate();
    const [discount, setDiscount] = useState(null);
    const [showDiscount, setShowDiscount] = useState(false);
    const [tax, setTax] = useState(null);
    const [showTax, setShowTax] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [paidAmount, setPaidAmount] = useState(0);

    const subtotal = cart.reduce(
        (sum, i) => sum + i.sellPrice * i.qty,
        0
    );

    const [customer, setCustomer] = useState({
        name: "",
        phone: "",
        address: "",
    });

    const afterDiscount = (() => {
        if (!discount) return subtotal;

        if (discount.type === "percent") {
            return subtotal - subtotal * (discount.value / 100);
        }

        return subtotal - discount.value;
    })();

    const taxAmount = (() => {
        if (!tax) return 0;

        if (tax.type === "percent") {
            return afterDiscount * (tax.value / 100);
        }

        return tax.value;
    })();

    const finalTotal = Math.max(afterDiscount + taxAmount, 0);

    const removeItem = (code) => {
        setCart((prev) => prev.filter((i) => i.code !== code));
    };

    const handleOpenDiscount = () => {
        if (!discounts?.length) {
            alert("Tidak ada diskon tersedia");
            return;
        }

        setShowDiscount(true);
    };

    const handlePay = () => {
        if (!cart.length) return;

        const activeShift = JSON.parse(
            localStorage.getItem(`active_shift_${ownerId}`)
        );

        if (!activeShift) {
            alert("Belum ada shift aktif");
            return;
        }

        const payload = {
            id: Date.now(),
            items: [...cart],
            customer: {
                name: customer.name?.trim() || "Umum",
                phone: customer.phone?.trim() || "-",
                address: customer.address?.trim() || "-",
            },
            subtotal,
            discount,
            discountAmount: Math.max(subtotal - afterDiscount, 0),
            tax,
            taxAmount,
            finalTotal,
            cashier:
                cashierName ||
                activeShift.cashier ||
                "Kasir",
            shiftStartedAt: activeShift.startedAt,
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem(
            `current_transaction_owner_${ownerId}`,
            JSON.stringify(payload)
        );

        if (!ownerId) {
            alert("Owner tidak ditemukan");
            return;
        }

        navigate("/dashboard/transaction/payment");
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
                    maxQty={editItem.stock ?? editItem.qty}
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
                    title="Pilih Diskon"
                    storageKey={`discounts_${ownerId}`}
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
                    storageKey={`taxes_${ownerId}`}
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
