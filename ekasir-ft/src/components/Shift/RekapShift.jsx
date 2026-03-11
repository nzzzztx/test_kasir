import { useState, useEffect } from "react";
import TambahCatatanModal from "../Shift/TambahCatatanModal";
import "../../assets/css/shift-modal.css";
import { useAuth } from "../../context/AuthContext";

const RekapShift = ({ shift, transactions = [], onUpdate }) => {
    const { authData } = useAuth();
    const [showCatatan, setShowCatatan] = useState(false);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (!shift?.notes) {
            setNotes([]);
            return;
        }

        try {
            const parsed =
                typeof shift.notes === "string"
                    ? JSON.parse(shift.notes)
                    : shift.notes;

            setNotes(parsed || []);
        } catch (err) {
            console.error("Gagal parse notes:", err);
            setNotes([]);
        }
    }, [shift?.id]);

    const handleAddNote = async (data) => {
        const res = await fetch(
            `http://192.168.2.20:5000/api/shifts/${shift.id}/note`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData?.token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await res.json();

        if (!res.ok) {
            alert(result.message);
            return;
        }

        const parsedNotes =
            typeof result.notes === "string"
                ? JSON.parse(result.notes)
                : result.notes || [];

        setNotes(parsedNotes);

        if (onUpdate) {
            onUpdate({
                ...shift,
                notes: parsedNotes
            });
        }

        setShowCatatan(false);
    };

    const durasi =
        shift?.ended_at && shift?.started_at
            ? Math.floor(
                (new Date(shift.ended_at) - new Date(shift.started_at)) /
                60000
            )
            : 0;

    // 🔥 hitung dari transaksi API
    const totalPenjualanTunai = transactions
        .filter((t) => t.payment_method === "TUNAI")
        .reduce((sum, t) => sum + Number(t.grand_total || 0), 0);

    const totalNonTunai = transactions
        .filter((t) => t.payment_method !== "TUNAI")
        .reduce((sum, t) => sum + Number(t.grand_total || 0), 0);

    const totalSemua =
        totalPenjualanTunai +
        totalNonTunai;

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
                        <b>
                            {shift.started_at
                                ? new Date(shift.started_at).toLocaleString("id-ID", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })
                                : "-"
                            }
                        </b>
                    </div>

                    <div className="rekap-row">
                        <span>Selesai</span>
                        <b>
                            {shift.ended_at
                                ? new Date(shift.ended_at).toLocaleString("id-ID", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })
                                : "-"
                            }
                        </b>
                    </div>

                    <div className="rekap-row">
                        <span>Durasi</span>
                        <b>{durasi} menit</b>
                    </div>

                    <hr />

                    <div className="rekap-row">
                        Penjualan tunai
                        <b>Rp {totalPenjualanTunai.toLocaleString()}</b>
                    </div>

                    <div className="rekap-row">
                        Penjualan non tunai
                        <b>Rp {totalNonTunai.toLocaleString()}</b>
                    </div>

                    <hr />

                    <div className="rekap-row">
                        Total penjualan
                        <b>Rp {totalSemua.toLocaleString()}</b>
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
                                className={`rekap-detail-item ${n.type === "IN" ? "in" : "out"}`}
                            >
                                <div className="note-left">
                                    <div className="note-title">
                                        {n.type === "IN"
                                            ? "Kas masuk lain"
                                            : "Kas keluar lain"}
                                    </div>
                                    {n.note && <div className="note-desc">{n.note}</div>}
                                </div>

                                <div className="note-amount">
                                    Rp {Number(n.amount).toLocaleString("id-ID")}
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