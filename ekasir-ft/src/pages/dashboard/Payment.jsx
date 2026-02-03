import { useEffect, useState } from "react";
import { isStockEnough, reduceStock } from "../../utils/stock";
import "../../assets/css/dashboard.css";
import "../../assets/css/payment.css";
import Sidebar from "../../components/Sidebar";

import PaymentContent from "../../components/Payment/PaymentContent";
import PaymentValidasi from "../../components/Payment/PaymentValidasi";
import ReceiptPreview from "../../components/Payment/ReceiptPreview";

const Payment = () => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const [paidAmount, setPaidAmount] = useState("");
    const [method, setMethod] = useState("TUNAI");
    const [subMethod, setSubMethod] = useState(null);

    const [showReceipt, setShowReceipt] = useState(false);
    const [showValidasi, setShowValidasi] = useState(false);
    const [kembalian, setKembalian] = useState(0);
    const [receiptData, setReceiptData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("current_transaction");
        if (!saved) return setLoading(false);

        try {
            const parsed = JSON.parse(saved);
            if (parsed?.items?.length) setTransaction(parsed);
        } catch { }

        setLoading(false);
    }, []);

    const handleKeyPress = (key) => {
        if (!transaction) return;

        const finalTotal = transaction.finalTotal;

        if (key === "C") return setPaidAmount("");
        if (key === "⌫") return setPaidAmount(prev => prev.slice(0, -1));

        if (key === "✓") {
            const activeShift = JSON.parse(localStorage.getItem("active_shift"));

            if (!activeShift) {
                alert("Shift belum dimulai");
                return;
            }

            if (method === "TRANSFER" && !subMethod) {
                alert("Pilih bank terlebih dahulu");
                return;
            }

            if (method === "EWALLET" && !subMethod) {
                alert("Pilih e-wallet terlebih dahulu");
                return;
            }

            const paid = Number(paidAmount || 0);
            const isPaid = paid >= finalTotal;
            const change = isPaid ? paid - finalTotal : 0;

            if (!isPaid) {
                alert("Pembayaran belum lunas");
                return;
            }

            const products = JSON.parse(localStorage.getItem("products") || "[]");

            const cartItems = transaction.items.map(item => ({
                productKey: item.code,
                qty: item.qty,
            }));

            if (!isStockEnough(products, cartItems)) {
                alert("Stok berubah / tidak mencukupi");
                return;
            }

            const updatedProducts = reduceStock(products, cartItems);
            localStorage.setItem("products", JSON.stringify(updatedProducts));

            const updatedTransaction = {
                ...transaction,
                paidAmount: paid,
                change,
                paymentMethod: method,
                paymentSubMethod: subMethod,
                createdAt: transaction.createdAt ?? new Date().toISOString(),
                paidAt: new Date().toISOString(),
                status: "paid",

                shiftStartedAt: activeShift.startedAt,
            };

            localStorage.setItem(
                "current_transaction",
                JSON.stringify(updatedTransaction)
            );

            const history = JSON.parse(
                localStorage.getItem("transaction_history") || "[]"
            );

            history.push({
                nomor: updatedTransaction.invoiceNumber ?? updatedTransaction.nomor,
                createdAt: updatedTransaction.createdAt,
                paidAt: updatedTransaction.paidAt,
                outlet: "Toko Masuk Pak Eko",
                jenis_order: "Lainnya",
                total: updatedTransaction.finalTotal,
                metode: method,
                status: updatedTransaction.status,

                shiftStartedAt: activeShift.startedAt,
            });

            localStorage.setItem(
                "transaction_history",
                JSON.stringify(history)
            );

            setTransaction(updatedTransaction);
            setReceiptData(updatedTransaction);
            setKembalian(change);

            setShowReceipt(false);
            setShowValidasi(true);
            return;
        }

        setPaidAmount(prev => prev + key);
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content payment-page">
                <header className="content-header">
                    <div className="header-left">
                        <button className="payment-back-btn" onClick={() => window.history.back()}>
                            ←
                        </button>
                        <h1>Transaksi</h1>
                    </div>
                </header>

                {loading ? (
                    <div className="payment-empty">Memuat transaksi...</div>
                ) : !transaction ? (
                    <div className="payment-empty">Tidak ada transaksi</div>
                ) : (
                    <PaymentContent
                        transaction={transaction}
                        paidAmount={paidAmount}
                        onKeyPress={handleKeyPress}
                        method={method}
                        setMethod={setMethod}
                        subMethod={subMethod}
                        setSubMethod={setSubMethod}
                    />
                )}

                <ReceiptPreview
                    transaction={receiptData}
                    visible={showReceipt}
                    onClose={() => setShowReceipt(false)}
                />
            </div>

            {showValidasi && (
                <PaymentValidasi
                    kembalian={kembalian}
                    onClose={() => setShowValidasi(false)}
                    onViewReceipt={() => setShowReceipt(true)}
                />
            )}
        </div>
    );
};

export default Payment;
