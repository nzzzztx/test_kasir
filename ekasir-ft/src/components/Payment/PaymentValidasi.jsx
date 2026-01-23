import { useState } from "react";
import html2pdf from "html2pdf.js";
import "../../assets/css/validasi.css";
import validasiIcon from "../../assets/icons/validasi.png";

const PaymentValidasi = ({ kembalian = 0, onClose, onViewReceipt }) => {
    const [openPrint, setOpenPrint] = useState(false);

    const handleExportPDF = () => {
        const element = document.getElementById("receipt-print");
        if (!element) return alert("Struk belum siap");

        html2pdf()
            .set({
                margin: 5,
                filename: "struk-transaksi.pdf",
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a6", orientation: "portrait" }
            })
            .from(element)
            .save();
    };

    return (
        <div className="payment-validasi-overlay">
            <div className="payment-validasi-card">
                <h3 className="validasi-title">Transaksi Selesai</h3>

                <div className="validasi-icon">
                    <img src={validasiIcon} alt="success" />
                </div>

                <div className="validasi-info">
                    <span>Kembalian</span>
                    <strong>Rp {kembalian.toLocaleString("id-ID")}</strong>
                </div>

                <div className="validasi-actions">
                    <div className="validasi-dropdown">
                        <button
                            className="validasi-item view"
                            onClick={() => setOpenPrint(p => !p)}
                        >
                            Cetak Struk
                            <span className={`arrow ${openPrint ? "open" : ""}`}>›</span>
                        </button>

                        {openPrint && (
                            <div className="dropdown-menu">
                                <button className="dropdown-item"> 🖶 Printer Kasir</button>
                                <button className="dropdown-item" onClick={handleExportPDF}>
                                    📃 Simpan PDF
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="validasi-item view" onClick={onViewReceipt}>
                        Lihat Struk <span>›</span>
                    </button>
                </div>

                <button
                    className="validasi-finish"
                    onClick={() => {
                        localStorage.removeItem("current_transaction");
                        onClose();
                    }}
                >
                    Selesai
                </button>
            </div>
        </div>
    );
};

export default PaymentValidasi;
