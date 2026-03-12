import React, { useState, useEffect } from "react";
import { generateStockOpnamePDF } from "../../utils/stockOpnamePDF";
import { getCurrentOwnerId } from "../../utils/owner";
import { useAuth } from "../../context/AuthContext";
import { getInfoToko } from "../../utils/toko";

import Sidebar from "../../components/Sidebar";
import KalenderTransaksi from "../../components/Laporan/KalenderTransaksi";
import CreateOpname from "../../components/Opname/CreateOpname";
import DetailOpname from "../../components/Opname/DetailOpname";

import "../../assets/css/opname.css";

import logoToko from "../../assets/img/logo.png";
import searchIcon from "../../assets/icons/search.png";
import calendarIcon from "../../assets/icons/calendar.png";
import toggleIcon from "../../assets/icons/togglebutton.png";

const Opname = () => {
    const ownerId = getCurrentOwnerId();
    const { authData } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [range, setRange] = useState(null);
    const [search, setSearch] = useState("");
    const [opnameData, setOpnameData] = useState([]);
    const [toko, setToko] = useState(null);

    const [showCreate, setShowCreate] = useState(false);
    const [mode, setMode] = useState("list");
    const [selectedOpname, setSelectedOpname] = useState(null);

    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const formatTanggal = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString.replace(" ", "T"));

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        if (!authData?.token) return;

        const fetchToko = async () => {
            const data = await getInfoToko(authData.token);
            if (data) {
                setToko(data);
            }
        };

        fetchToko();
    }, [authData?.token]);

    const fetchOpname = async () => {
        if (!authData?.token) return;

        try {
            const res = await fetch(
                "http://192.168.2.20:5000/api/opname",
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (!res.ok) {
                console.error("Gagal ambil opname");
                return;
            }

            const data = await res.json();
            setOpnameData(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOpname();
    }, [authData?.token]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, range]);

    const filteredData = opnameData.filter((o) => {
        if (search) {
            const key = search.toLowerCase();

            if (
                !o.kategori?.toLowerCase().includes(key)
            )
                return false;
        }

        if (range) {
            const tgl = new Date(o.tanggal);
            if (tgl < range.startDate || tgl > range.endDate) {
                return false;
            }
        }

        return true;
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus data stock opname ini?")) return;

        try {
            const res = await fetch(
                `http://192.168.2.20:5000/api/opname/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (res.ok) {
                setOpnameData((prev) => prev.filter((o) => o.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
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
                                            <td>{formatTanggal(o.tanggal)}</td>
                                            <td>{o.created_by || "-"}</td>
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
                                                        onClick={async () => {
                                                            try {
                                                                const res = await fetch(
                                                                    `http://192.168.2.20:5000/api/opname/${o.id}`,
                                                                    {
                                                                        headers: {
                                                                            Authorization: `Bearer ${authData.token}`,
                                                                        },
                                                                    }
                                                                );

                                                                if (!res.ok) {
                                                                    alert("Gagal ambil detail opname");
                                                                    return;
                                                                }

                                                                const detail = await res.json();

                                                                generateStockOpnamePDF(detail, toko, logoToko);

                                                            } catch (err) {
                                                                console.error(err);
                                                                alert("Terjadi kesalahan");
                                                            }
                                                        }}
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
                        onUpdate={() => {
                            setMode("list");

                            // refresh data
                            fetchOpname();
                        }}
                    />
                )}

                {showCreate && (
                    <CreateOpname
                        selectedDate={selectedDate}
                        onClose={() => setShowCreate(false)}
                        onSaved={() => {
                            fetchOpname();
                        }}
                    />
                )}

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
