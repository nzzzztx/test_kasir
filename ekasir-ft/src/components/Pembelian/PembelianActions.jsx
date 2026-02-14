import html2pdf from "html2pdf.js";
import { getCurrentOwnerId } from "../../utils/owner";

const PembelianActions = ({
    items,
    supplier,
    paidAmount,
    total,
    setPaidAmount,
    paymentStatus,
    onSaved
}) => {
    const sisa = Math.max(total - paidAmount, 0);
    const ownerId = getCurrentOwnerId();

    const handleExportDraftPDF = () => {
        const draft = {
            supplier,
            items,
            paidAmount,
            total,
            status: "DRAFT",
            date: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(
            `pembelian_draft_owner_${ownerId}`,
            JSON.stringify(draft)
        );

        const element = document.getElementById("pembelian-pdf");
        if (!element) {
            alert("Data belum siap");
            return;
        }

        html2pdf().from(element).set({
            margin: 10,
            filename: `Draft_Pembelian_${Date.now()}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { format: "a4", orientation: "portrait" }
        }).save();

        alert("Draft pembelian disimpan");
    };

    const handleSavePembelian = () => {
        if (!supplier) return alert("Pilih supplier");
        if (items.length === 0) return alert("Tambahkan barang");

        if (paymentStatus === "lunas" && paidAmount < total) {
            return alert("Pembayaran belum lunas");
        }

        const pembelian = {
            id: Date.now(),
            invoiceNumber: `INV-PB-${Date.now()}`,
            supplier,
            items,
            total,
            tanggal,
            paidAmount,
            status: paymentStatus === "lunas" ? "SELESAI" : "BELUM_LUNAS",
            createdAt: new Date().toISOString(),
            payments: [
                {
                    id: Date.now(),
                    type: paymentStatus === "lunas" ? "PELUNASAN" : "DP",
                    amount: paidAmount,
                    date: new Date().toISOString()
                }
            ]
        };

        const existing =
            JSON.parse(localStorage.getItem(`pembelian_list_owner_${ownerId}`)) || [];

        const products =
            JSON.parse(localStorage.getItem(`products_${ownerId}`)) || [];

        const updatedProducts = products.map((prod) => {
            const totalQty = items
                .filter(i => i.productId === prod.id)
                .reduce((sum, item) => sum + Number(item.qty), 0);

            if (totalQty === 0) return prod;

            return {
                ...prod,
                stock: Number(prod.stock) + totalQty
            };
        });

        localStorage.setItem(
            `products_${ownerId}`,
            JSON.stringify(updatedProducts)
        );

        localStorage.setItem(
            `pembelian_list_owner_${ownerId}`,
            JSON.stringify([...existing, pembelian])
        );

        localStorage.removeItem(`pembelian_draft_owner_${ownerId}`);

        onSaved(pembelian);

        alert("Pembelian berhasil disimpan ✅");
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
