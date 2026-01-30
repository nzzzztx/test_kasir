import logoIcon from "../../assets/img/logo.png";

const PembelianInvoicePDF = ({ data }) => {
    if (!data) return null;

    const kembalian = Math.max(
        (data.paidAmount || 0) - (data.total || 0),
        0
    );

    const sisa = Math.max(
        (data.total || 0) - (data.paidAmount || 0),
        0
    );

    return (
        <div
            id="invoice-pdf"
            style={{
                padding: 32,
                fontFamily: "Arial",
                fontSize: 12,
                color: "#111",
                position: "relative"
            }}
        >
            {data.status === "SELESAI" && (
                <div
                    style={{
                        position: "absolute",
                        top: 40,
                        right: 40,
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "green",
                        border: "3px solid green",
                        padding: "6px 14px",
                        transform: "rotate(-8deg)",
                        opacity: 0.85
                    }}
                >
                    PAID
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "2px solid #000",
                    paddingBottom: 12,
                    marginBottom: 20
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={logoIcon} alt="Logo Kasir" style={{ width: 64 }} />
                    <div>
                        <h2 style={{ margin: 0 }}>KASIR-APP XML</h2>
                        <p style={{ margin: 0, fontSize: 11 }}>
                            Jl. Belakang Rawa No. 1999 Cilacap Panas<br />
                            Telp: 0812-7788-9999
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <strong>INVOICE PEMBELIAN</strong>
                    <div>No: {data.invoiceNumber}</div>
                    <div>
                        {new Date(data.createdAt).toLocaleDateString("id-ID")}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <strong>Supplier:</strong> {data.supplier?.name}
            </div>

            <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #000" }}>Barang</th>
                        <th style={{ border: "1px solid #000" }}>Qty</th>
                        <th style={{ border: "1px solid #000" }}>Satuan</th>
                        <th style={{ border: "1px solid #000" }}>Harga</th>
                        <th style={{ border: "1px solid #000" }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, i) => (
                        <tr key={i}>
                            <td style={{ border: "1px solid #000" }}>{item.name}</td>
                            <td style={{ border: "1px solid #000" }}>{item.qty}</td>
                            <td style={{ border: "1px solid #000" }}>{item.unit}</td>
                            <td style={{ border: "1px solid #000" }}>
                                Rp {item.price.toLocaleString("id-ID")}
                            </td>
                            <td style={{ border: "1px solid #000" }}>
                                Rp {(item.qty * item.price).toLocaleString("id-ID")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: 20, textAlign: "right" }}>
                <p>
                    Total: <strong>Rp {data.total.toLocaleString("id-ID")}</strong>
                </p>

                <p>
                    Dibayar: Rp {data.paidAmount.toLocaleString("id-ID")}
                </p>

                {kembalian > 0 && (
                    <p>
                        Kembalian:{" "}
                        <strong>
                            Rp {kembalian.toLocaleString("id-ID")}
                        </strong>
                    </p>
                )}

                {sisa > 0 && (
                    <p style={{ color: "#dc2626" }}>
                        Sisa: <strong>Rp {sisa.toLocaleString("id-ID")}</strong>
                    </p>
                )}

                <p>
                    Status:{" "}
                    <strong>
                        {data.status === "SELESAI" ? "LUNAS" : "BELUM LUNAS"}
                    </strong>
                </p>
            </div>
        </div>
    );
};

export default PembelianInvoicePDF;
