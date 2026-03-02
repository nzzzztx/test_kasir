import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { getCurrentOwnerId } from "../../utils/owner";


import "../../assets/css/laporanpembelian.css";
import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "../Laporan/KalenderTransaksi";
import PembelianPelunasanPDF from "../Pembelian/PembelianPelunasanPDF";
import { useAuth } from "../../context/AuthContext";

import searchIcon from "../../assets/icons/search.png";
import calendarIcon from "../../assets/icons/calendar.png";
import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const LaporanPembelian = () => {
    const ownerId = getCurrentOwnerId();
    const { authData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [openCalendar, setOpenCalendar] = useState(false);
    const [range, setRange] = useState(null);
    const [search, setSearch] = useState("");
    const [pembelian, setPembelian] = useState([]);
    const [openBayar, setOpenBayar] = useState(false);
    const [selectedPembelian, setSelectedPembelian] = useState(null);
    const [bayarNominal, setBayarNominal] = useState(0);
    const [pelunasanPDF, setPelunasanPDF] = useState(null);

    useEffect(() => {
        if (!ownerId || !authData?.token) return;

        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams();

                if (range) {
                    queryParams.append("startDate", range.startDate.toISOString());
                    queryParams.append("endDate", range.endDate.toISOString());
                }

                const res = await fetch(
                    `http://localhost:5000/api/reports/purchases?${queryParams.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authData.token}`
                        }
                    }
                );

                const data = await res.json();

                setPembelian(
                    data.purchases.map(p => ({
                        id: p.id,
                        supplier: p.supplier_name || "-",
                        namaBarang: "-",
                        tanggal: new Date(p.purchase_date),
                        qty: p.total_qty,
                        satuan: "",
                        totalHarga: Number(p.total_amount),
                        dibayar: Number(p.paid_amount),
                        status: p.paid_amount >= p.total_amount ? "paid" : "unpaid",
                        invoiceNumber: p.invoice_number
                    }))
                );

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [ownerId, authData?.token, range]);

    useEffect(() => {
        if (!pelunasanPDF) return;

        const timer = setTimeout(() => {
            const el = document.getElementById("invoice-pelunasan-pdf");
            if (!el) return;

            html2pdf()
                .from(el)
                .set({
                    filename: `Invoice_Pelunasan_${pelunasanPDF.invoiceNumber}.pdf`,
                    margin: 10,
                    html2canvas: { scale: 2 },
                    jsPDF: { format: "a4", orientation: "portrait" },
                })
                .save()
                .then(() => {
                    setPelunasanPDF(null);
                });
        }, 300);

        return () => clearTimeout(timer);
    }, [pelunasanPDF]);


    const filtered = pembelian.filter(p => {
        const keyword = search.toLowerCase();
        if (
            keyword &&
            !(
                p.supplier.toLowerCase().includes(keyword) ||
                p.namaBarang.toLowerCase().includes(keyword)
            )
        ) return false;

        if (range) {
            const d = p.tanggal;

            const start = new Date(range.startDate);
            const [sh, sm] = (range.startTime || "00:00").split(":");
            start.setHours(sh, sm, 0);

            const end = new Date(range.endDate);
            const [eh, em] = (range.endTime || "23:59").split(":");
            end.setHours(eh, em, 59);

            if (d < start || d > end) return false;
        }

        return true;
    });

    const totalPembelian = filtered.reduce((s, p) => s + p.totalHarga, 0);
    const totalDibayar = filtered.reduce((s, p) => s + p.dibayar, 0);
    const totalPiutang = totalPembelian - totalDibayar;

    const handleExportPDF = async () => {
        try {
            if (!authData?.token) {
                alert("Session expired");
                return;
            }

            const queryParams = new URLSearchParams();

            if (range) {
                queryParams.append("startDate", range.startDate.toISOString());
                queryParams.append("endDate", range.endDate.toISOString());
            }

            const response = await fetch(
                `http://localhost:5000/api/reports/purchases/export-pdf?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Gagal export PDF");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `Laporan_Pembelian_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat export PDF");
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`main-content ${sidebarOpen ? "shifted" : ""}`}>
                <header className="content-header">
                    <div className="header-left">
                        <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <img src={toggleIcon} />
                        </button>

                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <img src={backIcon} />
                        </button>

                        <h1>Laporan Pembelian Barang</h1>
                    </div>
                </header>

                <div className="laporan-transaksi-page">

                    <div className="laporan-summary">
                        <div className="summary-card">
                            <span className="summary-label">Total Pembelian</span>
                            <span className="summary-value">
                                Rp {totalPembelian.toLocaleString("id-ID")}
                            </span>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Total Dibayarkan</span>
                            <span className="summary-value">
                                Rp {totalDibayar.toLocaleString("id-ID")}
                            </span>
                        </div>

                        <div className="summary-card">
                            <span className="summary-label">Total Piutang</span>
                            <span className="summary-value">
                                Rp {totalPiutang.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    <div className="laporan-toolbar">
                        <div className="laporan-left">
                            <div className="laporan-search">
                                <img src={searchIcon} />
                                <input
                                    placeholder="Cari supplier / barang"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="laporan-date" onClick={() => setOpenCalendar(true)}>
                                <img src={calendarIcon} />
                                <span>
                                    {range
                                        ? `${range.startDate.toLocaleDateString("id-ID")} ${range.startTime}
                                        - ${range.endDate.toLocaleDateString("id-ID")} ${range.endTime}`
                                        : "Pilih Tanggal"}
                                </span>
                            </div>
                        </div>

                        <button className="btn-primary" onClick={handleExportPDF}>
                            Export PDF
                        </button>
                    </div>

                    <div className="laporan-table-wrapper">
                        <table className="laporan-table">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Nama Barang</th>
                                    <th>Tanggal</th>
                                    <th>Kuantitas</th>
                                    <th>Total Harga</th>
                                    <th>Dibayar</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p.supplier}</td>
                                        <td>{p.namaBarang}</td>
                                        <td>{p.tanggal.toLocaleDateString("id-ID")}</td>
                                        <td>{p.qty} {p.satuan}</td>
                                        <td>Rp {p.totalHarga.toLocaleString("id-ID")}</td>
                                        <td>Rp {p.dibayar.toLocaleString("id-ID")}</td>
                                        <td>
                                            <span className={`status-badge ${p.status}`}>
                                                {p.status === "paid" ? "Lunas" : "Belum Lunas"}
                                            </span>
                                        </td>
                                        <td>
                                            {p.status === "unpaid" && (
                                                <button
                                                    className="btn-outline"
                                                    onClick={() => {
                                                        setSelectedPembelian(p);
                                                        setBayarNominal(0);
                                                        setOpenBayar(true);
                                                    }}
                                                >
                                                    Bayar Sisa
                                                </button>
                                            )}
                                            {p.status === "paid" && (
                                                <button
                                                    className="btn-outline success"
                                                    onClick={() => {
                                                        setPelunasanPDF(p);
                                                    }}
                                                >
                                                    Download Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {openCalendar && (
                    <KalenderTransaksi
                        onApply={(d) => {
                            setRange(d);
                            setOpenCalendar(false);
                        }}
                        onClose={() => setOpenCalendar(false)}
                    />
                )}

                {openBayar && selectedPembelian && (
                    <div className="calendar-overlay">
                        <div className="export-modal">
                            <div className="export-header">
                                <h3>Bayar Sisa Pembelian</h3>
                                <button onClick={() => setOpenBayar(false)}>✕</button>
                            </div>

                            <p className="export-desc">
                                Sisa pembayaran:{" "}
                                <strong>
                                    Rp {(selectedPembelian.totalHarga - selectedPembelian.dibayar)
                                        .toLocaleString("id-ID")}
                                </strong>
                            </p>

                            <input
                                // type="number"
                                value={bayarNominal}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setBayarNominal(val === "" ? "" : Number(val));
                                }}
                                placeholder="Nominal bayar"
                                className="calendar-time-input"
                                style={{ width: "100%" }}
                            />

                            <div className="export-actions">
                                <button className="btn-outline" onClick={() => setOpenBayar(false)}>
                                    Batal
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={async () => {
                                        try {
                                            if (!Number(bayarNominal) || Number(bayarNominal) <= 0) {
                                                alert("Nominal pembayaran tidak valid");
                                                return;
                                            }

                                            const sisa =
                                                selectedPembelian.totalHarga - selectedPembelian.dibayar;

                                            if (bayarNominal > sisa) {
                                                alert("Nominal melebihi sisa pembayaran");
                                                return;
                                            }

                                            const response = await fetch(
                                                "http://localhost:5000/api/reports/purchases/pay",
                                                {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        Authorization: `Bearer ${authData.token}`,
                                                    },
                                                    body: JSON.stringify({
                                                        purchaseId: selectedPembelian.id,
                                                        amount: bayarNominal,
                                                    }),
                                                }
                                            );

                                            const result = await response.json();

                                            if (!response.ok) {
                                                alert(result.message);
                                                return;
                                            }

                                            // Refresh data dari backend
                                            const refresh = await fetch(
                                                "http://localhost:5000/api/reports/purchases",
                                                {
                                                    headers: {
                                                        Authorization: `Bearer ${authData.token}`,
                                                    },
                                                }
                                            );

                                            const data = await refresh.json();

                                            setPembelian(
                                                data.purchases.map(p => ({
                                                    id: p.id,
                                                    supplier: p.supplier_name || "-",
                                                    namaBarang: "-",
                                                    tanggal: new Date(p.purchase_date),
                                                    qty: p.total_qty,
                                                    satuan: "",
                                                    totalHarga: Number(p.total_amount),
                                                    dibayar: Number(p.paid_amount),
                                                    status: p.paid_amount >= p.total_amount ? "paid" : "unpaid",
                                                    invoiceNumber: p.invoice_number
                                                }))
                                            );

                                            setBayarNominal(0);
                                            setSelectedPembelian(null);
                                            setOpenBayar(false);

                                            alert("Pembayaran berhasil disimpan ✅");

                                        } catch (err) {
                                            console.error(err);
                                            alert("Terjadi kesalahan");
                                        }
                                    }}
                                >
                                    Simpan Pembayaran
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {pelunasanPDF && (
                    <div
                        id="invoice-pelunasan-pdf"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "800px",
                            opacity: 0,
                            pointerEvents: "none",
                            zIndex: 9999
                        }}
                    >
                        <PembelianPelunasanPDF data={pelunasanPDF} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LaporanPembelian;
