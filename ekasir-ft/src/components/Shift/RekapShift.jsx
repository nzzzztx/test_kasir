import { useState, useEffect } from "react";
import TambahCatatanModal from "../Shift/TambahCatatanModal";
import "../../assets/css/shift-modal.css";

const RekapShift = ({ shift, transactions = [], onUpdate }) => {
    const [showCatatan, setShowCatatan] = useState(false);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        setNotes(shift?.notes || []);
    }, [shift]);

    const handleAddNote = async (data) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/shifts/${shift.id}/note`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await res.json();
            if (!res.ok) {
                alert(result.message);
                return;
            }

            setNotes(result.notes || []);
            setShowCatatan(false);

            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan catatan");
        }
    };

    // 🔥 hitung dari transaksi API
    const totalPenjualanTunai = transactions
        .filter(
            (t) =>
                t.payment_method === "TUNAI" &&
                t.status === "paid"
        )
        .reduce((sum, t) => sum + Number(t.grand_total || 0), 0);

    const kasMasuk = notes
        .filter((n) => n.type === "IN")
        .reduce((s, n) => s + Number(n.amount || 0), 0);

    const kasKeluar = notes
        .filter((n) => n.type === "OUT")
        .reduce((s, n) => s + Number(n.amount || 0), 0);

    const saldoSistem =
        Number(shift?.saldo_awal || 0) +
        totalPenjualanTunai +
        kasMasuk -
        kasKeluar;

    return (
        <div className="rekap-page">
            <div className="rekap-left">
                <div className="rekap-card">
                    <h4>Rekap Shift</h4>

                    <div className="rekap-row">
                        <span>Kasir</span>
                        <b>{shift.cashier}</b>
                    </div>

                    <div className="rekap-row">
                        <span>Mulai</span>
                        <b>{shift.started_at}</b>
                    </div>

                    <div className="rekap-row">
                        <span>Selesai</span>
                        <b>{shift.ended_at || "-"}</b>
                    </div>

                    <hr />

                    <div className="rekap-row">
                        Penjualan tunai
                        <b>Rp {totalPenjualanTunai.toLocaleString()}</b>
                    </div>

                    <div className="rekap-row">
                        Kas masuk lain
                        <b className="green">
                            Rp {kasMasuk.toLocaleString()}
                        </b>
                    </div>

                    <div className="rekap-row">
                        Kas keluar lain
                        <b className="red">
                            Rp {kasKeluar.toLocaleString()}
                        </b>
                    </div>

                    <hr />

                    <div className="rekap-row">
                        Saldo awal
                        <b>
                            Rp {Number(shift?.saldo_awal || 0).toLocaleString()}
                        </b>
                    </div>

                    <div className="rekap-row highlight">
                        Saldo sistem
                        <b>Rp {saldoSistem.toLocaleString()}</b>
                    </div>
                </div>
            </div>

            <div className="rekap-right">
                <div className="rekap-card rekap-detail-card">
                    <h4>Catatan Shift</h4>

                    <div className="rekap-detail-scroll">
                        {notes.length === 0 && (
                            <div className="empty-note">
                                Belum ada catatan
                            </div>
                        )}

                        {notes.map((n, i) => (
                            <div
                                key={i}
                                className={`rekap-detail-item ${n.type === "IN" ? "in" : "out"
                                    }`}
                            >
                                <div>
                                    <b>
                                        {n.type === "IN"
                                            ? "Kas masuk"
                                            : "Kas keluar"}
                                    </b>
                                    <small>{n.note}</small>
                                </div>

                                <div>
                                    Rp {Number(n.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn-primary rekap-add-btn"
                        onClick={() => setShowCatatan(true)}
                    >
                        Tambah Catatan
                    </button>
                </div>
            </div>

            <TambahCatatanModal
                open={showCatatan}
                onClose={() => setShowCatatan(false)}
                onSubmit={handleAddNote}
            />
        </div>
    );
};

export default RekapShift;