import qrImage from "../../assets/img/qrcode.png";
import { useEffect, useState } from "react";
import { getActiveEDC } from "../../utils/edc";

const PaymentContent = ({
    transaction,
    paidAmount,
    onKeyPress,
    method,
    setMethod,
    subMethod,
    setSubMethod,
    setPaidAmount,
    onConfirm,
}) => {
    const {
        items = [],
        subtotal = 0,
        discount = null,
        discountAmount = 0,
        tax = null,
        taxAmount = 0,
        finalTotal = 0,
    } = transaction;

    const customer = transaction.customer || {};
    const [activeEDC, setActiveEDC] = useState([]);
    const isCash = method === "TUNAI";

    useEffect(() => {
        setActiveEDC(getActiveEDC());
    }, []);


    return (
        <div className="payment-layout">
            <div className="payment-card-list">
                <div className="payment-customer">
                    <h4 className="card-title">Pelanggan</h4>

                    <div className="customer-row">
                        <span className="label">Nama</span>
                        <span className="value">
                            {customer.name || "Umum"}
                        </span>
                    </div>

                    <div className="customer-row">
                        <span className="label">No. Telepon</span>
                        <span className="value">
                            {customer.phone || "-"}
                        </span>
                    </div>

                    {customer.address && customer.address !== "-" && (
                        <div className="customer-row">
                            <span className="label">Alamat</span>
                            <span className="value">
                                {customer.address}
                            </span>
                        </div>
                    )}
                </div>

                <h4 className="card-title">List Barang</h4>

                <div className="payment-receipt-list">
                    {items.map((item) => (
                        <div key={item.code} className="payment-receipt-item">
                            <div className="qty">{item.qty}</div>

                            <div className="item-info">
                                <div className="name">{item.name}</div>
                                <div className="sub">
                                    Rp {(item.sellPrice * item.qty).toLocaleString("id-ID")}
                                </div>
                            </div>

                            <div className="price">
                                Rp {(item.sellPrice * item.qty).toLocaleString("id-ID")}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="payment-receipt-summary">
                    <div className="row">
                        <span>Subtotal</span>
                        <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>

                    {discount && discountAmount > 0 && (
                        <div className="row discount">
                            <span>
                                Diskon
                                {discount?.name ? ` (${discount.name}` : ""}
                                {discount?.type === "percent" ? ` ${discount.value}%` : ""}
                                {discount?.name ? ")" : ""}
                            </span>
                            <span>Rp -{discountAmount.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    {tax && taxAmount > 0 && (
                        <div className="row">
                            <span>
                                Pajak
                                {tax?.name ? ` (${tax.name}` : ""}
                                {tax?.type === "percent" ? ` ${tax.value}%` : ""}
                                {tax?.name ? ")" : ""}
                            </span>
                            <span>Rp {taxAmount.toLocaleString("id-ID")}</span>
                        </div>
                    )}

                    <div className="divider" />

                    <div className="row total">
                        <span>Total Bayar</span>
                        <span>Rp {finalTotal.toLocaleString("id-ID")}</span>
                    </div>
                </div>

                <div className="payment-method">
                    <h5>Metode Pembayaran</h5>

                    <div className="payment-method-list">
                        {["TUNAI", "QRIS", "TRANSFER", "EWALLET"].map((m) => (
                            <button
                                key={m}
                                className={`method ${method === m ? "active" : ""}`}
                                onClick={() => {
                                    setMethod(m);
                                    setSubMethod(null);
                                    setPaidAmount("");
                                }}
                            >
                                {m === "EWALLET" ? "E-Wallet" : m}
                            </button>
                        ))}

                        {activeEDC.length > 0 && (
                            <button
                                className={`method ${method === "EDC" ? "active" : ""}`}
                                onClick={() => {
                                    setMethod("EDC");
                                    setSubMethod(null);
                                    setPaidAmount("");
                                }}
                            >
                                EDC
                            </button>
                        )}
                    </div>

                    {method === "TRANSFER" && (
                        <div className="payment-submethod">
                            <div className="submethod-label">Pilih Bank</div>
                            <div className="submethod-list">
                                {["BCA", "Mandiri", "BRI", "BNI", "BSI", "BANK LAINNYA"].map(
                                    (bank) => (
                                        <button
                                            key={bank}
                                            className={`submethod ${subMethod === bank ? "active" : ""
                                                }`}
                                            onClick={() => setSubMethod(bank)}
                                        >
                                            {bank}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {method === "EWALLET" && (
                        <div className="payment-submethod">
                            <div className="submethod-label">Pilih E-Wallet</div>
                            <div className="submethod-list">
                                {["GoPay", "OVO", "DANA", "ShopeePay", "LINK AJA"].map(
                                    (wallet) => (
                                        <button
                                            key={wallet}
                                            className={`submethod ${subMethod === wallet ? "active" : ""
                                                }`}
                                            onClick={() => setSubMethod(wallet)}
                                        >
                                            {wallet}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {method === "EDC" && (
                        <div className="payment-submethod">
                            <div className="submethod-label">Pilih Perangkat EDC</div>
                            <div className="submethod-list">
                                {activeEDC.map((edc) => (
                                    <button
                                        key={edc.id}
                                        className={`submethod ${subMethod === edc.id ? "active" : ""}`}
                                        onClick={() => setSubMethod(edc.id)}
                                    >
                                        {edc.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {method === "QRIS" && (
                        <div className="payment-info">
                            <div className="qris-box">
                                <img src={qrImage} alt="QRIS" className="qris-image" />
                                <p className="qris-text">Scan QR untuk membayar</p>
                                <span className="qris-amount">
                                    Rp {finalTotal.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    )}

                    {method === "TRANSFER" && subMethod && (
                        <div className="payment-info">
                            <div className="rekening-box">
                                <div className="bank-name">{subMethod}</div>
                                <div className="rekening-number">123 456 7890</div>
                                <div className="rekening-owner">a.n Toko Demo</div>
                            </div>
                        </div>
                    )}

                    {method === "EWALLET" && subMethod && (
                        <div className="payment-info">
                            <div className="ewallet-box">
                                <div className="wallet-name">{subMethod}</div>
                                <div className="wallet-number">0812-3456-7890</div>
                                <div className="wallet-owner">Toko Demo</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="payment-card keypad-card">
                <h4 className="card-title">Pembayaran</h4>

                <div className="payment-display big">
                    {method === "TUNAI"
                        ? `Rp ${Number(paidAmount || 0).toLocaleString("id-ID")}`
                        : `Rp ${finalTotal.toLocaleString("id-ID")}`}
                </div>

                <div className={`keypad ${!isCash ? "disabled" : ""}`}>
                    {[
                        "1", "2", "3", "C",
                        "4", "5", "6", "⌫",
                        "7", "8", "9", ".",
                        "0", "00", "000", "✓",
                    ].map((k) => (
                        <button
                            key={k}
                            onClick={() => onKeyPress(k)}
                            className={`key ${k === "✓" ? "confirm" : ""} ${k === "⌫" ? "delete" : ""}`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
                {!isCash && (
                    <button
                        className="btn-confirm-noncash"
                        onClick={() => onConfirm()}
                    >
                        Konfirmasi Pembayaran
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentContent;
