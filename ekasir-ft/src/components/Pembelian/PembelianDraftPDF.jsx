import { useEffect, useState } from "react";

const PembelianDraftPDF = () => {
    const [draft, setDraft] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("pembelian_draft");
        if (saved) {
            setDraft(JSON.parse(saved));
        }
    }, []);

    if (!draft) return null;

    const { supplier, items, total, paidAmount } = draft;

    return (
        <div id="pembelian-pdf" style={{ padding: 24, fontFamily: "Arial" }}>
            <h2 style={{ textAlign: "center" }}>Draft Pembelian</h2>

            <p><strong>Supplier:</strong> {supplier?.name}</p>
            <p><strong>Tanggal:</strong> {new Date().toLocaleDateString("id-ID")}</p>

            <table
                width="100%"
                border="1"
                cellPadding="6"
                style={{ borderCollapse: "collapse", marginTop: 12 }}
            >
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Qty</th>
                        <th>Satuan</th>
                        <th>Harga</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.unit}</td>
                            <td>Rp {item.price.toLocaleString("id-ID")}</td>
                            <td>
                                Rp {(item.qty * item.price).toLocaleString("id-ID")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p style={{ marginTop: 12 }}>
                <strong>Total:</strong> Rp {total.toLocaleString("id-ID")}
            </p>

            <p>
                <strong>Dibayar:</strong> Rp {paidAmount.toLocaleString("id-ID")}
            </p>

            <p>
                <strong>Sisa:</strong>{" "}
                Rp {(total - paidAmount).toLocaleString("id-ID")}
            </p>

            <p style={{ fontSize: 12, marginTop: 24, textAlign: "center" }}>
                Dokumen ini adalah draft pembelian
            </p>
        </div>
    );
};

export default PembelianDraftPDF;
