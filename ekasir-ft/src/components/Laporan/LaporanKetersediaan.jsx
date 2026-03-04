import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { getCurrentOwnerId } from "../../utils/owner";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

import "../../assets/css/ketersediaan.css";
import Sidebar from "../../components/Sidebar";

import searchIcon from "../../assets/icons/search.png";
import backIcon from "../../assets/icons/back.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const LaporanKetersediaan = () => {
    const ownerId = getCurrentOwnerId();
    const { authData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("ALL");
    const [items, setItems] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchData = async () => {
            const res = await fetch(
                `http://localhost:5000/api/reports/stock-availability`,
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const data = await res.json();

            if (res.ok && data.items) {
                setItems(data.items);

                const uniqueCategories = [
                    ...new Set(data.items.map((i) => i.category).filter(Boolean)),
                ];

                setKategoriList(uniqueCategories);
            }
        };

        fetchData();
    }, [authData?.token]);

    const filtered = useMemo(() => {
        return items.filter((item) => {
            const keyword = search.toLowerCase();

            if (
                keyword &&
                !(
                    (item.name || "").toLowerCase().includes(keyword) ||
                    (item.code || "").toLowerCase().includes(keyword)
                )
            )
                return false;

            if (kategori !== "ALL" && item.category !== kategori) return false;

            return true;
        });
    }, [items, search, kategori]);

    const totalNilaiPersediaan = useMemo(() => {
        return filtered.reduce(
            (s, i) => s + Number(i.total_nilai || 0),
            0
        );
    }, [filtered]);

    const handleExport = () => {
        const excel = filtered.map((i, idx) => ({
            No: idx + 1,
            Produk: i.name,
            SKU: i.code,
            Kategori: i.category,
            Stok: i.stock,
            Satuan: i.unit,
            HargaModal: i.harga_modal,
            TotalNilai: i.total_nilai,
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
                                        <td>{i.name}</td>
                                        <td>{i.code}</td>
                                        <td>{i.category}</td>
                                        <td>{i.stock}</td>
                                        <td>{i.unit}</td>
                                        <td>
                                            Rp {Number(i.harga_modal || 0).toLocaleString("id-ID")}
                                        </td>
                                        <td>
                                            Rp {Number(i.total_nilai || 0).toLocaleString("id-ID")}
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
