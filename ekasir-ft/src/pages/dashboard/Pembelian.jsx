import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [supplier, setSupplier] = useState(null);
    const [paidAmount, setPaidAmount] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("lunas");
    const [lastSavedPembelian, setLastSavedPembelian] = useState(null);

    const navigate = useNavigate();
    const isSupplierLocked = items.length > 0;

    const total = items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );

    useEffect(() => {
        const saved = localStorage.getItem("suppliers");
        if (saved) setSuppliers(JSON.parse(saved));
    }, []);

    useEffect(() => {
        const draft = localStorage.getItem("pembelian_draft");
        if (draft) {
            const parsed = JSON.parse(draft);
            setItems(parsed.items || []);
            setSupplier(parsed.supplier || null);
            setPaidAmount(parsed.paidAmount || 0);
        }
    }, []);

    useEffect(() => {
        if (!lastSavedPembelian) return;

        const el = document.getElementById("invoice-pdf");
        if (!el) return;

        html2pdf().from(el).set({
            filename: `${lastSavedPembelian.invoiceNumber}.pdf`,
            margin: 10,
            html2canvas: { scale: 2 },
            jsPDF: { format: "a4" }
        }).save();
    }, [lastSavedPembelian]);

    const handleChangeSupplier = (selected) => {
        if (items.length > 0) {
            const ok = confirm("Ganti supplier akan menghapus detail barang. Lanjutkan?");
            if (!ok) return;
        }

        setSupplier(selected);
        setItems([]);
        setPaidAmount(0);
        setPaymentStatus("lunas");
    };

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
                            onClick={() => setSidebarOpen(!sidebarOpen)}
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
                            paymentStatus={paymentStatus}
                            setPaymentStatus={setPaymentStatus}
                            isSupplierLocked={isSupplierLocked}
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
                            onSaved={setLastSavedPembelian}
                        />
                    </div>
                </div>
                <div style={{ display: "none" }}>
                    <PembelianDraftPDF />
                    <PembelianInvoicePDF data={lastSavedPembelian} />
                </div>
            </div>
        </div>
    );
};

export default Pembelian;
