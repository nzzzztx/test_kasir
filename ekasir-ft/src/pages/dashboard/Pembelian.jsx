import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentOwnerId } from "../../utils/owner";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import "../../assets/css/dashboard.css";
import "../../assets/css/pembelian.css";
import html2pdf from "html2pdf.js";

import PembelianForm from "../../components/Pembelian/PembelianForm";
import PembelianItems from "../../components/Pembelian/PembelianItems";
import PembelianSummary from "../../components/Pembelian/PembelianSummary";
import PembelianActions from "../../components/Pembelian/PembelianActions";
import PembelianDraftPDF from "../../components/Pembelian/PembelianDraftPDF";
import PembelianInvoicePDF from "../../components/Pembelian/PembelianInvoicePDF";

import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const Pembelian = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const ownerId = getCurrentOwnerId();

    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [supplier, setSupplier] = useState(null);
    const [paidAmount, setPaidAmount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tanggal, setTanggal] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [lastSavedPembelian, setLastSavedPembelian] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("belum_lunas");

    const isSupplierLocked = items.length > 0;

    const total = useMemo(() => {
        return items.reduce(
            (sum, item) =>
                sum + Number(item.qty) * Number(item.price),
            0
        );
    }, [items]);

    const sisa = Math.max(total - paidAmount, 0);

    // ================= FETCH SUPPLIERS =================
    useEffect(() => {
        if (!authData?.token) return;

        const fetchSuppliers = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/suppliers",
                    {
                        headers: {
                            Authorization: `Bearer ${authData.token}`,
                        },
                    }
                );

                const data = await res.json();
                if (res.ok) setSuppliers(data);
            } catch (err) {
                console.error("Fetch suppliers failed:", err);
            }
        };

        fetchSuppliers();
    }, [authData?.token]);

    // ================= LOAD DRAFT =================
    useEffect(() => {
        if (!ownerId) return;

        const draft = localStorage.getItem(
            `pembelian_draft_owner_${ownerId}`
        );
        if (draft) {
            const parsed = JSON.parse(draft);
            setItems(parsed.items || []);
            setSupplier(parsed.supplier || null);
            setPaidAmount(parsed.paidAmount || 0);
        }
    }, [ownerId]);

    // ================= AUTO EXPORT PDF =================
    useEffect(() => {
        if (!lastSavedPembelian) return;

        setTimeout(() => {
            const el = document.getElementById("invoice-pdf");
            if (!el) return;

            html2pdf()
                .from(el)
                .set({
                    filename: `${lastSavedPembelian.invoiceNumber}.pdf`,
                    margin: 10,
                    html2canvas: { scale: 2 },
                    jsPDF: { format: "a4" },
                })
                .save();
        }, 300);
    }, [lastSavedPembelian]);

    const handleChangeSupplier = (selected) => {
        if (items.length > 0) {
            const ok = confirm(
                "Ganti supplier akan menghapus detail barang. Lanjutkan?"
            );
            if (!ok) return;
        }

        setSupplier(selected);
        setItems([]);
        setPaidAmount(0);
    };

    if (!ownerId) return null;

    return (
        <div className="dashboard-container">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                        >
                            <img src={toggleIcon} alt="toggle" />
                        </button>

                        <button
                            className="btn-back"
                            onClick={() => navigate(-1)}
                        >
                            <img src={backIcon} alt="back" />
                        </button>

                        <h1>Pembelian Barang</h1>
                    </div>
                </header>

                <div className="pembelian-layout">
                    <div className="pembelian-left">
                        <PembelianForm
                            supplier={supplier}
                            setSupplier={handleChangeSupplier}
                            suppliers={suppliers}
                            isSupplierLocked={isSupplierLocked}
                            tanggal={tanggal}
                            setTanggal={setTanggal}
                            paymentStatus={paymentStatus}
                            setPaymentStatus={setPaymentStatus}
                        />

                        <PembelianItems
                            items={items}
                            setItems={setItems}
                        />
                    </div>

                    <div className="pembelian-right">
                        <PembelianSummary
                            items={items}
                            paidAmount={paidAmount}
                        />

                        <PembelianActions
                            items={items}
                            supplier={supplier}
                            paidAmount={paidAmount}
                            total={total}
                            setPaidAmount={setPaidAmount}
                            paymentStatus={paymentStatus}
                            tanggal={tanggal}
                            onSaved={(data) =>
                                setLastSavedPembelian({
                                    ...data,
                                    paymentStatus,
                                })
                            }
                        />
                    </div>
                </div>

                <div style={{ display: "none" }}>
                    <PembelianDraftPDF />
                    <PembelianInvoicePDF
                        data={lastSavedPembelian}
                    />
                </div>
            </div>
        </div>
    );
};

export default Pembelian;