import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { getCurrentOwnerId } from "../../utils/owner";
import { useMemo } from "react";

import "../../assets/css/ketersediaan.css";
import Sidebar from "../../components/Sidebar";

import searchIcon from "../../assets/icons/search.png";
import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const LaporanKetersediaan = () => {
    const ownerId = getCurrentOwnerId();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("ALL");
    const [items, setItems] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        if (!ownerId) {
            setItems([]);
            return;
        }

        const stocks = JSON.parse(
            localStorage.getItem(`products_${ownerId}`) || "[]"
        );

        const logistics = JSON.parse(
            localStorage.getItem(`logistics_${ownerId}`) || "[]"
        );

        const lastStockByCode = {};

        logistics.forEach((log) => {
            lastStockByCode[String(log.code)] = log;
        });

        const mapped = stocks.map((s) => {
            const lastLog = lastStockByCode[String(s.code)];

            return {
                id: s.id,
                nama: s.name,
                sku: s.code,
                kategori: s.category,
                qty: Number(lastLog?.stock ?? s.stock ?? 0),
                satuan: "pcs",
                hargaModal: Number(s.basePrice || 0),
                hargaJual: Number(s.sellPrice || 0),
            };
        });

        setItems(mapped);

        const uniqueCategories = [
            ...new Set(stocks.map((s) => s.category).filter(Boolean)),
        ];

        setKategoriList(uniqueCategories);

    }, [ownerId]);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const keyword = search.toLowerCase();

            if (
                keyword &&
                !(
                    (item.nama || "").toLowerCase().includes(keyword) ||
                    (item.sku || "").toLowerCase().includes(keyword)
                )
            )
                return false;

            if (kategori !== "ALL" && item.kategori !== kategori) return false;

            return true;
        });
    }, [items, search, kategori]);

    const totalNilaiPersediaan = useMemo(() => {
        return filtered.reduce(
            (s, i) => s + (i.qty || 0) * (i.hargaModal || 0),
            0
        );
    }, [filtered]);

    const handleExport = () => {
        const excel = filtered.map((i, idx) => ({
            No: idx + 1,
            Produk: i.nama,
            SKU: i.sku,
            Kategori: i.kategori,
            Stok: i.qty,
            Satuan: i.satuan,
            HargaModal: i.hargaModal,
            TotalNilai: (i.qty || 0) * (i.hargaModal || 0),
        }));

        const ws = XLSX.utils.json_to_sheet(excel);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ketersediaan Barang");

        XLSX.writeFile(wb, `Laporan_Ketersediaan_${Date.now()}.xlsx`);
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
                            <img src={toggleIcon} />
                        </button>

                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <img src={backIcon} />
                        </button>

                        <h1>Laporan Ketersediaan Barang</h1>
                    </div>
                </header>

                <div className="laporan-ketersediaan-page">
                    <div className="laporan-summary">
                        <div className="summary-card">
                            <span className="summary-label">
                                Total Nilai Persediaan
                            </span>
                            <span className="summary-value">
                                Rp {totalNilaiPersediaan.toLocaleString("id-ID")}
                            </span>
                        </div>
                    </div>

                    <div className="laporan-toolbar">
                        <div className="laporan-left">
                            <div className="laporan-search">
                                <img src={searchIcon} />
                                <input
                                    placeholder="Cari produk / SKU"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <select
                                className="kategori-select"
                                value={kategori}
                                onChange={(e) => setKategori(e.target.value)}
                            >
                                <option value="ALL">Semua Kategori</option>

                                {kategoriList.map((k) => (
                                    <option key={k} value={k}>
                                        {k}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="btn-primary" onClick={handleExport}>
                            Ekspor Laporan
                        </button>
                    </div>

                    <div className="laporan-table-wrapper">
                        <table className="laporan-table">
                            <thead>
                                <tr>
                                    <th>Nama Produk</th>
                                    <th>SKU</th>
                                    <th>Kategori</th>
                                    <th>Kuantitas</th>
                                    <th>Satuan</th>
                                    <th>Harga Modal</th>
                                    <th>Total Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((i) => (
                                    <tr key={i.id}>
                                        <td>{i.nama}</td>
                                        <td>{i.sku}</td>
                                        <td>{i.kategori}</td>
                                        <td>{i.qty}</td>
                                        <td>{i.satuan}</td>
                                        <td>
                                            Rp{" "}
                                            {(i.hargaModal || 0).toLocaleString("id-ID")}
                                        </td>
                                        <td>
                                            Rp{" "}
                                            {(i.qty * (i.hargaModal || 0)).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaporanKetersediaan;
