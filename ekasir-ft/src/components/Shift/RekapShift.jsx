import { useState, useEffect } from "react";
import TambahCatatanModal from "../Shift/TambahCatatanModal";
import "../../assets/css/shift-modal.css";

const RekapShift = ({ shift, onUpdate }) => {
    const [showCatatan, setShowCatatan] = useState(false);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        setNotes(shift.notes || []);
    }, [shift]);

    const handleAddNote = (data) => {
        const updatedNotes = [...(shift.notes || []), data];

        const updatedShift = {
            ...shift,
            notes: updatedNotes,
        };

        const history =
            JSON.parse(localStorage.getItem("shift_history")) || [];

        const newHistory = history.map((s) =>
            s.startedAt === shift.startedAt ? updatedShift : s
        );

        localStorage.setItem("shift_history", JSON.stringify(newHistory));

        onUpdate(updatedShift);
    };

    const allTransactions =
        JSON.parse(localStorage.getItem("transaction_history")) || [];

    const shiftTransactions = allTransactions.filter(
        (t) =>
            t.shiftStartedAt === shift.startedAt &&
            t.metode === "TUNAI" &&
            t.status === "paid"
    );

    const totalPenjualanTunai = shiftTransactions.reduce(
        (sum, t) => sum + Number(t.total || 0),
        0
    );

    const saldoSistem =
        Number(shift.saldoAwal || 0) +
        totalPenjualanTunai +
        notes
            .filter((n) => n.type === "IN")
            .reduce((s, n) => s + Number(n.amount || 0), 0) -
        notes
            .filter((n) => n.type === "OUT")
            .reduce((s, n) => s + Number(n.amount || 0), 0);

    return (
        <div className="rekap-page">
            <div className="rekap-left">
                <div className="rekap-card">
                    <h4>Saat ini</h4>

                    <div className="rekap-row">
                        <span>Nama</span>
                        <b>{shift.cashier}</b>
                    </div>

                    <div className="rekap-row">
                        <span>Sebagai</span>
                        <b>Kasir</b>
                    </div>

                    <div className="rekap-row">
                        <span>Mulai shift</span>
                        {shift.startedAt}
                    </div>

                    <div className="rekap-row">
                        <span>Shift berakhir</span>
                        {shift.endedAt}
                    </div>

                    <hr />

                    <div className="rekap-row">
                        Penjualan tunai{" "}
                        <b>Rp {totalPenjualanTunai.toLocaleString()}</b>
                    </div>

                    <div className="rekap-row">
                        Pengeluaran <b className="red">Rp 0</b>
                    </div>

                    <hr />

                    <div className="rekap-row highlight">
                        Subtotal{" "}
                        <b>Rp {totalPenjualanTunai.toLocaleString()}</b>
                    </div>

                    <div className="rekap-row">
                        Saldo awal{" "}
                        <b>Rp {Number(shift.saldoAwal).toLocaleString()}</b>
                    </div>

                    <div className="rekap-row highlight">
                        Diterima sistem{" "}
                        <b>Rp {saldoSistem.toLocaleString()}</b>
                    </div>
                </div>
            </div>

            <div className="rekap-right">
                <div className="rekap-card rekap-detail-card">
                    <h4>Detail rekap shift</h4>

                    <div className="rekap-detail-scroll">
                        {notes.length === 0 && (
                            <div className="empty-note">Belum ada catatan</div>
                        )}

                        {notes.map((n, i) => (
                            <div key={i} className={`rekap-detail-item ${n.type === "IN" ? "in" : "out"}`}>
                                <div className="rekap-detail-left">
                                    <b>
                                        {n.type === "IN" ? "Kas masuk lain" : "Kas keluar lain"}
                                    </b>
                                    <small>{n.note}</small>
                                    <small>
                                        {new Date(n.createdAt).toLocaleString("id-ID")}
                                    </small>
                                </div>

                                <div className={`rekap-detail-right ${n.type === "IN" ? "in" : "out"}`}>
                                    Rp {Number(n.amount).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn-primary rekap-add-btn"
                        onClick={() => setShowCatatan(true)}
                    >
                        Tambah catatan singkat
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
