import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import "../../assets/css/laporanpelanggan.css";
import Sidebar from "../../components/Sidebar";
import CalendarTransaksi from "../Laporan/KalenderTransaksi";

import searchIcon from "../../assets/icons/search.png";
import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";
import calendarIcon from "../../assets/icons/calendar.png";

const formatRangeLabel = (start, end) => {
    if (!start || !end) return "Pilih Rentang Tanggal";

    const f = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return `${f(start)} – ${f(end)}`;
};

const LaporanPelanggan = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const PAGE_SIZE = 5;
    const [page, setPage] = useState(1);

    const [dateRange, setDateRange] = useState({
        start: null,
        end: null,
    });

    const [customers, setCustomers] = useState([]);

    const normalizeDateRange = (start, end) => {
        if (!start || !end) return null;

        const s = new Date(start);
        const e = new Date(end);

        s.setHours(0, 0, 0, 0);
        e.setHours(23, 59, 59, 999);

        return { start: s, end: e };
    };

    useEffect(() => {
        const transactions = JSON.parse(
            localStorage.getItem("transaction_history") || "[]"
        );

        const grouped = {};

        const normalizedRange = normalizeDateRange(
            dateRange.start,
            dateRange.end
        );

        transactions.forEach((trx) => {
            const customerName =
                trx.customerName ||
                trx.customer?.name ||
                "Umum";

            const customerPhone =
                trx.customerPhone ||
                trx.customer?.phone ||
                "";

            const customerAddress =
                trx.customerAddress ||
                trx.customer?.address ||
                "-";

            const customerKey = customerPhone
                ? `phone:${customerPhone}`
                : `name:${customerName}`;

            const trxDateRaw =
                trx.createdAt ||
                trx.paidAt ||
                trx.created_at ||
                trx.time;

            if (!trxDateRaw) return;

            const trxDate = new Date(trxDateRaw);

            if (normalizedRange) {
                if (trxDate < normalizedRange.start) return;
                if (trxDate > normalizedRange.end) return;
            }

            if (!grouped[customerKey]) {
                grouped[customerKey] = {
                    nama: customerName,
                    alamat: customerAddress,
                    phone: customerPhone || "-",
                    totalTransaksi: 0,
                    totalPenjualan: 0,
                    lastVisit: trxDateRaw,
                    _trxIds: new Set(),
                };
            }

            const trxId =
                trx.id ||
                trx.invoice ||
                trx.createdAt ||
                trx.paidAt;

            if (!grouped[customerKey]._trxIds.has(trxId)) {
                grouped[customerKey]._trxIds.add(trxId);

                grouped[customerKey].totalTransaksi += 1;
                grouped[customerKey].totalPenjualan += Number(
                    trx.finalTotal ?? trx.total ?? 0
                );
            }

            if (trxDate > new Date(grouped[customerKey].lastVisit)) {
                grouped[customerKey].lastVisit = trxDateRaw;
            }
        });

        const result = Object.values(grouped).map(
            ({ _trxIds, ...rest }) => rest
        );

        setCustomers(result);
    }, [dateRange]);


    const filtered = customers.filter((c) => {
        const keyword = search.toLowerCase();
        return (
            c.nama.toLowerCase().includes(keyword) ||
            c.phone.toLowerCase().includes(keyword)
        );
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const paginated = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleExport = () => {
        const excel = filtered.map((c, i) => ({
            No: i + 1,
            Nama: c.nama,
            Alamat: c.alamat,
            Telepon: c.phone,
            TotalTransaksi: c.totalTransaksi,
            TotalPenjualan: c.totalPenjualan,
            KunjunganTerakhir: c.lastVisit,
        }));

        const ws = XLSX.utils.json_to_sheet(excel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Pelanggan");
        XLSX.writeFile(wb, `Laporan_Pelanggan_${Date.now()}.xlsx`);
    };

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
                            <img src={toggleIcon} alt="" />
                        </button>

                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <img src={backIcon} alt="" />
                        </button>

                        <h1>Laporan Pelanggan</h1>
                    </div>
                </header>

                <div className="laporan-pelanggan-page">
                    <div className="laporan-toolbar">
                        <div className="laporan-left">
                            <div className="laporan-search">
                                <img src={searchIcon} alt="" />
                                <input
                                    placeholder="Cari pelanggan / telepon"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>

                            <div
                                className="laporan-date"
                                onClick={() => setShowCalendar(true)}
                            >
                                <img src={calendarIcon} alt="" />
                                <span>
                                    {formatRangeLabel(
                                        dateRange.start,
                                        dateRange.end
                                    )}
                                </span>
                            </div>
                        </div>

                        <button className="btn-primary" onClick={handleExport}>
                            Ekspor Laporan
                        </button>
                    </div>

                    <div className="laporan-table-wrapper">
                        <table className="laporan-table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Alamat</th>
                                    <th>No Telepon</th>
                                    <th>Total Transaksi</th>
                                    <th>Total Penjualan</th>
                                    <th>Kunjungan Terakhir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((c) => (
                                    <tr key={`${c.phone}-${c.lastVisit}`}>
                                        <td>{c.nama}</td>
                                        <td>{c.alamat}</td>
                                        <td>{c.phone}</td>
                                        <td>{c.totalTransaksi}</td>
                                        <td>
                                            Rp{" "}
                                            {c.totalPenjualan.toLocaleString(
                                                "id-ID"
                                            )}
                                        </td>
                                        <td>
                                            {new Date(
                                                c.lastVisit
                                            ).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="laporan-footer">
                        <span>
                            Ditampilkan {(page - 1) * PAGE_SIZE + 1} –{" "}
                            {Math.min(page * PAGE_SIZE, filtered.length)} dari{" "}
                            {filtered.length} data
                        </span>

                        <div className="pagination">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                ‹
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? "active" : ""}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={
                                    page === totalPages || totalPages === 0
                                }
                                onClick={() => setPage((p) => p + 1)}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showCalendar && (
                <CalendarTransaksi
                    onClose={() => setShowCalendar(false)}
                    onApply={(range) => {
                        const start = new Date(range.startDate);
                        const end = new Date(range.endDate);

                        setDateRange({ start, end });
                        setPage(1);
                        setShowCalendar(false);
                    }}
                />
            )}
        </div>
    );
};

export default LaporanPelanggan;
