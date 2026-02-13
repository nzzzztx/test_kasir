import { useState, useEffect } from "react";
import { getCurrentOwnerId } from "../../utils/owner";
import Sidebar from "../../components/Sidebar";
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
    const ownerId = getCurrentOwnerId();

    const STORAGE_KEY = ownerId
        ? `informasi_toko_owner_${ownerId}`
        : null;

    const [toko, setToko] = useState(defaultData);
    const [draft, setDraft] = useState(defaultData);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (!STORAGE_KEY) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        const data = saved ? JSON.parse(saved) : defaultData;

        setToko(data);
        setDraft(data);
    }, [STORAGE_KEY]);

    const handleSave = () => {
        if (!STORAGE_KEY) return;

        setToko(draft);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        setIsEdit(false);
    };

    const handleCancel = () => {
        setDraft(toko);
        setIsEdit(false);
    };

    if (!ownerId) {
        return (
            <div className="dashboard-container">
                <Sidebar />
                <div className="main-content">
                    <div style={{ padding: 24 }}>
                        Owner tidak ditemukan
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
                                <button
                                    className="btn-edit"
                                    onClick={() => setIsEdit(true)}
                                >
                                    Edit Informasi
                                </button>
                            ) : (
                                <div className="btn-group">
                                    <button
                                        className="btn-save"
                                        onClick={handleSave}
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        className="btn-cancel"
                                        onClick={handleCancel}
                                    >
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="info-grid">
                            <InfoRow
                                label="Jenis Usaha"
                                value={draft.jenisUsaha}
                                isEdit={isEdit}
                                onChange={(v) =>
                                    setDraft({ ...draft, jenisUsaha: v })
                                }
                            />

                            <InfoRow
                                label="Nama Toko"
                                value={draft.namaToko}
                                isEdit={isEdit}
                                onChange={(v) =>
                                    setDraft({ ...draft, namaToko: v })
                                }
                            />

                            <InfoRow
                                label="Nama Pemilik"
                                value={draft.pemilik}
                                isEdit={isEdit}
                                onChange={(v) =>
                                    setDraft({ ...draft, pemilik: v })
                                }
                            />

                            <InfoRow
                                label="Nomor Telepon"
                                value={draft.telepon}
                                isEdit={isEdit}
                                onChange={(v) =>
                                    setDraft({ ...draft, telepon: v })
                                }
                            />

                            <InfoRow
                                label="Lokasi Toko"
                                value={draft.lokasi}
                                isEdit={isEdit}
                                onChange={(v) =>
                                    setDraft({ ...draft, lokasi: v })
                                }
                            />

                            <div className="info-row">
                                <span>Metode Akuntansi</span>
                                {isEdit ? (
                                    <select
                                        value={draft.metodeAkuntansi}
                                        onChange={(e) =>
                                            setDraft({
                                                ...draft,
                                                metodeAkuntansi: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Pilih Metode</option>
                                        <option value="FIFO">FIFO</option>
                                        <option value="LIFO">LIFO</option>
                                    </select>
                                ) : (
                                    <b
                                        className={
                                            toko.metodeAkuntansi === "FIFO"
                                                ? "badge-fifo"
                                                : toko.metodeAkuntansi === "LIFO"
                                                    ? "badge-lifo"
                                                    : "badge-empty"
                                        }
                                    >
                                        {toko.metodeAkuntansi || "-"}
                                    </b>
                                )}
                            </div>

                            <div className="info-row">
                                <span>Status Olshop</span>
                                {isEdit ? (
                                    <select
                                        value={draft.statusOlshop}
                                        onChange={(e) =>
                                            setDraft({
                                                ...draft,
                                                statusOlshop: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Pilih Status</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="Nonaktif">
                                            Nonaktif
                                        </option>
                                    </select>
                                ) : (
                                    <b
                                        className={
                                            toko.statusOlshop === "Aktif"
                                                ? "badge-active"
                                                : toko.statusOlshop === "Nonaktif"
                                                    ? "badge-nonactive"
                                                    : "badge-empty"
                                        }
                                    >
                                        {toko.statusOlshop || "-"}
                                    </b>
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
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        ) : (
            <b>{value}</b>
        )}
    </div>
);

export default InformasiToko;
