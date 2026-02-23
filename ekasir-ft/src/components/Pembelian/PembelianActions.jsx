import html2pdf from "html2pdf.js";
import { useAuth } from "../../context/AuthContext";

const PembelianActions = ({
    items,
    supplier,
    paidAmount,
    total,
    setPaidAmount,
    paymentStatus,
    tanggal,
    onSaved
}) => {
    const sisa = Math.max(total - paidAmount, 0);
    const { authData } = useAuth();

    const handleExportDraftPDF = () => {
        const element = document.getElementById("draft-pdf");
        if (!element) {
            alert("Draft belum siap");
            return;
        }

        html2pdf().from(element).set({
            margin: 10,
            filename: `Draft_Pembelian_${Date.now()}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { format: "a4", orientation: "portrait" }
        }).save();
    };

    const handleSavePembelian = async () => {
        if (!authData?.token) {
            alert("Session expired");
            return;
        }

        if (!supplier) return alert("Pilih supplier");
        if (items.length === 0) return alert("Tambahkan barang");

        if (paymentStatus === "lunas" && paidAmount < total) {
            return alert("Pembayaran belum lunas!");
        }

        const sisa = Math.max(total - paidAmount, 0);

        try {
            const res = await fetch("http://localhost:5000/api/purchases", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    supplier_id: supplier.id,
                    purchase_date: tanggal,
                    paid_amount: paidAmount,
                    payment_status: paymentStatus,
                    items: items.map(i => ({
                        product_id: i.product_id,
                        qty: Number(i.qty),
                        price: Number(i.price)
                    }))
                })
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message);
                return;
            }

            onSaved({
                id: result.id || Date.now(),
                invoiceNumber: result.invoiceNumber,
                supplier,
                items,
                total,
                paidAmount,
                sisa,
                status: paymentStatus,
                tanggal: tanggal,
                createdAt: new Date().toISOString()
            });

            alert("Pembelian berhasil disimpan ✅");

        } catch (err) {
            console.error(err);
            alert("Gagal simpan pembelian");
        }
    };

    return (
        <div className="pembelian-actions">
            <input
                // type="number"
                placeholder="Nominal Dibayar"
                value={paidAmount}
                onChange={(e) =>
                    setPaidAmount(e.target.value ? Number(e.target.value) : 0)
                }
            />

            <button
                className="btn-outline"
                onClick={handleExportDraftPDF}
            >
                Simpan Draft
            </button>

            <button
                className="btn-primary"
                onClick={handleSavePembelian}
            >
                Simpan Pembelian
            </button>
        </div>
    );
};

export default PembelianActions;
