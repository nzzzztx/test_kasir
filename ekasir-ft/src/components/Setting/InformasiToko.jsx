import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "../../assets/css/dashboard.css";
import "../../assets/css/informasi.css";
import tokoIcon from "../../assets/icons/store.png";

const defaultData = {
    jenisUsaha: "",
    namaToko: "",
    pemilik: "",
    telepon: "",
    lokasi: "",
    metodeAkuntansi: "",
    statusOlshop: "",
};

const InformasiToko = () => {
    const { authData } = useAuth();

    const [toko, setToko] = useState(defaultData);
    const [draft, setDraft] = useState(defaultData);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authData?.token) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    "http://localhost:5000/api/store-information",
                    {
                        headers: {
                            Authorization: `Bearer ${authData.token}`,
                        },
                    }
                );

                if (!res.ok) {
                    console.error("Gagal ambil data toko");
                    return;
                }

                const data = await res.json();

                if (data) {
                    const formatted = {
                        jenisUsaha: data.jenis_usaha || "",
                        namaToko: data.nama_toko || "",
                        pemilik: data.pemilik || "",
                        telepon: data.telepon || "",
                        lokasi: data.lokasi || "",
                        metodeAkuntansi: data.metode_akuntansi || "",
                        statusOlshop: data.status_olshop || "",
                    };

                    setToko(formatted);
                    setDraft(formatted);
                }
            } catch (err) {
                console.error(err);
            }

            setLoading(false);
        };

        fetchData();
    }, [authData]);

    const handleSave = async () => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/store-information",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authData.token}`,
                    },
                    body: JSON.stringify(draft),
                }
            );

            if (!res.ok) {
                alert("Gagal menyimpan");
                return;
            }

            alert("Berhasil disimpan");
            setToko(draft);
            setIsEdit(false);

        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan");
        }
    };

    const handleCancel = () => {
        setDraft(toko);
        setIsEdit(false);
    };

    if (!authData) return null;

    if (authData.role !== "owner") {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="main-content">
                    <div style={{ padding: 24 }}>
                        Akses hanya untuk Owner
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="main-content">
                    <div style={{ padding: 24 }}>
                        Loading informasi toko...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <div className="info-page">
                    <div className="info-card">
                        <div className="info-header">
                            <div className="info-avatar">
                                <img src={tokoIcon} alt="Toko" />
                            </div>

                            {!isEdit ? (
                                <button className="btn-edit" onClick={() => setIsEdit(true)}>
                                    Edit Informasi
                                </button>
                            ) : (
                                <div className="btn-group">
                                    <button className="btn-save" onClick={handleSave}>
                                        Simpan
                                    </button>
                                    <button className="btn-cancel" onClick={handleCancel}>
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="info-grid">
                            <InfoRow label="Jenis Usaha" value={draft.jenisUsaha} isEdit={isEdit} onChange={(v) => setDraft({ ...draft, jenisUsaha: v })} />
                            <InfoRow label="Nama Toko" value={draft.namaToko} isEdit={isEdit} onChange={(v) => setDraft({ ...draft, namaToko: v })} />
                            <InfoRow label="Nama Pemilik" value={draft.pemilik} isEdit={isEdit} onChange={(v) => setDraft({ ...draft, pemilik: v })} />
                            <InfoRow label="Nomor Telepon" value={draft.telepon} isEdit={isEdit} onChange={(v) => setDraft({ ...draft, telepon: v })} />
                            <InfoRow label="Lokasi Toko" value={draft.lokasi} isEdit={isEdit} onChange={(v) => setDraft({ ...draft, lokasi: v })} />

                            <div className="info-row">
                                <span>Metode Akuntansi</span>
                                {isEdit ? (
                                    <select value={draft.metodeAkuntansi} onChange={(e) => setDraft({ ...draft, metodeAkuntansi: e.target.value })}>
                                        <option value="">Pilih Metode</option>
                                        <option value="FIFO">FIFO</option>
                                        <option value="LIFO">LIFO</option>
                                    </select>
                                ) : (
                                    <b>{toko.metodeAkuntansi || "-"}</b>
                                )}
                            </div>

                            <div className="info-row">
                                <span>Status Olshop</span>
                                {isEdit ? (
                                    <select value={draft.statusOlshop} onChange={(e) => setDraft({ ...draft, statusOlshop: e.target.value })}>
                                        <option value="">Pilih Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Nonaktif">Nonaktif</option>
                                    </select>
                                ) : (
                                    <b>{toko.statusOlshop || "-"}</b>
                                )}
                            </div>
                        </div>

                        <div className="info-divider" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, isEdit, onChange }) => (
    <div className="info-row">
        <span>{label}</span>
        {isEdit ? (
            <input value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
            <b>{value}</b>
        )}
    </div>
);

export default InformasiToko;