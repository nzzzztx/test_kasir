import "../../assets/css/receipt.css";

const ReceiptPreview = ({ transaction, visible, onClose }) => {
    if (!transaction) return null;

    const {
        items = [],
        total = 0,
        discount = null,
        finalTotal = 0,
        paidAmount = 0,
        change = 0,
    } = transaction;

    return (
        <div
            className="receipt-overlay"
            style={{ display: visible ? "flex" : "none" }}
        >
            <div className="receipt-card">
                <div id="receipt-print">
                    <h3 className="receipt-title">TOKO XML</h3>
                    <p className="receipt-sub">
                        Jl. Maju Terus Tanpa Batas. 173 Cilacap Tenggara
                    </p>

                    <div className="receipt-line" />

                    {items.map((item) => (
                        <div key={item.code} className="receipt-row">
                            <span>
                                {item.name} x{item.qty}
                            </span>
                            <span>
                                Rp {(item.sellPrice * item.qty).toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}

                    <div className="receipt-line" />

                    <div className="receipt-row">
                        <strong>Total</strong>
                        <strong>Rp {total.toLocaleString("id-ID")}</strong>
                    </div>

                    {discount && (
                        <div className="receipt-row">
                            <span>Diskon</span>
                            <span>
                                {discount.type === "percent"
                                    ? `${discount.value}%`
                                    : `Rp ${discount.value.toLocaleString("id-ID")}`}
                            </span>
                        </div>
                    )}

                    <div className="receipt-row total">
                        <strong>Total Bayar</strong>
                        <strong>Rp {finalTotal.toLocaleString("id-ID")}</strong>
                    </div>

                    <div className="receipt-row">
                        <span>Dibayar</span>
                        <span>Rp {paidAmount.toLocaleString("id-ID")}</span>
                    </div>

                    {paidAmount > finalTotal && (
                        <div className="receipt-row">
                            <span>Kembalian</span>
                            <span>Rp {change.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    <p className="receipt-footer">Terima kasih 🙏</p>
                </div>

                <button className="receipt-close" onClick={onClose}>
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default ReceiptPreview;
