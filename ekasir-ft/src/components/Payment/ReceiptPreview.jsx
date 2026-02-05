import "../../assets/css/receipt.css";
import { getInfoToko } from "../../utils/toko";

const ReceiptPreview = ({ transaction, visible, onClose }) => {
    if (!transaction) return null;

    const {
        items = [],
        subtotal = 0,
        discount = null,
        discountAmount = 0,
        tax = null,
        taxAmount = 0,
        finalTotal = 0,
        paidAmount = 0,
        change = 0,
    } = transaction;

    const { namaToko, lokasi, telepon } = getInfoToko();
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
                    <h3 className="receipt-title">{namaToko}</h3>
                    {lokasi && lokasi !== "-" && (
                        <p className="receipt-sub">{lokasi}</p>
                    )}
                    {/* {telepon && telepon !== "-" && (
                        <p className="receipt-sub">Telp: {telepon}</p>
                    )} */}
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

                    {(customer.name || customer.phone || customer.address) && (
                        <>
                            <div className="receipt-customer">
                                <div className="receipt-row">
                                    <span>Pelanggan</span>
                                    <span>{customer.name || "Umum"}</span>
                                </div>

                                {customer.phone && customer.phone !== "-" && (
                                    <div className="receipt-row">
                                        <span>No. HP</span>
                                        <span>{customer.phone}</span>
                                    </div>
                                )}

                                {customer.address && customer.address !== "-" && (
                                    <div className="receipt-row">
                                        <span>Alamat</span>
                                        <span className="align-right">{customer.address}</span>
                                    </div>
                                )}
                            </div>

                            <div className="receipt-line" />
                        </>
                    )}

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
                        <strong>Subtotal</strong>
                        <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
                    </div>

                    {discount && discountAmount > 0 && (
                        <div className="receipt-row">
                            <span>
                                Diskon
                                {discount?.name ? ` (${discount.name}` : ""}
                                {discount?.type === "percent" ? ` ${discount.value}%` : ""}
                                {discount?.name ? ")" : ""}
                            </span>
                            <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    {tax && taxAmount > 0 && (
                        <div className="receipt-row">
                            <span>
                                Pajak
                                {tax?.name ? ` (${tax.name}` : ""}
                                {tax?.type === "percent" ? ` ${tax.value}%` : ""}
                                {tax?.name ? ")" : ""}
                            </span>
                            <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
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

                    {paidAmount >= finalTotal && change > 0 && (
                        <div className="receipt-row">
                            <span>Kembalian</span>
                            <span>Rp {change.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    {paidAmount < finalTotal && (
                        <div className="receipt-row unpaid">
                            <span>Kurang Bayar</span>
                            <span>- Rp {(finalTotal - paidAmount).toLocaleString("id-ID")}</span>
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
