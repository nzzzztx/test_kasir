import React, { useState, useEffect } from "react";
import { generateStockOpnamePDF } from "../../utils/stockOpnamePDF";

import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "../../components/Laporan/KalenderTransaksi";
import CreateOpname from "../../components/Opname/CreateOpname";
import DetailOpname from "../../components/Opname/DetailOpname";

import "../../assets/css/opname.css";

import logoToko from "../../assets/img/logo.png";
import searchIcon from "../../assets/icons/search.png";
import calendarIcon from "../../assets/icons/calendar.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const dummyOpname = [
    {
        id: 1,
        tanggal: "2026-01-02",
        user: "Admin",
        kategori: "Barang Habis Pakai",
        totalItem: 32,
        status: "Selesai",
        items: [],
    },
];

const Opname = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [range, setRange] = useState(null);
    const [search, setSearch] = useState("");
    const [opnameData, setOpnameData] = useState([]);

    const [showCreate, setShowCreate] = useState(false);
    const [mode, setMode] = useState("list");
    const [selectedOpname, setSelectedOpname] = useState(null);

    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );


    useEffect(() => {
        const saved = localStorage.getItem("stock_opname");
        if (saved) {
            setOpnameData(JSON.parse(saved));
        } else {
            localStorage.setItem("stock_opname", JSON.stringify(dummyOpname));
            setOpnameData(dummyOpname);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, range]);

    const filteredData = opnameData.filter((o) => {
        if (search) {
            const key = search.toLowerCase();
            if (
                !o.user.toLowerCase().includes(key) &&
                !o.kategori.toLowerCase().includes(key)
            )
                return false;
        }

        if (range) {
            const tgl = new Date(o.tanggal);
            if (tgl < range.startDate || tgl > range.endDate) return false;
        }

        return true;
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = (id) => {
        if (!window.confirm("Hapus data stock opname ini?")) return;

        const updated = opnameData.filter((o) => o.id !== id);
        setOpnameData(updated);
        localStorage.setItem("stock_opname", JSON.stringify(updated));
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
                            <img src={toggleIcon} alt="toggle" />
                        </button>
                        <h1>Stock Opname</h1>
                    </div>
                </header>

                {mode === "list" && (
                    <div className="opname-page">
                        <div className="opname-toolbar">
                            <div className="opname-left">
                                <div className="opname-search">
                                    <img src={searchIcon} alt="" />
                                    <input
                                        placeholder="Cari opname..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>

                                <div
                                    className="opname-date"
                                    onClick={() => setOpenCalendar(true)}
                                >
                                    <img src={calendarIcon} alt="" />
                                    <span>
                                        {range
                                            ? `${range.startDate.toLocaleDateString("id-ID")} - ${range.endDate.toLocaleDateString("id-ID")}`
                                            : "Pilih Tanggal"}
                                    </span>
                                </div>
                            </div>

                            <button
                                className="opname-btn-primary"
                                onClick={() => setShowCreate(true)}
                            >
                                + Tambah Stok Barang
                            </button>
                        </div>

                        <div className="opname-table-wrapper">
                            <table className="opname-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Pengguna</th>
                                        <th>Kategori</th>
                                        <th>Total Item</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="opname-empty">
                                                Belum ada data stock opname
                                            </td>
                                        </tr>
                                    )}

                                    {paginatedData.map((o) => (
                                        <tr key={o.id}>
                                            <td>{o.tanggal}</td>
                                            <td>{o.user}</td>
                                            <td>{o.kategori}</td>
                                            <td>{o.totalItem}</td>
                                            <td>{o.status}</td>
                                            <td className="opname-actions">
                                                <button
                                                    className="opname-btn-outline"
                                                    onClick={() => {
                                                        setSelectedOpname(o);
                                                        setMode("detail");
                                                    }}
                                                >
                                                    Detail
                                                </button>

                                                {o.status === "Selesai" ? (
                                                    <button
                                                        className="opname-btn-outline"
                                                        onClick={() => generateStockOpnamePDF(o, logoToko)}
                                                    >
                                                        PDF
                                                    </button>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontSize: 11,
                                                            color: "#9ca3af",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        Selesaikan opname dulu
                                                    </span>
                                                )}

                                                <button
                                                    className="opname-btn-danger"
                                                    onClick={() => handleDelete(o.id)}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {mode === "detail" && selectedOpname && (
                    <DetailOpname
                        data={selectedOpname}
                        onBack={() => setMode("list")}
                        onUpdate={(updated) => {
                            const all =
                                JSON.parse(localStorage.getItem("stock_opname")) || [];
                            const newAll = all.map((o) =>
                                o.id === updated.id ? updated : o
                            );
                            localStorage.setItem("stock_opname", JSON.stringify(newAll));
                            setOpnameData(newAll);
                            setSelectedOpname(updated);
                        }}
                    />
                )}

                <CreateOpname
                    open={showCreate}
                    selectedDate={selectedDate}
                    onClose={() => setShowCreate(false)}
                    onSaved={() => {
                        const data =
                            JSON.parse(localStorage.getItem("stock_opname")) || [];
                        setOpnameData(data);
                    }}
                />

                {openCalendar && (
                    <KalenderTransaksi
                        onApply={(d) => {
                            setRange(d);
                            setSelectedDate(
                                d.startDate.toISOString().slice(0, 10)
                            );
                            setOpenCalendar(false);
                        }}
                        onClose={() => setOpenCalendar(false)}
                    />
                )}

            </div>
        </div>
    );
};

export default Opname;
