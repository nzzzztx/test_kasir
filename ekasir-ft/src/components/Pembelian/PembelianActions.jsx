const PembelianActions = ({
    items,
    supplier,
    paidAmount,
    total,
    setPaidAmount
}) => {
    const handleSaveDraft = () => {
        const draft = {
            supplier,
            items,
            paidAmount,
            total,
            status: "DRAFT",
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem("pembelian_draft", JSON.stringify(draft));
        alert("Draft pembelian disimpan");
    };

    const handleSavePembelian = () => {
        if (!supplier) {
            alert("Pilih supplier terlebih dahulu");
            return;
        }

        if (items.length === 0) {
            alert("Tambahkan barang terlebih dahulu");
            return;
        }

        if (paidAmount < total) {
            alert("Pembayaran belum lunas");
            return;
        }

        const pembelian = {
            id: Date.now(),
            supplier,
            items,
            total,
            paidAmount,
            status: "SELESAI",
            createdAt: new Date().toISOString()
        };

        const existing =
            JSON.parse(localStorage.getItem("pembelian_list")) || [];

        localStorage.setItem(
            "pembelian_list",
            JSON.stringify([...existing, pembelian])
        );

        localStorage.removeItem("pembelian_draft");

        alert("Pembelian berhasil disimpan ✅");
    };

    return (
        <div className="pembelian-actions">
            <input
                type="number"
                placeholder="Nominal Dibayar"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
            />

            <button
                className="btn-outline"
                onClick={handleSaveDraft}
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
