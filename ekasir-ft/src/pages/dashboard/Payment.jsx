import { useEffect, useState } from "react";
import { isStockEnough, reduceStock } from "../../utils/stock";
import { getInfoToko } from "../../utils/toko";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { getCurrentOwnerId } from "../../utils/owner";

import "../../assets/css/dashboard.css";
import "../../assets/css/payment.css";
import Sidebar from "../../components/Sidebar";

import PaymentContent from "../../components/Payment/PaymentContent";
import PaymentValidasi from "../../components/Payment/PaymentValidasi";
import ReceiptPreview from "../../components/Payment/ReceiptPreview";

const Payment = () => {
    const ownerId = getCurrentOwnerId();
    const { authData } = useAuth();

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const [paidAmount, setPaidAmount] = useState("");
    const [method, setMethod] = useState("TUNAI");
    const [subMethod, setSubMethod] = useState(null);

    const [showReceipt, setShowReceipt] = useState(false);
    const [showValidasi, setShowValidasi] = useState(false);
    const [kembalian, setKembalian] = useState(0);
    const [receiptData, setReceiptData] = useState(null);
    const store = getInfoToko();
    const { pushNotification } = useNotifications();

    useEffect(() => {
        if (!ownerId) {
            setLoading(false);
            return;
        }

        const saved = localStorage.getItem(
            `current_transaction_owner_${ownerId}`
        );

        if (!saved) {
            setLoading(false);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            if (parsed?.items?.length) {
                setTransaction(parsed);
            }
        } catch { }

        setLoading(false);
    }, [ownerId]);

    const handleKeyPress = (key) => {
        if (!transaction) return;

        const finalTotal = Number(transaction.finalTotal || 0);

        if (key === "C") return setPaidAmount("");
        if (key === "⌫") return setPaidAmount(prev => prev.slice(0, -1));

        if (key === "✓") {

            const activeShift = JSON.parse(
                localStorage.getItem(`active_shift_${ownerId}`)
            );

            if (!activeShift) {
                alert("Shift belum dimulai");
                return;
            }

            if (method === "EDC" && !subMethod) {
                alert("Pilih metode detail terlebih dahulu");
                return;
            }

            const paid =
                method === "TUNAI"
                    ? Number(paidAmount || 0)
                    : finalTotal;

            if (paid < finalTotal) {
                alert("Pembayaran belum lunas");
                return;
            }

            const change = paid - finalTotal;

            const products = JSON.parse(
                localStorage.getItem(`products_${ownerId}`) || "[]"
            );

            const cartItems = transaction.items.map(item => ({
                productKey: item.code,
                qty: item.qty,
            }));

            if (!isStockEnough(products, cartItems)) {
                alert("Stok berubah / tidak mencukupi");
                return;
            }

            const updatedProducts = reduceStock(products, cartItems);

            localStorage.setItem(
                `products_${ownerId}`,
                JSON.stringify(updatedProducts)
            );

            const invoiceKey = `invoice_counter_owner_${ownerId}`;
            const lastNumber =
                Number(localStorage.getItem(invoiceKey) || 0) + 1;

            localStorage.setItem(invoiceKey, lastNumber);

            const invoiceNumber =
                `INV-${ownerId}-${String(lastNumber).padStart(5, "0")}`;

            const updatedTransaction = {
                ...transaction,
                invoiceNumber,
                paidAmount: paid,
                change,
                paymentMethod: method,
                paymentSubMethod: subMethod,
                paidAt: new Date().toISOString(),
                status: "paid",
                cashier:
                    transaction.cashier ||
                    activeShift.cashier ||
                    "Kasir",
                shiftStartedAt: activeShift.startedAt,
            };

            const transactionsKey = `transactions_owner_${ownerId}`;
            const history = JSON.parse(
                localStorage.getItem(transactionsKey) || "[]"
            );

            history.unshift(updatedTransaction);

            localStorage.setItem(
                transactionsKey,
                JSON.stringify(history)
            );

            localStorage.removeItem(
                `current_transaction_owner_${ownerId}`
            );

            pushNotification({
                type: "payment",
                title: "Pembayaran Berhasil",
                message: `Transaksi ${invoiceNumber} berhasil`,
                ref: updatedTransaction.id,
            });

            setTransaction(updatedTransaction);
            setReceiptData(updatedTransaction);
            setKembalian(change);
            setShowValidasi(true);

            setPaidAmount("");
            setMethod("TUNAI");
            setSubMethod(null);

            return;
        }

        setPaidAmount(prev => prev + key);
    };

    if (!ownerId) {
        console.error("OWNER ID NOT FOUND");
        return null;
    }

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
                        onConfirm={() => handleKeyPress("✓")}
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
