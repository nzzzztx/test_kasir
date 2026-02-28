import { useEffect, useState } from "react";
import { getInfoToko } from "../../utils/toko";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { getCurrentOwnerId } from "../../utils/owner";
import { useNavigate } from "react-router-dom";
import { useShift } from "../../context/ShiftContext";

import "../../assets/css/dashboard.css";
import "../../assets/css/payment.css";
import Sidebar from "../../components/Sidebar";

import PaymentContent from "../../components/Payment/PaymentContent";
import PaymentValidasi from "../../components/Payment/PaymentValidasi";
import ReceiptPreview from "../../components/Payment/ReceiptPreview";

const Payment = () => {
    const ownerId = getCurrentOwnerId();
    const { authData } = useAuth();
    const navigate = useNavigate();
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
    const { activeShift, loadingShift } = useShift();

    useEffect(() => {
        if (!ownerId) {
            setLoading(false);
            return;
        }

        const saved = localStorage.getItem(
            `pending_transaction_owner_${ownerId}`
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
        } catch (err) {
            console.error("Gagal parse transaksi:", err);
        }

        setLoading(false);
    }, [ownerId]);

    const handleKeyPress = async (key) => {
        if (!transaction) return;

        const finalTotal = Number(transaction.finalTotal || 0);

        if (key === "C") return setPaidAmount("");
        if (key === "⌫") return setPaidAmount(prev => prev.slice(0, -1));

        if (key === "✓") {

            if (loadingShift) {
                alert("Memuat shift...");
                return;
            }

            if (!activeShift) {
                alert("Shift belum dimulai");
                return;
            }

            if (activeShift.status?.toUpperCase() !== "ACTIVE") {
                alert("Shift sudah ditutup");
                return;
            }

            if (["EDC", "TRANSFER", "EWALLET"].includes(method) && !subMethod) {
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

            try {
                const response = await fetch(
                    "http://localhost:5000/api/transactions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authData?.token}`,
                        },
                        body: JSON.stringify({
                            shift_id: activeShift.id,
                            payment_method: method,
                            payment_sub_method: subMethod,
                            paid_amount: paid,
                            discount_total: transaction.discountTotal || 0,
                            tax_total: transaction.taxTotal || 0,
                            items: transaction.items.map(i => ({
                                product_id: i.id,
                                qty: i.qty,
                            })),
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Transaksi gagal");
                    return;
                }

                const updatedTransaction = {
                    ...transaction,
                    invoiceNumber: data.invoice,
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

                localStorage.removeItem(
                    `pending_transaction_owner_${ownerId}`
                );

                pushNotification({
                    type: "payment",
                    title: "Pembayaran Berhasil",
                    message: `Transaksi ${data.invoice} berhasil`,
                });

                setTransaction(updatedTransaction);
                setReceiptData(updatedTransaction);
                setKembalian(change);
                setShowValidasi(true);

                setPaidAmount("");
                setMethod("TUNAI");
                setSubMethod(null);

            } catch (err) {
                console.error(err);
                alert("Terjadi kesalahan koneksi");
            }

            return;
        }

        setPaidAmount(prev => prev + key);
    };

    const handleFinishTransaction = () => {
        setShowValidasi(false);
        setShowReceipt(false);
        setTransaction(null);
        setReceiptData(null);
        setPaidAmount("");
        setMethod("TUNAI");
        setSubMethod(null);

        navigate("/dashboard/transaction");
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
                        setPaidAmount={setPaidAmount}
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
                    onClose={handleFinishTransaction}
                    onViewReceipt={() => setShowReceipt(true)}
                />
            )}
        </div>
    );
};

export default Payment;
