import logoIcon from "../../assets/img/logo.png";

const PembelianPelunasanPDF = ({ data, toko = {} }) => {
    if (!data) return null;

    const tokoData = {
        namaToko: toko?.namaToko || "Nama Toko",
        lokasi: toko?.lokasi || "-",
        telepon: toko?.telepon || "-",
    };

    const lastPayment = {
        amount: data.dibayar,
        date: new Date(),
        id: 1
    };

    return (
        <div
            style={{
                padding: 32,
                fontFamily: "Arial",
                fontSize: 12,
                color: "#111",
                position: "relative"
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    right: 40,
                    fontSize: 32,
                    fontWeight: "bold",
                    color: "#16a34a",
                    border: "4px solid #16a34a",
                    padding: "8px 18px",
                    transform: "rotate(-10deg)",
                    opacity: 0.8
                }}
            >
                PAID
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "2px solid #000",
                    paddingBottom: 12,
                    marginBottom: 20
                }}
            >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={logoIcon} alt="Logo" style={{ width: 64 }} />

                    <div>
                        <h2 style={{ margin: 0 }}>
                            {tokoData.namaToko}
                        </h2>

                        <p style={{ margin: 0, fontSize: 11 }}>
                            {tokoData.lokasi !== "-" && (
                                <>
                                    {tokoData.lokasi}
                                    <br />
                                </>
                            )}

                            {tokoData.telepon !== "-" && (
                                <>Telp: {tokoData.telepon}</>
                            )}
                        </p>
                    </div>
                </div>

                <div style={{ textAlign: "right" }}>
                    <strong>INVOICE PELUNASAN</strong>
                    <div>
                        {`INV-PEL-${data.invoiceNumber}-${lastPayment.id}`}
                    </div>
                    <div>
                        {lastPayment?.date
                            ? new Date(lastPayment.date).toLocaleDateString("id-ID")
                            : "-"}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: 16 }}>
                <p><strong>Supplier:</strong> {data.supplier?.name}</p>
                <p>
                    <strong>Referensi Invoice:</strong> {data.invoiceNumber}
                </p>
            </div>

            <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                <tbody>
                    <tr>
                        <td>Total Pembelian</td>
                        <td align="right">
                            Rp {(data.totalHarga || 0).toLocaleString("id-ID")}
                        </td>
                    </tr>
                    <tr>
                        <td>Total Dibayar</td>
                        <td align="right">
                            Rp {(data.dibayar || 0).toLocaleString("id-ID")}
                        </td>
                    </tr>
                    <tr>
                        <td>Nominal Pelunasan</td>
                        <td align="right">
                            <strong>
                                Rp {(lastPayment.amount || 0).toLocaleString("id-ID")}
                            </strong>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ marginTop: 40, fontSize: 11 }}>
                <p>
                    Invoice ini merupakan bukti pelunasan pembayaran pembelian.
                </p>
                <p>
                    Dicetak pada{" "}
                    {new Date().toLocaleString("id-ID")}
                </p>
            </div>
        </div>
    );
};

export default PembelianPelunasanPDF;