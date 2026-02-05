import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import "../../assets/css/laporantransaksi.css";
import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "./KalenderTransaksi";

import searchIcon from "../../assets/icons/search.png";
import calendarIcon from "../../assets/icons/calendar.png";
import backIcon from "../../assets/icons/back.png"
import toggleIcon from "../../assets/icons/togglebutton.png";
import downIcon from "../../assets/icons/down.png";

const getInfoToko = () => {
    const saved = localStorage.getItem("informasi_toko");
    if (!saved) {
        return { namaToko: "Nama Toko", lokasi: "-" };
    }

    try {
        const parsed = JSON.parse(saved);
        return {
            namaToko: parsed.namaToko || "Nama Toko",
            lokasi: parsed.lokasi || "-",
        };
    } catch {
        return { namaToko: "Nama Toko", lokasi: "-" };
    }
};

const LaporanTransaksi = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [openCalendar, setOpenCalendar] = useState(false);
    const [range, setRange] = useState(null);
    const [openWaktu, setOpenWaktu] = useState(false);
    const [waktuType, setWaktuType] = useState("order");
    const [openStatus, setOpenStatus] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [openExport, setOpenExport] = useState(false);
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState([]);
    const { namaToko, lokasi } = getInfoToko();

    // const dummyTransaksi = [
    //     {
    //         nomor: "CS/01/241001/0001",
    //         waktu_order: new Date("2024-10-01T09:21:00"),
    //         waktu_bayar: new Date("2024-10-01T09:30:00"),
    //         outlet: namaToko,
    //         jenis_order: "Lainnya",
    //         penjualan: 125000,
    //         metode: "Tunai",
    //         status: "paid",
    //     },
    //     {
    //         nomor: "CS/01/241001/0002",
    //         waktu_order: new Date("2024-10-02T10:10:00"),
    //         waktu_bayar: null,
    //         outlet: namaToko,
    //         jenis_order: "Lainnya",
    //         penjualan: 98000,
    //         metode: "QRIS",
    //         status: "unpaid",
    //     },
    // ];

    useEffect(() => {
        const history = JSON.parse(
            localStorage.getItem("transaction_history") || "[]"
        );

        if (!history.length) {
            setTransactions([]);
            return;
        }

        const parsed = history.map((t, i) => ({
            nomor: `TRX/${new Date(t.createdAt).toISOString().slice(0, 10).replace(/-/g, "")}/${i + 1}`,
            waktu_order: t.createdAt ? new Date(t.createdAt) : null,
            waktu_bayar: t.paidAt ? new Date(t.paidAt) : null,
            outlet: namaToko,
            jenis_order: t.jenis_order || "Lainnya",
            penjualan: Number(t.finalTotal || 0),
            metode: t.metode || "-",
            status: t.paidAmount >= t.finalTotal ? "paid" : "unpaid",
        }));

        setTransactions(parsed);
    }, []);

    const formatDate = (date) =>
        date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    useEffect(() => {
        const saved = localStorage.getItem("laporanRange");
        if (saved) {
            const parsed = JSON.parse(saved);
            setRange({
                startDate: new Date(parsed.startDate),
                endDate: new Date(parsed.endDate),
                startTime: parsed.startTime,
                endTime: parsed.endTime,
            });
        }
    }, []);

    const handleExport = () => {
        const excelData = filteredTransaksi.map((t, i) => ({
            No: i + 1,
            "Nomor Transaksi": t.nomor,
            "Waktu Order": t.waktu_order
                ? t.waktu_order.toLocaleString("id-ID")
                : "-",
            "Waktu Bayar": t.waktu_bayar
                ? t.waktu_bayar.toLocaleString("id-ID")
                : "-",
            Outlet: namaToko,
            "Alamat Toko": lokasi,
            "Jenis Order": t.jenis_order,
            "Penjualan (Rp)": t.penjualan,
            "Metode Pembayaran": t.metode,
            Status: t.status === "paid" ? "Lunas" : "Belum Lunas",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Transaksi");

        XLSX.writeFile(
            workbook,
            `Laporan_Transaksi_${Date.now()}.xlsx`
        );
    };

    const filteredTransaksi = transactions.filter((t) => {
        if (statusFilter !== "all" && t.status !== statusFilter) {
            return false;
        }

        const keyword = search.toLowerCase();
        if (
            keyword &&
            !(
                t.nomor.toLowerCase().includes(keyword) ||
                t.outlet.toLowerCase().includes(keyword) ||
                t.metode.toLowerCase().includes(keyword)
            )
        ) {
            return false;
        }

        if (range) {
            const targetDate =
                waktuType === "order" ? t.waktu_order : t.waktu_bayar;

            if (!targetDate) return false;

            const start = new Date(range.startDate);
            const [sh, sm] = (range.startTime || "00:00").split(":");
            start.setHours(sh, sm, 0);

            const end = new Date(range.endDate);
            const [eh, em] = (range.endTime || "23:59").split(":");
            end.setHours(eh, em, 59);

            if (targetDate < start || targetDate > end) {
                return false;
            }
        }

        return true;
    });

    const totalTransaksi = filteredTransaksi.length;

    const totalPenjualan = filteredTransaksi.reduce(
        (sum, t) => sum + t.penjualan,
        0
    );

    const totalPembayaran = filteredTransaksi
        .filter((t) => t.status === "paid")
        .reduce((sum, t) => sum + t.penjualan, 0);

    const totalPiutang = filteredTransaksi
        .filter((t) => t.status === "unpaid")
        .reduce((sum, t) => sum + t.penjualan, 0);

    const penjualanBersih = totalPenjualan - totalPiutang;

    return (
        <div className="dashboard-container">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button
                            className="toggle-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <img src={toggleIcon} alt="toggle" />
                        </button>

                        <button
                            className="btn-back"
                            onClick={() => navigate("/dashboard/laporan")}
                        >
                            <img src={backIcon} alt="back" />
                        </button>

                        <h1>Laporan Transaksi</h1>
                    </div>
                </header>

                <div className="laporan-transaksi-page">
                    <div className="laporan-summary">
                        <div className="summary-card">
                            <span className="summary-label">Total Penjualan</span>
                            <strong className="summary-value">
                                Rp {totalPenjualan.toLocaleString("id-ID")}
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Total Transaksi</span>
                            <strong className="summary-value">{totalTransaksi}</strong>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Penjualan Bersih</span>
                            <strong className="summary-value">
                                Rp {penjualanBersih.toLocaleString("id-ID")}
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Total Pembayaran</span>
                            <strong className="summary-value">
                                Rp {totalPembayaran.toLocaleString("id-ID")}
                            </strong>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Total Piutang</span>
                            <strong className="summary-value">
                                Rp {totalPiutang.toLocaleString("id-ID")}
                            </strong>
                        </div>
                    </div>

                    <div className="laporan-toolbar">
                        <div className="laporan-left">
                            <div className="laporan-search">
                                <img src={searchIcon} alt="search" />
                                <input
                                    placeholder="Cari Struk"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="laporan-date" onClick={() => setOpenCalendar(true)}>
                                <img src={calendarIcon} alt="date" />
                                <span>
                                    {range
                                        ? `${formatDate(range.startDate)} ${range.startTime} - 
                                             ${formatDate(range.endDate)} ${range.endTime}`
                                        : "Pilih Tanggal"}
                                </span>
                            </div>

                            <div className="waktu-dropdown-wrapper">
                                <button
                                    className="btn-outline waktu-btn"
                                    onClick={() => setOpenWaktu((v) => !v)}
                                >
                                    <span>
                                        {waktuType === "order" ? "Waktu Order" : "Waktu Bayar"}
                                    </span>

                                    <img
                                        src={downIcon}
                                        alt="arrow"
                                        className={`waktu-arrow ${openWaktu ? "open" : ""}`}
                                    />
                                </button>

                                {openWaktu && (
                                    <div className="waktu-dropdown">
                                        <button
                                            className={waktuType === "order" ? "active" : ""}
                                            onClick={() => {
                                                setWaktuType("order");
                                                setOpenWaktu(false);
                                            }}
                                        >
                                            Waktu Order
                                        </button>

                                        <button
                                            className={waktuType === "bayar" ? "active" : ""}
                                            onClick={() => {
                                                setWaktuType("bayar");
                                                setOpenWaktu(false);
                                            }}
                                        >
                                            Waktu Bayar
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="laporan-right">
                            <div className="status-dropdown-wrapper">
                                <button
                                    className="btn-outline status-btn"
                                    onClick={() => setOpenStatus((v) => !v)}
                                >
                                    <span>Status Pembayaran</span>
                                    <img
                                        src={downIcon}
                                        alt="arrow"
                                        className={`status-arrow ${openStatus ? "open" : ""}`}
                                    />
                                </button>

                                {openStatus && (
                                    <div className="status-dropdown">
                                        <label className="status-item">
                                            <input
                                                type="checkbox"
                                                checked={statusFilter === "all"}
                                                onChange={() => setStatusFilter("all")}
                                            />
                                            Semua status pembayaran
                                        </label>

                                        <label className="status-item">
                                            <input
                                                type="checkbox"
                                                checked={statusFilter === "unpaid"}
                                                onChange={() => setStatusFilter("unpaid")}
                                            />
                                            Belum lunas
                                        </label>

                                        <label className="status-item">
                                            <input
                                                type="checkbox"
                                                checked={statusFilter === "paid"}
                                                onChange={() => setStatusFilter("paid")}
                                            />
                                            Lunas
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn-primary"
                                onClick={() => setOpenExport(true)}
                            >
                                Ekspor Laporan
                            </button>
                        </div>
                    </div>

                    <div className="laporan-table-wrapper">
                        <table className="laporan-table">
                            <thead>
                                <tr>
                                    <th>Nomor Transaksi</th>
                                    <th>Waktu Order</th>
                                    <th>Waktu Bayar</th>
                                    <th>Outlet</th>
                                    <th>Jenis Order</th>
                                    <th>Penjualan (Rp.)</th>
                                    <th>Metode Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransaksi.map((t, i) => (
                                    <tr key={i}>
                                        <td>{t.nomor}</td>
                                        <td>
                                            {t.waktu_order
                                                ? t.waktu_order.toLocaleString("id-ID")
                                                : "-"}
                                        </td>
                                        <td>
                                            {t.waktu_bayar
                                                ? t.waktu_bayar.toLocaleString("id-ID")
                                                : "-"}
                                        </td>
                                        <td>{t.outlet}</td>
                                        <td>{t.jenis_order}</td>
                                        <td>Rp {t.penjualan.toLocaleString("id-ID")}</td>
                                        <td>{t.metode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="laporan-footer">
                        <span>Menampilkan 1 - 5 dari 17 data</span>
                    </div>
                </div>
                {openCalendar && (
                    <KalenderTransaksi
                        onApply={(data) => {
                            setRange(data);
                            localStorage.setItem("laporanRange", JSON.stringify(data));
                            setOpenCalendar(false);
                        }}
                        onClose={() => setOpenCalendar(false)}
                    />
                )}

                {openExport && (
                    <div className="calendar-overlay">
                        <div className="export-modal">
                            <div className="export-header">
                                <h3>Ekspor Laporan Transaksi</h3>
                                <button onClick={() => setOpenExport(false)}>✕</button>
                            </div>

                            <p className="export-desc">
                                Rekap transaksi untuk periode{" "}
                                <strong>
                                    {range
                                        ? `${formatDate(range.startDate)} – ${formatDate(range.endDate)}`
                                        : "Semua tanggal"}
                                </strong>{" "}
                                akan diekspor dalam format <strong>PDF</strong> dan disimpan di perangkat
                                yang sedang digunakan. Lanjutkan?
                            </p>

                            <div className="export-actions">
                                <button className="btn-outline" onClick={() => setOpenExport(false)}>
                                    Batal
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        handleExport();
                                        setOpenExport(false);
                                    }}
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LaporanTransaksi;
