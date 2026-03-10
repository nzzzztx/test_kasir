import { useEffect, useState } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { getCurrentOwnerId } from "../../utils/owner";
import { useNavigate } from "react-router-dom";
import { useShift } from "../../context/ShiftContext";
import { getInfoToko } from "../../utils/toko";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

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
    const [toko, setToko] = useState(null);

    const [searchParams] = useSearchParams();
    const invoiceId = searchParams.get("invoice_id");
    const transactionCreated = useRef(false);

    const [paidAmount, setPaidAmount] = useState("");
    const [method, setMethod] = useState("TUNAI");
    const [subMethod, setSubMethod] = useState(null);

    const [showReceipt, setShowReceipt] = useState(false);
    const [showValidasi, setShowValidasi] = useState(false);
    const [kembalian, setKembalian] = useState(0);
    const [receiptData, setReceiptData] = useState(null);
    const { pushNotification } = useNotifications();
    const { activeShift, loadingShift } = useShift();

    useEffect(() => {
        if (!authData?.token) return;

        const fetchToko = async () => {
            const data = await getInfoToko(authData.token);
            if (data) {
                setToko(data);
            }
        };

        fetchToko();
    }, [authData?.token]);

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

    useEffect(() => {

        const checkPayment = async () => {

            if (!invoiceId || !authData?.token || loadingShift || !activeShift) return;

            try {

                const res = await fetch(
                    `http://192.168.2.20:5000/api/payment/status/${invoiceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authData?.token}`
                        }
                    }
                );

                const data = await res.json();

                if (data.status === "PAID" && !transactionCreated.current) {

                    transactionCreated.current = true;

                    const saved = localStorage.getItem(
                        `pending_transaction_owner_${ownerId}`
                    );

                    if (!saved) return;

                    const pending = JSON.parse(saved);

                    const finalTotal = Number(pending.finalTotal || 0);

                    /* =========================
                       CREATE TRANSACTION
                    ========================= */

                    const response = await fetch(
                        "http://192.168.2.20:5000/api/transactions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authData?.token}`,
                            },
                            body: JSON.stringify({
                                shift_id: activeShift.id,
                                customer_id: pending.customer_id || null,
                                payment_method: pending.payment_method,
                                payment_sub_method: pending.payment_sub_method,

                                grand_total: finalTotal,
                                paid_amount: finalTotal,

                                discount_total: pending.discountTotal || 0,
                                tax_total: pending.taxTotal || 0,

                                items: pending.items.map(i => ({
                                    product_id: i.product_id,
                                    qty: i.qty
                                }))
                            })
                        }
                    );

                    if (!response.ok) {
                        const err = await response.json();
                        alert(err.message || "Gagal membuat transaksi");
                        return;
                    }

                    const trx = await response.json();

                    const completedTransaction = {
                        ...pending,
                        invoiceNumber: trx.invoice,
                        paidAmount: finalTotal,
                        change: 0,
                        paymentMethod: pending.payment_method,
                        paymentSubMethod: pending.payment_sub_method,
                        paidAt: new Date().toISOString(),
                        status: "paid"
                    };

                    setTransaction(completedTransaction);
                    setReceiptData(completedTransaction);
                    setKembalian(0);
                    setShowValidasi(true);

                    localStorage.removeItem(
                        `pending_transaction_owner_${ownerId}`
                    );
                }
            } catch (err) {
                console.error(err);
            }

        };

        checkPayment();

    }, [invoiceId, authData?.token, ownerId, activeShift, loadingShift]);

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

            /* ================================
             XENDIT PAYMENT
            ================================ */

            if (["QRIS", "TRANSFER", "EWALLET"].includes(method)) {

                try {

                    const res = await fetch(
                        "http://192.168.2.20:5000/api/payment/invoice",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${authData?.token}`,
                            },
                            body: JSON.stringify({
                                amount: finalTotal,
                                items: transaction.items
                            })
                        }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        alert(data.message || "Gagal membuat invoice");
                        return;
                    }

                    if (data.invoice_url) {

                        // simpan transaksi sementara
                        localStorage.setItem(
                            `pending_transaction_owner_${ownerId}`,
                            JSON.stringify({
                                ...transaction,
                                customer_id: transaction.customer_id || null,
                                payment_method: method,
                                payment_sub_method: subMethod,
                                shift_id: activeShift.id
                            })
                        );

                        // redirect ke Xendit
                        window.location.href = data.invoice_url;

                    }

                } catch (err) {

                    console.error(err);
                    alert("Gagal koneksi ke payment gateway");

                }

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
                    "http://192.168.2.20:5000/api/transactions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authData?.token}`,
                        },
                        body: JSON.stringify({
                            shift_id: activeShift.id,
                            customer_id: transaction.customer_id || null,
                            payment_method: method,
                            payment_sub_method: subMethod,

                            discount_total: transaction.discountTotal || 0,
                            tax_total: transaction.taxTotal || 0,

                            paid_amount: paid,
                            items: transaction.items.map(i => ({
                                product_id: i.product_id,
                                qty: i.qty
                            }))
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log("ERROR RESPONSE:", data);
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

                window.dispatchEvent(new Event("stockUpdated"));

                pushNotification({
                    type: "payment",
                    title: "Pembayaran Berhasil",
                    message: `Transaksi ${data.invoice} berhasil`,
                    role: ["owner", "kasir"],
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
        return <div className="payment-empty">Owner tidak ditemukan</div>;
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
                    toko={toko}
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
