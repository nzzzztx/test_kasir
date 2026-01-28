const PembelianSummary = ({ items, paidAmount }) => {
    const total = items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );

    const sisa = total - paidAmount;

    return (
        <div className="pembelian-card pembelian-summary">
            <h4 className="card-title">Ringkasan</h4>

            <div className="row">
                <span>Total Pembelian</span>
                <strong>Rp {total.toLocaleString("id-ID")}</strong>
            </div>

            <div className="row">
                <span>Dibayar</span>
                <strong>Rp {paidAmount.toLocaleString("id-ID")}</strong>
            </div>

            <div className={`row ${sisa > 0 ? "unpaid" : ""}`}>
                <span>Sisa</span>
                <strong>Rp {sisa.toLocaleString("id-ID")}</strong>
            </div>
        </div>
    );
};

export default PembelianSummary;
