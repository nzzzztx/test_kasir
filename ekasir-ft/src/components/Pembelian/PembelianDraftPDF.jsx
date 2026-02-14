import { useEffect, useState } from "react";
import { getCurrentOwnerId } from "../../utils/owner";
import { getInfoToko } from "../../utils/toko";

const PembelianDraftPDF = () => {
    const [draft, setDraft] = useState(null);
    const { namaToko, lokasi, telepon } = getInfoToko();

    useEffect(() => {
        const ownerId = getCurrentOwnerId();
        if (!ownerId) return;

        const saved = localStorage.getItem(`pembelian_draft_owner_${ownerId}`);
        if (saved) {
            setDraft(JSON.parse(saved));
        }
    }, []);

    if (!draft) {
        return (
            <div style={{ padding: 24 }}>
                Tidak ada draft pembelian.
            </div>
        );
    }

    const { supplier, items = [], total = 0, paidAmount = 0 } = draft;
    const sisa = Math.max(total - paidAmount, 0);

    return (
        <div id="pembelian-pdf" style={{ padding: 24, fontFamily: "Arial" }}>
            <h2 style={{ textAlign: "center" }}>{namaToko}</h2>
            <p style={{ textAlign: "center", fontSize: 12 }}>{lokasi}</p>
            <p style={{ textAlign: "center", fontSize: 12 }}>Telp: {telepon}</p>
            <h3 style={{ textAlign: "center" }}>Draft Pembelian</h3>

            <p><strong>Supplier:</strong> {supplier?.name}</p>
            <p>
                <strong>Tanggal:</strong>{" "}
                {draft.date
                    ? new Date(draft.date).toLocaleDateString("id-ID")
                    : new Date().toLocaleDateString("id-ID")}
            </p>

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
                            <td>Rp {(item.price || 0).toLocaleString("id-ID")}
                            </td>
                            <td>
                                Rp {((item.qty || 0) * (item.price || 0)).toLocaleString("id-ID")}
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
                Rp {sisa.toLocaleString("id-ID")}
            </p>

            <p style={{ fontSize: 12, marginTop: 24, textAlign: "center" }}>
                Dokumen ini adalah draft pembelian
            </p>
        </div>
    );
};

export default PembelianDraftPDF;
