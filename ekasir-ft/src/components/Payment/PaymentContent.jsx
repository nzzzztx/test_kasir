import qrImage from "../../assets/img/qrcode.png";

const PaymentContent = ({
    transaction,
    paidAmount,
    onKeyPress,
    method,
    setMethod,
    subMethod,
    setSubMethod,
}) => {
    const {
        items = [],
        total = 0,
        finalTotal = 0,
        discount = null,
    } = transaction;

    return (
        <div className="payment-layout">
            <div className="payment-card-list">
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
                        <span>Total</span>
                        <span>Rp {total.toLocaleString("id-ID")}</span>
                    </div>

                    {discount && (
                        <div className="row discount">
                            <span>Diskon</span>
                            <span>- Rp {discount.value.toLocaleString("id-ID")}</span>
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
                                }}
                            >
                                {m === "EWALLET" ? "E-Wallet" : m}
                            </button>
                        ))}
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
                    Rp {Number(paidAmount || 0).toLocaleString("id-ID")}
                </div>

                <div className="keypad">
                    {[
                        "1", "2", "3", "C",
                        "4", "5", "6", "⌫",
                        "7", "8", "9", ".",
                        "0", "00", "000", "✓",
                    ].map((k) => (
                        <button
                            key={k}
                            onClick={() => onKeyPress(k)}
                            className={`key ${k === "✓" ? "confirm" : ""
                                } ${k === "⌫" ? "delete" : ""}`}
                        >
                            {k}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentContent;
