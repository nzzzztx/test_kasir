import "../../assets/css/receipt.css";

const ReceiptPreview = ({ transaction, visible, onClose, toko = {} }) => {
    if (!transaction) return null;

    const tokoData = {
        namaToko: toko?.namaToko || "Nama Toko",
        lokasi: toko?.lokasi || "-",
        telepon: toko?.telepon || "-"
    };

    const {
        items = [],
        subtotal = 0,
        discount = null,
        discountTotal = 0,
        taxTotal = 0,
        tax = null,
        finalTotal = 0,
        paidAmount = 0,
        change = 0,
    } = transaction;

    const cashier = transaction.cashier;
    const isUnpaid = paidAmount < finalTotal;
    const customer = transaction.customer || {};

    return (
        <div
            className="receipt-overlay"
            style={{ display: visible ? "flex" : "none" }}
        >
            <div className="receipt-card">
                <div id="receipt-print">

                    <h3 className="receipt-title center">
                        {tokoData.namaToko}
                    </h3>

                    {tokoData.lokasi !== "-" && (
                        <p className="receipt-sub">{tokoData.lokasi}</p>
                    )}

                    {tokoData.telepon !== "-" && (
                        <p className="receipt-sub">Telp: {tokoData.telepon}</p>
                    )}

                    <div className="receipt-line thick" />

                    {transaction.invoiceNumber && (
                        <>
                            <div className="receipt-row">
                                <span>No Invoice</span>
                                <span>{transaction.invoiceNumber}</span>
                            </div>
                            <div className="receipt-row">
                                <span>Tanggal</span>
                                <span>
                                    {new Date(transaction.paidAt || transaction.createdAt)
                                        .toLocaleString("id-ID")}
                                </span>
                            </div>
                            <div className="receipt-line" />
                        </>
                    )}

                    {cashier && (
                        <>
                            <div className="receipt-row">
                                <span>Kasir</span>
                                <span>{cashier}</span>
                            </div>
                            <div className="receipt-line" />
                        </>
                    )}

                    <div className={`receipt-status ${isUnpaid ? "unpaid" : "paid"}`}>
                        {isUnpaid ? "BELUM LUNAS" : "LUNAS"}
                    </div>

                    {(customer.name || customer.phone) && (
                        <>
                            <div className="receipt-customer">
                                <div className="receipt-row">
                                    <span>Pelanggan</span>
                                    <span>{customer.name || "Umum"}</span>
                                </div>

                                {/* {customer.phone && (
                                    <div className="receipt-row">
                                        <span>No. HP</span>
                                        <span>{customer.phone}</span>
                                    </div>
                                )} */}
                            </div>
                            <div className="receipt-line" />
                        </>
                    )}

                    {items.map((item) => {
                        const name = item.name ?? item.product_name ?? "-";
                        const price = item.sellPrice ?? item.price ?? 0;

                        return (
                            <div key={item.id} className="receipt-item">
                                <div className="receipt-item-name">
                                    {name}
                                </div>
                                <div className="receipt-row">
                                    <span>
                                        {item.qty} x Rp {Number(price).toLocaleString("id-ID")}
                                    </span>
                                    <span>
                                        Rp {(Number(price) * item.qty).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <div className="receipt-line" />

                    <div className="receipt-row">
                        <strong>Subtotal</strong>
                        <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
                    </div>

                    {discount && discountTotal > 0 && (
                        <div className="receipt-row">
                            <span>Diskon</span>
                            <span>- Rp {discountTotal.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    {tax && taxTotal > 0 && (
                        <div className="receipt-row">
                            <span>Pajak</span>
                            <span>Rp {taxTotal.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    <div className="receipt-row total">
                        <strong>Total Bayar</strong>
                        <strong>Rp {finalTotal.toLocaleString("id-ID")}</strong>
                    </div>

                    <div className="receipt-line" />

                    <div className="receipt-row">
                        <span>Dibayar</span>
                        <span>Rp {paidAmount.toLocaleString("id-ID")}</span>
                    </div>

                    {change > 0 && (
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